import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import JSZip from "jszip";
import { format } from "date-fns";

function interviewToMarkdown(
  interview: {
    title: string;
    status: string;
    summary: string | null;
    insights: string | null;
    createdAt: Date;
    persona: { name: string; role: string; company: string | null; industry: string | null };
    messages: { role: string; content: string; createdAt: Date }[];
  }
): string {
  let md = `# ${interview.title}\n\n`;
  md += `**Persona:** ${interview.persona.name} — ${interview.persona.role}`;
  if (interview.persona.company) md += ` at ${interview.persona.company}`;
  md += `\n`;
  if (interview.persona.industry) md += `**Industry:** ${interview.persona.industry}\n`;
  md += `**Date:** ${format(new Date(interview.createdAt), "PPP 'at' p")}\n`;
  md += `**Status:** ${interview.status}\n\n`;
  md += `---\n\n## Transcript\n\n`;

  for (const msg of interview.messages) {
    const speaker = msg.role === "user" ? "**Interviewer**" : `**${interview.persona.name}**`;
    md += `${speaker}: ${msg.content}\n\n`;
  }

  if (interview.insights) {
    try {
      const insights = JSON.parse(interview.insights);
      md += `---\n\n## Insights\n\n`;
      if (insights.summary) md += `### Summary\n${insights.summary}\n\n`;
      if (insights.painPoints?.length) {
        md += `### Pain Points\n`;
        for (const p of insights.painPoints) md += `- ${p}\n`;
        md += `\n`;
      }
      if (insights.themes?.length) {
        md += `### Themes\n`;
        for (const t of insights.themes) md += `- ${t}\n`;
        md += `\n`;
      }
      if (insights.keyQuotes?.length) {
        md += `### Key Quotes\n`;
        for (const q of insights.keyQuotes) md += `> ${q}\n\n`;
      }
    } catch {
      // insights not valid JSON, skip
    }
  }

  return md;
}

function interviewToJson(interview: {
  id: string;
  title: string;
  status: string;
  summary: string | null;
  insights: string | null;
  createdAt: Date;
  updatedAt: Date;
  persona: { name: string; role: string; company: string | null; industry: string | null };
  messages: { role: string; content: string; createdAt: Date }[];
}) {
  return {
    id: interview.id,
    title: interview.title,
    status: interview.status,
    date: interview.createdAt,
    persona: interview.persona,
    messages: interview.messages.map((m) => ({
      speaker: m.role === "user" ? "Interviewer" : interview.persona.name,
      role: m.role,
      content: m.content,
      timestamp: m.createdAt,
    })),
    insights: interview.insights ? JSON.parse(interview.insights) : null,
    summary: interview.summary,
  };
}

function interviewsToCsv(
  interviews: {
    id: string;
    title: string;
    status: string;
    summary: string | null;
    insights: string | null;
    createdAt: Date;
    persona: { name: string; role: string; company: string | null; industry: string | null };
    messages: { role: string; content: string; createdAt: Date }[];
  }[]
): string {
  const headers = [
    "Interview ID",
    "Title",
    "Persona",
    "Role",
    "Company",
    "Industry",
    "Date",
    "Status",
    "Messages",
    "Summary",
    "Pain Points",
    "Themes",
  ];

  const rows = interviews.map((i) => {
    let painPoints = "";
    let themes = "";
    if (i.insights) {
      try {
        const ins = JSON.parse(i.insights);
        painPoints = (ins.painPoints || []).join("; ");
        themes = (ins.themes || []).join("; ");
      } catch {
        // skip
      }
    }
    return [
      i.id,
      i.title,
      i.persona.name,
      i.persona.role,
      i.persona.company || "",
      i.persona.industry || "",
      format(new Date(i.createdAt), "yyyy-MM-dd"),
      i.status,
      String(i.messages.length),
      i.summary || "",
      painPoints,
      themes,
    ].map((v) => `"${v.replace(/"/g, '""')}"`);
  });

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { interviewIds, format: exportFormat } = await req.json();

    if (!interviewIds?.length) {
      return NextResponse.json(
        { error: "No interviews selected" },
        { status: 400 }
      );
    }

    const interviews = await prisma.interview.findMany({
      where: {
        id: { in: interviewIds },
        userId: session.user.id,
      },
      include: {
        persona: {
          select: { name: true, role: true, company: true, industry: true },
        },
        messages: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (interviews.length === 1 && exportFormat !== "csv") {
      const interview = interviews[0];
      if (exportFormat === "json") {
        return NextResponse.json(interviewToJson(interview));
      }
      const md = interviewToMarkdown(interview);
      return new Response(md, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${interview.title.replace(/[^a-z0-9]/gi, "_")}.md"`,
        },
      });
    }

    if (exportFormat === "csv") {
      const csv = interviewsToCsv(interviews);
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="interviews_export.csv"',
        },
      });
    }

    const zip = new JSZip();

    for (const interview of interviews) {
      const safeName = interview.title.replace(/[^a-z0-9]/gi, "_");
      if (exportFormat === "json") {
        zip.file(`${safeName}.json`, JSON.stringify(interviewToJson(interview), null, 2));
      } else {
        zip.file(`${safeName}.md`, interviewToMarkdown(interview));
      }
    }

    const summaryData = {
      exportDate: new Date().toISOString(),
      totalInterviews: interviews.length,
      interviews: interviews.map((i) => interviewToJson(i)),
    };
    zip.file("summary.json", JSON.stringify(summaryData, null, 2));

    const zipBuffer = await zip.generateAsync({ type: "uint8array" });

    return new Response(zipBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="interviews_export.zip"',
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to export" },
      { status: 500 }
    );
  }
}
