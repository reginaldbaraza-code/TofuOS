"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Card, ExportPanel, Badge, Skeleton } from "@/components/ui";
import { ChevronLeft } from "lucide-react";

interface InterviewReview {
  id: string;
  title: string;
  status: string;
  summary: string | null;
  insights: string | null;
  createdAt: string;
  persona: {
    name: string;
    avatarEmoji: string;
    role: string;
    company: string | null;
  };
  messages: {
    id: string;
    role: string;
    content: string;
    createdAt: string;
  }[];
}

interface Insights {
  summary?: string;
  painPoints?: string[];
  themes?: string[];
  keyQuotes?: string[];
  recommendations?: string[];
}

export default function InterviewReviewPage() {
  const params = useParams();
  const [interview, setInterview] = useState<InterviewReview | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/interviews/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setInterview(data);
        if (data.insights) {
          try {
            setInsights(JSON.parse(data.insights));
          } catch {
            // skip
          }
        }
        setLoading(false);
      });
  }, [params.id]);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.replace(/[^a-z0-9._-]/gi, "_");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportInterview = async (fmt: "markdown" | "json" | "csv") => {
    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interviewIds: [params.id],
        format: fmt,
      }),
    });
    if (fmt === "json") {
      const data = await res.json();
      downloadBlob(
        new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
        `${interview?.title || "interview"}.json`
      );
    } else if (fmt === "markdown") {
      const text = await res.text();
      downloadBlob(new Blob([text], { type: "text/markdown" }), `${interview?.title || "interview"}.md`);
    }
  };

  if (loading || !interview) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-6 h-6 w-32" />
        <Skeleton className="mb-8 h-24 w-full" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] transition-colors hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Dashboard
      </Link>

      <div className="animate-fade-in">
        {/* Hero */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{interview.persona.avatarEmoji}</span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                {interview.title}
              </h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {interview.persona.role}
                {interview.persona.company ? ` at ${interview.persona.company}` : ""} ·{" "}
                {format(new Date(interview.createdAt), "PPP")}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={interview.status === "completed" ? "success" : "accent"}>
                  {interview.status === "completed" ? "Completed" : "Active"}
                </Badge>
                <span className="text-xs text-[var(--muted)]">
                  {interview.messages.length} messages
                </span>
              </div>
            </div>
          </div>
          <ExportPanel onExport={exportInterview} variant="single" />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 min-w-0">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Transcript
            </h2>
            <Card padding="lg">
              <div className="space-y-5">
                {interview.messages.map((msg) => (
                  <div key={msg.id}>
                    <p
                      className={`mb-1 text-xs font-semibold ${
                        msg.role === "user"
                          ? "text-[var(--accent)]"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {msg.role === "user" ? "You" : interview.persona.name}
                    </p>
                    <p className="text-sm leading-relaxed text-[var(--foreground)]">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {insights && (
            <div className="w-full shrink-0 lg:w-80">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                AI Insights
              </h2>
              <div className="space-y-4">
                {insights.summary && (
                  <InsightCard title="Summary">
                    <p className="text-sm leading-relaxed text-[var(--foreground)]">
                      {insights.summary}
                    </p>
                  </InsightCard>
                )}
                {insights.painPoints && insights.painPoints.length > 0 && (
                  <InsightCard title="Pain points">
                    <ul className="space-y-2">
                      {insights.painPoints.map((p, i) => (
                        <li key={i} className="flex gap-2 text-sm text-[var(--foreground)]">
                          <span className="text-[var(--danger)]">•</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </InsightCard>
                )}
                {insights.themes && insights.themes.length > 0 && (
                  <InsightCard title="Themes">
                    <div className="flex flex-wrap gap-2">
                      {insights.themes.map((t, i) => (
                        <Badge key={i} variant="accent">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </InsightCard>
                )}
                {insights.keyQuotes && insights.keyQuotes.length > 0 && (
                  <InsightCard title="Key quotes">
                    <div className="space-y-3">
                      {insights.keyQuotes.map((q, i) => (
                        <blockquote
                          key={i}
                          className="border-l-2 border-[var(--accent)] pl-3 text-sm italic text-[var(--muted)]"
                        >
                          &ldquo;{q}&rdquo;
                        </blockquote>
                      ))}
                    </div>
                  </InsightCard>
                )}
                {insights.recommendations && insights.recommendations.length > 0 && (
                  <InsightCard title="Follow-up ideas">
                    <ul className="space-y-2">
                      {insights.recommendations.map((r, i) => (
                        <li key={i} className="flex gap-2 text-sm text-[var(--foreground)]">
                          <span className="text-[var(--success)]">→</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </InsightCard>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InsightCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card padding="md">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        {title}
      </h3>
      {children}
    </Card>
  );
}
