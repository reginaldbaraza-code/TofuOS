import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildPersonaSystemPrompt } from "@/lib/prompts";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const persona = await prisma.persona.findFirst({
    where: { id, userId: session.user.id },
    include: {
      interviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { interviews: true } },
    },
  });

  if (!persona) {
    return NextResponse.json({ error: "Persona not found" }, { status: 404 });
  }

  return NextResponse.json(persona);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.persona.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Persona not found" }, { status: 404 });
  }

  const data = await req.json();
  const systemPrompt = buildPersonaSystemPrompt({ ...existing, ...data });

  const persona = await prisma.persona.update({
    where: { id },
    data: {
      ...data,
      age: data.age ? parseInt(data.age) : existing.age,
      experienceYears: data.experienceYears
        ? parseInt(data.experienceYears)
        : existing.experienceYears,
      systemPrompt,
    },
  });

  return NextResponse.json(persona);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.persona.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Persona not found" }, { status: 404 });
  }

  await prisma.persona.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
