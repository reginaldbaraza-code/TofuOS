import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildPersonaSystemPrompt } from "@/lib/prompts";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const personas = await prisma.persona.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { interviews: true } } },
  });

  return NextResponse.json(personas);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();

    const systemPrompt =
      data.systemPrompt || buildPersonaSystemPrompt(data);

    const persona = await prisma.persona.create({
      data: {
        userId: session.user.id,
        name: data.name,
        avatarEmoji: data.avatarEmoji || "👤",
        age: data.age ? parseInt(data.age) : null,
        role: data.role,
        company: data.company || null,
        companySize: data.companySize || null,
        industry: data.industry || null,
        experienceYears: data.experienceYears
          ? parseInt(data.experienceYears)
          : null,
        background: data.background || null,
        toolsUsed: data.toolsUsed || null,
        painPoints: data.painPoints || null,
        communicationStyle: data.communicationStyle || null,
        personality: data.personality || null,
        systemPrompt,
        isTemplate: false,
      },
    });

    return NextResponse.json(persona, { status: 201 });
  } catch (e) {
    console.error("Failed to create persona:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create persona" },
      { status: 500 }
    );
  }
}
