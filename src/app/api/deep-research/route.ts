import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { generateText } from "ai";
import { getSession } from "@/lib/supabase/server";
import { getModel, isQuotaError, withRetry } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const query =
      typeof body?.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json(
        { error: "Missing or empty deep search query" },
        { status: 400 }
      );
    }

    // Determine Tavily API key, prefer process.env, fall back to .env.local on disk.
    let tavilyKey = process.env.TAVILY_API_KEY ?? "";
    let keySource: "env" | "file" | "hardcoded" | "none" = "none";

    if (tavilyKey && tavilyKey.length > 0) {
      keySource = "env";
    } else {
      try {
        const envPath = path.join(process.cwd(), ".env.local");
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, "utf8");
          const match = envContent.match(/^TAVILY_API_KEY=(.+)$/m);
          if (match && match[1]) {
            tavilyKey = match[1].trim();
            if (tavilyKey.length > 0) {
              keySource = "file";
            }
          }
        }
      } catch {
        // ignore, we handle missing key below
      }

      // As a final fallback for local dev, use a hardcoded key if available.
      if (!tavilyKey) {
        tavilyKey =
          "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";
        keySource = "hardcoded";
      }
    }

    // #region agent log
    fetch("http://127.0.0.1:7444/ingest/b1f2e795-f8de-4ac8-8321-bd80855c3309", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "cdf419",
      },
      body: JSON.stringify({
        sessionId: "cdf419",
        runId: "env-check",
        hypothesisId: "B",
        location: "src/app/api/deep-research/route.ts:env",
        message: "Tavily key presence check",
        data: {
          hasKey: Boolean(tavilyKey),
          length: tavilyKey.length,
          prefix: tavilyKey.slice(0, 10),
          source: keySource,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log

    if (!tavilyKey) {
      return NextResponse.json(
        { error: "Tavily API key is not configured on the server." },
        { status: 500 }
      );
    }

    const tavilyRes = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tavilyKey}`,
      },
      body: JSON.stringify({
        query,
        search_depth: "advanced",
        include_answer: true,
        max_results: 10,
      }),
    });

    const tavilyText = await tavilyRes.text();

    // #region agent log
    fetch("http://127.0.0.1:7444/ingest/b1f2e795-f8de-4ac8-8321-bd80855c3309", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "cdf419",
      },
      body: JSON.stringify({
        sessionId: "cdf419",
        runId: "pre-fix",
        hypothesisId: "A",
        location: "src/app/api/deep-research/route.ts:tavily-response",
        message: "Tavily HTTP response",
        data: {
          status: tavilyRes.status,
          statusText: tavilyRes.statusText,
          bodyPreview: tavilyText.slice(0, 500),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log

    if (!tavilyRes.ok) {
      console.error("Tavily request failed", {
        status: tavilyRes.status,
        statusText: tavilyRes.statusText,
        body: tavilyText,
      });
      return NextResponse.json(
        { error: "Deep research failed. Please try again." },
        { status: 502 }
      );
    }

    let tavilyData: any = null;
    try {
      tavilyData = JSON.parse(tavilyText);
    } catch {
      console.error("Failed to parse Tavily response as JSON", {
        body: tavilyText,
      });
      return NextResponse.json(
        { error: "Deep research failed. Please try again." },
        { status: 502 }
      );
    }
    const answer: string = (tavilyData?.answer ?? "").toString();
    const results: any[] = Array.isArray(tavilyData?.results)
      ? tavilyData.results
      : [];

    const sourcesText = results
      .map((r, index) => {
        const title = r?.title ?? `Source ${index + 1}`;
        const url = r?.url ?? "";
        const content = (r?.content ?? "").toString();
        return `- ${title}${url ? ` (${url})` : ""}\n  ${content}`;
      })
      .join("\n\n");

    const trimmedAnswer = answer.length > 6000 ? answer.slice(0, 6000) : answer;
    const trimmedSources =
      sourcesText.length > 6000 ? sourcesText.slice(0, 6000) : sourcesText;

    const prompt = `You are helping create a professional persona for synthetic research interviews based on deep web research.

Here is the user's research request:
---
${query}
---

Here is a synthesized answer from Tavily (an AI research engine that searched the web for this query):
---
${trimmedAnswer || "No direct answer was returned."}
---

Here are detailed research snippets and sources from across the web:
---
${trimmedSources || "No detailed sources were returned."}
---

Using ONLY the information above, infer a realistic professional persona who best represents the patterns, roles, responsibilities, and challenges described in the research.

Return a JSON object with EXACTLY these fields:
{
  "name": "A realistic full name grounded in the research context",
  "avatarEmoji": "A single emoji that fits this person's vibe",
  "age": <number or null>,
  "role": "Their exact job title",
  "company": "Company name (real or realistic for this research context)",
  "companySize": "Short description of company size/stage",
  "industry": "Their industry/domain",
  "experienceYears": <number or null>,
  "background": "3-4 sentences summarizing their career history, grounded in the research context",
  "toolsUsed": "Key tools they use (from research or typical for their role and industry)",
  "painPoints": "5-7 specific pain points, 1-2 sentences each, clearly grounded in the research findings",
  "communicationStyle": "How they tend to communicate in interviews",
  "personality": "Key personality traits that would show up in conversation"
}

The persona must feel realistic and clearly connected to the research context. Do not invent a completely unrelated persona.

Return only the JSON object, with no additional explanation.`;

    const { text: modelText } = await withRetry(() =>
      generateText({
        model: getModel(),
        prompt,
        temperature: 0.8,
      })
    );

    const jsonMatch = modelText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse generated persona from deep research" },
        { status: 500 }
      );
    }

    const persona = JSON.parse(jsonMatch[0]);

    return NextResponse.json(persona);
  } catch (err) {
    const message = isQuotaError(err)
      ? "AI quota exceeded. Wait a minute and try again."
      : "Deep research failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

