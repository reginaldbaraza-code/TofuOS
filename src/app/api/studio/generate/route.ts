import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateWithFallback, QUOTA_EXCEEDED_MESSAGE } from "@/lib/ai";

const MAX_CONTEXT_PER_SOURCE = 28000;
const MAX_CONTEXT_TOTAL = 120000;

function buildSourceContextWithContent(sources: { name: string; type: string; content?: string | null }[]): string {
  let total = 0;
  const parts: string[] = [];
  for (const s of sources) {
    const content = s.content?.trim();
    const text = content
      ? content.length > MAX_CONTEXT_PER_SOURCE
        ? content.slice(0, MAX_CONTEXT_PER_SOURCE) + '\n\n[... truncated ...]'
        : content
      : '(No extracted text for this source.)';
    const block = `--- Source: ${s.name} [${s.type}] ---\n${text}`;
    if (total + block.length > MAX_CONTEXT_TOTAL) {
      parts.push(block.slice(0, MAX_CONTEXT_TOTAL - total) + '\n\n[... more sources omitted ...]');
      break;
    }
    parts.push(block);
    total += block.length;
  }
  return parts.join('\n\n');
}

const DOCUMENT_PROMPTS: Record<string, string> = {
  prd: `Write a Product Requirements Document (PRD) using ONLY the provided sources. Include: problem statement, goals, user personas, functional requirements, success metrics, and out-of-scope—all derived from and citing the source content.`,
  "coding-rules": `Create AI Coding Rules & Standards using the project context from the sources. Include: code style, naming, file structure, testing—tailored to what the sources describe (e.g. stack, conventions).`,
  "api-docs": `Generate API Documentation from the sources. Include: overview, authentication, endpoints with request/response examples. Infer the API surface from the actual content (docs, specs, or code references) in the sources.`,
  accessibility: `Write an Accessibility Compliance checklist and recommendations using the product and context from the sources. Reference specific features or flows mentioned in the sources.`,
  architecture: `Create an App Architecture Plan from the sources. Include: modules, data flow, tech stack, deployment—all inferred from the provided content.`,
  "bug-fix": `Produce a Bug Investigation & Fix Plan using the sources. Base reproduction steps, root causes, and fix plan on the actual content (e.g. error reports, logs, descriptions).`,
  competitive: `Write a Competitive Analysis Report using the sources. Competitors, features, and recommendations must come from the provided content (reviews, interviews, market docs).`,
  "journey-map": `Create a Customer Journey Map from the sources. Stages, touchpoints, pain points, and opportunities must be derived from the source content (e.g. reviews, interviews).`,
  "db-schema": `Propose a Database Schema Design from the sources. Entities, relationships, and tables must be inferred from the domain and content provided.`,
  "feature-spec": `Write a Feature Implementation Spec from the sources. Scope, acceptance criteria, and technical approach must be grounded in the source content.`,
  gtm: `Create a Go-to-Market Plan using the sources. Target audience, positioning, channels, and metrics must be derived from the provided content.`,
};

export async function POST(req: Request) {
  try {
    const { documentType, sourceIds } = await req.json();

    if (!documentType || typeof documentType !== 'string') {
      return NextResponse.json({ message: 'documentType is required' }, { status: 400 });
    }

    const hasOpenAI = !!process.env.OPENAI_API_KEY?.trim();
    const hasGemini = !!process.env.GOOGLE_GEMINI_API_KEY?.trim();
    const hasGroq = !!process.env.GROQ_API_KEY?.trim();
    if (!hasOpenAI && !hasGemini && !hasGroq) {
      return NextResponse.json(
        { message: "Set OPENAI_API_KEY, GOOGLE_GEMINI_API_KEY, or GROQ_API_KEY in .env.local to enable Studio." },
        { status: 503 }
      );
    }

    const instruction = DOCUMENT_PROMPTS[documentType];
    if (!instruction) {
      return NextResponse.json({ message: `Unknown document type: ${documentType}` }, { status: 400 });
    }

    if (!sourceIds || !Array.isArray(sourceIds) || sourceIds.length === 0) {
      return NextResponse.json(
        { message: "Select at least one source. Studio documents are generated from your added sources." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    let sourceContext = "No sources selected.";

    if (supabaseUrl && supabaseAnonKey && sourceIds && Array.isArray(sourceIds) && sourceIds.length > 0) {
      const authHeader = req.headers.get('Authorization');
      const token = authHeader?.replace(/^Bearer\s+/i, '').trim();
      const supabase = createClient(supabaseUrl, supabaseAnonKey, token
        ? { global: { headers: { Authorization: `Bearer ${token}` } } }
        : undefined
      );
      const { data: sources } = await supabase
        .from('sources')
        .select('id, name, type, meta, content')
        .in('id', sourceIds);
      if (sources && sources.length > 0) {
        sourceContext = buildSourceContextWithContent(sources);
      }
    }

    const prompt = `You are a product and engineering assistant. The user has selected specific sources; below is the actual content extracted from each source. You MUST generate the requested document using ONLY the information from these sources. Do not produce generic templates—every section must be grounded in the source content (quotes, data, or concrete details from the sources). If the sources do not contain enough information for a section, say so and summarise what is available.

${sourceContext}

Task: ${instruction}

Generate the full document based on the sources above. Use markdown (headers, lists, code blocks where appropriate). Every claim or recommendation must trace back to the provided sources. Do not include meta-commentary; output only the document.`;

    const content = await generateWithFallback([{ role: "user", content: prompt }]);

    return NextResponse.json({ content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const isQuota = message.includes("429") || message.includes("quota") || message.includes("Too Many Requests") || message.includes("Quota exceeded");
    console.error('Studio Generate Error:', error);
    if (isQuota) {
      return NextResponse.json({ message: QUOTA_EXCEEDED_MESSAGE }, { status: 429 });
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
