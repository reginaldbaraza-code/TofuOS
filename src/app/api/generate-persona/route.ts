import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { getSession } from "@/lib/supabase/server";
import { buildPersonaGenerationPrompt, buildQuickPersonaPrompt } from "@/lib/prompts";
import { getGeminiModel, withGeminiRetry, isQuotaError } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const quickPrompt = typeof body.quickPrompt === "string" && body.quickPrompt.trim();

    const prompt = quickPrompt
      ? buildQuickPersonaPrompt(body.quickPrompt.trim())
      : buildPersonaGenerationPrompt({
          role: body.role,
          company: body.company,
          companySize: body.companySize,
          industry: body.industry,
          experienceYears: body.experienceYears
            ? parseInt(body.experienceYears, 10)
            : undefined,
          additionalContext: body.additionalContext,
        });

    const { text } = await withGeminiRetry(() =>
      generateText({
        model: getGeminiModel(),
        prompt,
        temperature: 0.9,
      })
    );

    const jsonMatch = text.match(/\{[\s\S]*\}/);
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
      ? "Gemini quota exceeded. Wait a minute and try again, or set GEMINI_MODEL=gemini-2.0-flash for the free tier."
      : "Failed to generate persona.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
