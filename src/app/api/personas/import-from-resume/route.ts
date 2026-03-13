import { NextRequest, NextResponse } from "next/server";
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
    const resumeText = typeof body?.resumeText === "string" ? body.resumeText.trim() : "";

    if (!resumeText) {
      return NextResponse.json(
        { error: "Missing or empty resume text" },
        { status: 400 }
      );
    }

    const prompt = `You are helping create a Product Manager persona for synthetic interviews based on a resume.

Here is the full resume text:
---
${resumeText}
---

From this resume, infer the real person: use their actual name, role, company, experience, and background. Do NOT invent a different person (e.g. do not replace "Max Mustermann" with "Sarah Chen"). Return a JSON object that reflects THIS resume with EXACTLY these fields:
{
  "name": "Full name from the resume",
  "avatarEmoji": "A single emoji that fits this person",
  "age": <number or null>,
  "role": "Current or most recent role",
  "company": "Current company or null",
  "companySize": "Short description of company size/stage or null",
  "industry": "Industry/domain or null",
  "experienceYears": <number or null>,
  "background": "3-4 sentences summarizing their career history from the resume",
  "toolsUsed": "Key tools they use (from resume or typical for their role)",
  "painPoints": "5-7 specific pain points, 1-2 sentences each",
  "communicationStyle": "How they tend to communicate in interviews",
  "personality": "Key personality traits that would show up in conversation"
}

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
        { error: "Failed to parse generated persona" },
        { status: 500 }
      );
    }

    const persona = JSON.parse(jsonMatch[0]);

    return NextResponse.json(persona);
  } catch (err) {
    const message = isQuotaError(err)
      ? "AI quota exceeded. Wait a minute and try again."
      : "Failed to import resume.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

