"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";

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
  const router = useRouter();
  const [interview, setInterview] = useState<InterviewReview | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

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

  const exportInterview = async (fmt: "markdown" | "json") => {
    setExporting(true);
    try {
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
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        downloadBlob(blob, `${interview?.title || "interview"}.json`);
      } else {
        const text = await res.text();
        const blob = new Blob([text], { type: "text/markdown" });
        downloadBlob(blob, `${interview?.title || "interview"}.md`);
      }
    } catch {
      alert("Export failed");
    } finally {
      setExporting(false);
    }
  };

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

  if (loading || !interview) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm animate-pulse-slow" style={{ color: "var(--muted)" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-6 text-sm transition-colors hover:opacity-80"
        style={{ color: "var(--accent)" }}
      >
        ← Dashboard
      </button>

      <div className="animate-fade-in">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{interview.persona.avatarEmoji}</span>
            <div>
              <h1 className="text-xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
                {interview.title}
              </h1>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {interview.persona.role}
                {interview.persona.company ? ` at ${interview.persona.company}` : ""} ·{" "}
                {format(new Date(interview.createdAt), "PPP")}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {interview.messages.length} messages ·{" "}
                {interview.status === "completed" ? "Completed" : "Active"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportInterview("markdown")}
              disabled={exporting}
              className="rounded-xl px-3 py-2 text-xs font-medium transition-all hover:opacity-80 disabled:opacity-50"
              style={{ background: "var(--muted-bg)", color: "var(--foreground)" }}
            >
              Export .md
            </button>
            <button
              onClick={() => exportInterview("json")}
              disabled={exporting}
              className="rounded-xl px-3 py-2 text-xs font-medium transition-all hover:opacity-80 disabled:opacity-50"
              style={{ background: "var(--muted-bg)", color: "var(--foreground)" }}
            >
              Export .json
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Transcript
            </h2>
            <div
              className="rounded-2xl border p-4 sm:p-5"
              style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
            >
              <div className="space-y-4">
                {interview.messages.map((msg) => (
                  <div key={msg.id}>
                    <p className="mb-1 text-xs font-semibold" style={{ color: msg.role === "user" ? "var(--accent)" : "var(--foreground)" }}>
                      {msg.role === "user" ? "You" : interview.persona.name}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {insights && (
            <div className="w-full shrink-0 lg:w-80">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                AI Insights
              </h2>
              <div className="space-y-4">
                {insights.summary && (
                  <InsightCard title="Summary">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {insights.summary}
                    </p>
                  </InsightCard>
                )}

                {insights.painPoints && insights.painPoints.length > 0 && (
                  <InsightCard title="Pain Points">
                    <ul className="space-y-1.5">
                      {insights.painPoints.map((p, i) => (
                        <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--foreground)" }}>
                          <span style={{ color: "var(--danger)" }}>•</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </InsightCard>
                )}

                {insights.themes && insights.themes.length > 0 && (
                  <InsightCard title="Themes">
                    <div className="flex flex-wrap gap-1.5">
                      {insights.themes.map((t, i) => (
                        <span
                          key={i}
                          className="rounded-full px-2.5 py-1 text-xs"
                          style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </InsightCard>
                )}

                {insights.keyQuotes && insights.keyQuotes.length > 0 && (
                  <InsightCard title="Key Quotes">
                    <div className="space-y-2">
                      {insights.keyQuotes.map((q, i) => (
                        <blockquote
                          key={i}
                          className="border-l-2 pl-3 text-sm italic"
                          style={{ borderColor: "var(--accent)", color: "var(--muted)" }}
                        >
                          &ldquo;{q}&rdquo;
                        </blockquote>
                      ))}
                    </div>
                  </InsightCard>
                )}

                {insights.recommendations && insights.recommendations.length > 0 && (
                  <InsightCard title="Follow-up Ideas">
                    <ul className="space-y-1.5">
                      {insights.recommendations.map((r, i) => (
                        <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--foreground)" }}>
                          <span style={{ color: "var(--success)" }}>→</span>
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

function InsightCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
