import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { interviewId } = await req.json();

    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId: session.user.id },
      include: {
        persona: { select: { name: true, role: true, company: true } },
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    const transcript = interview.messages
      .map(
        (m) =>
          `${m.role === "user" ? "Interviewer" : interview.persona.name}: ${m.content}`
      )
      .join("\n\n");

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze this interview transcript with ${interview.persona.name} (${interview.persona.role}${interview.persona.company ? ` at ${interview.persona.company}` : ""}).

Extract the following in JSON format:
{
  "summary": "A 2-3 sentence summary of the interview",
  "painPoints": ["Array of specific pain points mentioned or implied"],
  "themes": ["Array of recurring themes/topics"],
  "keyQuotes": ["Array of notable direct quotes from the interviewee"],
  "recommendations": ["Array of follow-up questions or areas to explore in future interviews"]
}

Transcript:
${transcript}`,
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse insights" },
        { status: 500 }
      );
    }

    const insights = JSON.parse(jsonMatch[0]);

    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: "completed",
        summary: insights.summary,
        insights: JSON.stringify(insights),
      },
    });

    return NextResponse.json(insights);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
