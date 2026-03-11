import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { auth } from "@/lib/auth";
import { buildPersonaGenerationPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = await req.json();

    const prompt = buildPersonaGenerationPrompt(params);

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.9,
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse generated persona" },
        { status: 500 }
      );
    }

    const persona = JSON.parse(jsonMatch[0]);

    return NextResponse.json(persona);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate persona" },
      { status: 500 }
    );
  }
}
