import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface UIMessageInput {
  role: string;
  content?: string;
  parts?: Array<{ type: string; text?: string }>;
}

function extractText(msg: UIMessageInput): string {
  if (msg.parts) {
    return msg.parts
      .filter((p): p is { type: string; text: string } => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text)
      .join("");
  }
  return msg.content || "";
}

function toStandardMessages(msgs: UIMessageInput[]): Array<{ role: "user" | "assistant"; content: string }> {
  return msgs
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: extractText(m),
    }))
    .filter((m) => m.content.length > 0);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const rawMessages: UIMessageInput[] = body.messages || [];
  const interviewId = body.interviewId;

  const interview = await prisma.interview.findFirst({
    where: { id: interviewId, userId: session.user.id },
    include: { persona: true },
  });

  if (!interview) {
    return new Response("Interview not found", { status: 404 });
  }

  const lastUserMessage = rawMessages[rawMessages.length - 1];
  if (lastUserMessage?.role === "user") {
    const textContent = extractText(lastUserMessage);
    if (textContent) {
      await prisma.message.create({
        data: {
          interviewId,
          role: "user",
          content: textContent,
        },
      });
    }
  }

  const standardMessages = toStandardMessages(rawMessages);

  const result = streamText({
    model: openai("gpt-4o"),
    system: interview.persona.systemPrompt,
    messages: standardMessages,
    onFinish: async ({ text }) => {
      if (text) {
        await prisma.message.create({
          data: {
            interviewId,
            role: "assistant",
            content: text,
          },
        });
      }
      await prisma.interview.update({
        where: { id: interviewId },
        data: { updatedAt: new Date() },
      });
    },
  });

  return result.toUIMessageStreamResponse();
}
