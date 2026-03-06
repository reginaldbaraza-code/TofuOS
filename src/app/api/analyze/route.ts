import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateWithFallback, QUOTA_EXCEEDED_MESSAGE } from "@/lib/ai";

const MAX_CONTEXT_PER_SOURCE = 28000;  // chars per source to stay within context
const MAX_CONTEXT_TOTAL = 120000;      // total chars across all sources

function buildSourceContextWithContent(sources: { name: string; type: string; meta?: unknown; content?: string | null }[]): string {
  let total = 0;
  const parts: string[] = [];
  for (const s of sources) {
    const content = s.content?.trim();
    const text = content
      ? content.length > MAX_CONTEXT_PER_SOURCE
        ? content.slice(0, MAX_CONTEXT_PER_SOURCE) + '\n\n[... truncated ...]'
        : content
      : '(No extracted text for this source. Add a PDF or text file to include its content.)';
    const block = `--- Source: ${s.name} [${s.type}] ---\n${text}`;
    if (total + block.length > MAX_CONTEXT_TOTAL) {
      parts.push(block.slice(0, MAX_CONTEXT_TOTAL - total) + '\n\n[... more sources omitted for length ...]');
      break;
    }
    parts.push(block);
    total += block.length;
  }
  return parts.join('\n\n');
}

export async function POST(req: Request) {
  try {
    const { sourceIds } = await req.json();

    if (!sourceIds || sourceIds.length === 0) {
      return NextResponse.json({ insights: [] });
    }

    const hasOpenAI = !!process.env.OPENAI_API_KEY?.trim();
    const hasGemini = !!process.env.GOOGLE_GEMINI_API_KEY?.trim();
    const hasGroq = !!process.env.GROQ_API_KEY?.trim();
    if (!hasOpenAI && !hasGemini && !hasGroq) {
      return NextResponse.json(
        { message: "Set OPENAI_API_KEY, GOOGLE_GEMINI_API_KEY, or GROQ_API_KEY in .env.local to enable analysis." },
        { status: 503 }
      );
    }

    // Fetch source details and content from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    let sourceContext = `Source IDs: ${sourceIds.join(', ')}.`;

    if (supabaseUrl && supabaseAnonKey) {
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

    const prompt = `You are a senior product manager. The user has selected sources (interviews, docs, reviews) below. Your job is to produce ACTIONABLE INSIGHTS: for each finding you must state the PROBLEM and a concrete ACTION to fix it. No generic summaries.

Rules:
- Each insight = one specific problem or gap identified in the sources + one concrete action to fix it.
- Problem: what is wrong or missing, tied to specific evidence (quote or fact from a source).
- Action: who does what, in what format or by when. Examples: "Product owner: run 3 user interviews with segment X by end of sprint"; "Engineering: add error logging for flow Y and set up alert"; "Design: create a discovery interview script for [topic] and share in Figma by Friday."
- Do NOT give vague advice ("improve UX", "listen to users"). Be specific and executable.
- Use the exact source names from the "Source: ..." headers when citing.

${sourceContext}

Generate a number of insights that fits the sources: enough to cover the main problems and opportunities (typically 3–8). For each insight return a JSON object with:
1. summary: Short title for the problem (suitable as a ticket title). E.g. "No direct access to end customers (PO hypothesis risk)".
2. description: 2–3 sentences stating the problem and why it matters, with a specific reference to the source(s).
3. action: One concrete, executable action to fix the problem. Format: "Who: what to do, by when or in what format." Must be something a team can do without further clarification.
4. sourceNames: Array of exact source names from the headers above that this insight is based on.
5. evidence: A direct quote or specific fact from the source(s) that supports this finding.

Return a valid JSON object with a single key "insights" containing an array of objects (each with keys "summary", "description", "action", "sourceNames", "evidence"). Do not pad with extra insights; only include as many as are justified by the evidence.

Example:
{"insights": [
  {"summary": "Discovery gap: no direct access to end customers", "description": "The PO reports...", "action": "Product owner: Schedule 2–3 discovery interviews...", "sourceNames": ["Stefan.pdf"], "evidence": "'Finding those customers...'"},
  ...
]}`;

    const text = await generateWithFallback([{ role: "user", content: prompt }]);
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedText);
    const rawInsights = Array.isArray(parsed.insights) ? parsed.insights : [];
    const data = {
      insights: rawInsights.map((item: { summary?: string; description?: string; sourceNames?: string[]; evidence?: string; action?: string }) => ({
        summary: item.summary ?? "",
        description: item.description ?? "",
        sourceNames: Array.isArray(item.sourceNames) ? item.sourceNames : [],
        evidence: typeof item.evidence === "string" ? item.evidence : "",
        action: typeof item.action === "string" ? item.action : "",
      })),
    };

    const suggestedPrompts = [
      "Prioritise these insights and suggest what to build first.",
      "Turn the first insight into a short PRD outline.",
    ];
    return NextResponse.json({ ...data, suggestedPrompts });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const isQuota = message.includes("429") || message.includes("quota") || message.includes("Too Many Requests") || message.includes("Quota exceeded");
    console.error('Gemini Analysis Error:', error);
    if (isQuota) {
      return NextResponse.json({ message: QUOTA_EXCEEDED_MESSAGE }, { status: 429 });
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
