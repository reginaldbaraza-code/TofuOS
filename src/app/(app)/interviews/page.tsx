"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Interview {
  id: string;
  title: string;
  status: string;
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

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch("/api/interviews")
      .then((r) => r.json())
      .then((data) => {
        setInterviews(data);
        setLoading(false);
      });
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === interviews.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(interviews.map((i) => i.id)));
    }
  };

  const bulkExport = async (fmt: "markdown" | "json" | "csv") => {
    if (selected.size === 0) return;
    setExporting(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewIds: Array.from(selected),
          format: fmt,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      let blob: Blob;
      let filename: string;

      if (contentType.includes("application/zip")) {
        blob = await res.blob();
        filename = "interviews_export.zip";
      } else if (contentType.includes("text/csv")) {
        const text = await res.text();
        blob = new Blob([text], { type: "text/csv" });
        filename = "interviews_export.csv";
      } else if (contentType.includes("text/markdown")) {
        const text = await res.text();
        blob = new Blob([text], { type: "text/markdown" });
        filename = "interview.md";
      } else {
        const data = await res.json();
        blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        filename = "interview.json";
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
      alert("Export failed");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm animate-pulse-slow" style={{ color: "var(--muted)" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
            Interviews
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {interviews.length} interview{interviews.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      {selected.size > 0 && (
        <div
          className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border p-3 animate-fade-in"
          style={{ background: "var(--accent-light)", borderColor: "var(--accent)" }}
        >
          <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>
            {selected.size} selected
          </span>
          <div className="flex-1" />
          <button
            onClick={() => bulkExport("markdown")}
            disabled={exporting}
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:opacity-80 disabled:opacity-50"
            style={{ background: "var(--card)", color: "var(--foreground)" }}
          >
            Export .md
          </button>
          <button
            onClick={() => bulkExport("json")}
            disabled={exporting}
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:opacity-80 disabled:opacity-50"
            style={{ background: "var(--card)", color: "var(--foreground)" }}
          >
            Export .json
          </button>
          <button
            onClick={() => bulkExport("csv")}
            disabled={exporting}
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:opacity-80 disabled:opacity-50"
            style={{ background: "var(--card)", color: "var(--foreground)" }}
          >
            Export .csv
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs transition-colors hover:opacity-80"
            style={{ color: "var(--muted)" }}
          >
            Clear
          </button>
        </div>
      )}

      {interviews.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed p-8 text-center sm:p-12"
          style={{ borderColor: "var(--card-border)" }}
        >
          <p className="mb-2 text-5xl">🎙️</p>
          <p className="text-base font-medium" style={{ color: "var(--foreground)" }}>
            No interviews yet
          </p>
          <p className="mb-4 text-sm" style={{ color: "var(--muted)" }}>
            Go to Personas to start your first interview
          </p>
          <Link
            href="/personas"
            className="inline-flex rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            View Personas
          </Link>
        </div>
      ) : (
        <div>
          <div className="mb-2 flex items-center px-1">
            <button
              onClick={toggleAll}
              className="text-xs transition-colors hover:opacity-80"
              style={{ color: "var(--accent)" }}
            >
              {selected.size === interviews.length ? "Deselect all" : "Select all"}
            </button>
          </div>

          <div className="space-y-2">
            {interviews.map((interview, i) => (
              <div
                key={interview.id}
                className="flex items-center gap-3 rounded-2xl border p-4 transition-all hover:shadow-sm animate-fade-in"
                style={{
                  background: selected.has(interview.id) ? "var(--accent-light)" : "var(--card)",
                  borderColor: selected.has(interview.id) ? "var(--accent)" : "var(--card-border)",
                  animationDelay: `${i * 30}ms`,
                  animationFillMode: "both",
                }}
              >
                <button
                  onClick={() => toggleSelect(interview.id)}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all"
                  style={{
                    borderColor: selected.has(interview.id) ? "var(--accent)" : "var(--card-border)",
                    background: selected.has(interview.id) ? "var(--accent)" : "transparent",
                  }}
                >
                  {selected.has(interview.id) && (
                    <span className="text-xs text-white">✓</span>
                  )}
                </button>

                <span className="text-2xl">{interview.persona.avatarEmoji}</span>

                <Link
                  href={interview.status === "active" ? `/interviews/${interview.id}` : `/interviews/${interview.id}/review`}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {interview.title}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {interview.persona.role}
                    {interview.persona.company ? ` at ${interview.persona.company}` : ""} ·{" "}
                    {interview._count.messages} messages ·{" "}
                    {formatDistanceToNow(new Date(interview.updatedAt), { addSuffix: true })}
                  </p>
                </Link>

                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    background: interview.status === "active" ? "var(--accent-light)" : "#34c75920",
                    color: interview.status === "active" ? "var(--accent)" : "var(--success)",
                  }}
                >
                  {interview.status === "active" ? "Active" : "Completed"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
