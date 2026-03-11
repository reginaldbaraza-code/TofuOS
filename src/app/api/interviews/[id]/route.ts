import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const interview = await prisma.interview.findFirst({
    where: { id, userId: session.user.id },
    include: {
      persona: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!interview) {
    return NextResponse.json(
      { error: "Interview not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(interview);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.interview.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Interview not found" },
      { status: 404 }
    );
  }

  const data = await req.json();

  const interview = await prisma.interview.update({
    where: { id },
    data: {
      status: data.status,
      summary: data.summary,
      insights: data.insights,
    },
  });

  return NextResponse.json(interview);
}
