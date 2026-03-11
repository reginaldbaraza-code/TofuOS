import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const interviews = await prisma.interview.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      persona: { select: { name: true, avatarEmoji: true, role: true, company: true } },
      _count: { select: { messages: true } },
    },
  });

  return NextResponse.json(interviews);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { personaId, title } = await req.json();

    if (!personaId) {
      return NextResponse.json(
        { error: "Persona ID is required" },
        { status: 400 }
      );
    }

    const persona = await prisma.persona.findFirst({
      where: { id: personaId, userId: session.user.id },
    });

    if (!persona) {
      return NextResponse.json(
        { error: "Persona not found" },
        { status: 404 }
      );
    }

    const interview = await prisma.interview.create({
      data: {
        userId: session.user.id,
        personaId,
        title: title || `Interview with ${persona.name}`,
        status: "active",
      },
      include: {
        persona: true,
      },
    });

    return NextResponse.json(interview, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 }
    );
  }
}
