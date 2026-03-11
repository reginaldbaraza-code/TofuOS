"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { PageHeader, Card, Badge, EmptyState, Button, Skeleton } from "@/components/ui";
import { Lightbulb, FileText, Download } from "lucide-react";

interface InterviewSummary {
  id: string;
  title: string;
  status: string;
  summary: string | null;
  insights: string | null;
  createdAt: string;
  updatedAt: string;
  persona: {
    name: string;
    avatarEmoji: string;
    role: string;
    company: string | null;
  };
  _count: { messages: number };
}

interface ParsedInsights {
  summary?: string;
  painPoints?: string[];
  themes?: string[];
  keyQuotes?: string[];
}

export default function InsightsPage() {
  const [interviews, setInterviews] = useState<InterviewSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed">("all");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch("/api/interviews")
      .then((r) => r.json())
      .then((data) => {
        setInterviews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    filter === "completed"
      ? interviews.filter((i) => i.status === "completed")
      : interviews;
  const completed = interviews.filter((i) => i.status === "completed");

  const allThemes = new Map<string, number>();
  const allPainPoints = new Map<string, number>();
  completed.forEach((i) => {
    if (!i.insights) return;
    try {
      const parsed: ParsedInsights = JSON.parse(i.insights);
      parsed.themes?.forEach((t) => allThemes.set(t, (allThemes.get(t) || 0) + 1));
      parsed.painPoints?.forEach((p) =>
        allPainPoints.set(p, (allPainPoints.get(p) || 0) + 1)
      );
    } catch {
      // skip
    }
  });
  const topThemes = Array.from(allThemes.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const topPainPoints = Array.from(allPainPoints.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleBulkExport = async (fmt: "markdown" | "json") => {
    if (completed.length === 0) return;
    setExporting(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewIds: completed.map((i) => i.id),
          format: fmt,
        }),
      });
      const contentType = res.headers.get("content-type") || "";
      let blob: Blob;
      let filename: string;
      if (contentType.includes("application/zip")) {
        blob = await res.blob();
        filename = "insights_export.zip";
      } else if (fmt === "json") {
        const data = await res.json();
        blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        filename = "insights.json";
      } else {
        const text = await res.text();
        blob = new Blob([text], { type: "text/markdown" });
        filename = "insights.md";
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <Skeleton className="mb-2 h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} padding="md">
              <Skeleton className="mb-3 h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Insights"
        description="Recurring themes, pain points, and learnings across your interviews. Your research repository."
        action={
          completed.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={() => handleBulkExport("markdown")}
                disabled={exporting}
              >
                Export .md
              </Button>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={() => handleBulkExport("json")}
                disabled={exporting}
              >
                Export .json
              </Button>
            </div>
          ) : null
        }
      />

      {/* Aggregated themes & pain points */}
      {completed.length > 0 && (topThemes.length > 0 || topPainPoints.length > 0) && (
        <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Across {completed.length} interview{completed.length !== 1 ? "s" : ""}
          </span>
        </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {topThemes.length > 0 && (
              <Card padding="md">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Recurring themes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topThemes.map(([theme, count]) => (
                    <Badge key={theme} variant="accent">
                      {theme}
                      <span className="ml-1 opacity-80">×{count}</span>
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
            {topPainPoints.length > 0 && (
              <Card padding="md">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Top pain points
                </h3>
                <ul className="space-y-2">
                  {topPainPoints.map(([point]) => (
                    <li
                      key={point}
                      className="flex gap-2 text-sm text-[var(--foreground)]"
                    >
                      <span className="text-[var(--danger)]">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Interview list */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            All interviews
          </h2>
          <div className="flex gap-1 rounded-[var(--radius-lg)] bg-[var(--muted-bg)] p-1">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === "all"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-[var(--shadow-sm)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("completed")}
              className={`rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === "completed"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-[var(--shadow-sm)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {interviews.length === 0 ? (
          <EmptyState
            icon="💡"
            title="No insights yet"
            description="Complete interviews and run analysis to see recurring themes and pain points here."
            action={{ label: "Go to Interviews", href: "/interviews" }}
            secondaryAction={{ label: "Dashboard", href: "/dashboard" }}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((interview) => (
              <Link
                key={interview.id}
                href={`/interviews/${interview.id}/review`}
                className="block"
              >
                <Card
                  padding="md"
                  className="flex items-center gap-4 transition-all hover:shadow-[var(--shadow-md)]"
                >
                  <span className="text-3xl">{interview.persona.avatarEmoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[var(--foreground)]">
                      {interview.title}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {interview.persona.role}
                      {interview.persona.company
                        ? ` at ${interview.persona.company}`
                        : ""}{" "}
                      · {interview._count.messages} messages ·{" "}
                      {formatDistanceToNow(new Date(interview.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <Badge
                    variant={
                      interview.status === "completed" ? "success" : "accent"
                    }
                  >
                    {interview.status === "completed" ? "Analyzed" : "Active"}
                  </Badge>
                  <FileText className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
