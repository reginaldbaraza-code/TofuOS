"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface Persona {
  id: string;
  name: string;
  avatarEmoji: string;
  role: string;
  company: string | null;
  _count: { interviews: number };
}

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

export default function DashboardPage() {
  const router = useRouter();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/personas").then((r) => r.json()),
      fetch("/api/interviews").then((r) => r.json()),
    ]).then(([p, i]) => {
      setPersonas(p);
      setInterviews(i);
      setLoading(false);
    });
  }, []);

  const startInterview = async (personaId: string) => {
    const res = await fetch("/api/interviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personaId }),
    });
    const interview = await res.json();
    router.push(`/interviews/${interview.id}`);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm animate-pulse-slow" style={{ color: "var(--muted)" }}>Loading...</div>
      </div>
    );
  }

  const activeInterviews = interviews.filter((i) => i.status === "active");
  const recentCompleted = interviews.filter((i) => i.status === "completed").slice(0, 5);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
          Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Conduct synthetic interviews with PM personas
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--card-border)" }}>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Personas</p>
          <p className="mt-1 text-3xl font-semibold" style={{ color: "var(--foreground)" }}>{personas.length}</p>
        </div>
        <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--card-border)" }}>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Total Interviews</p>
          <p className="mt-1 text-3xl font-semibold" style={{ color: "var(--foreground)" }}>{interviews.length}</p>
        </div>
        <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--card-border)" }}>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Active</p>
          <p className="mt-1 text-3xl font-semibold" style={{ color: "var(--foreground)" }}>{activeInterviews.length}</p>
        </div>
      </div>

      {activeInterviews.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Active Interviews
          </h2>
          <div className="space-y-2">
            {activeInterviews.map((interview) => (
              <Link
                key={interview.id}
                href={`/interviews/${interview.id}`}
                className="flex items-center gap-4 rounded-2xl border p-4 transition-all hover:shadow-sm"
                style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
              >
                <span className="text-2xl">{interview.persona.avatarEmoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {interview.title}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {interview.persona.role}{interview.persona.company ? ` at ${interview.persona.company}` : ""} · {interview._count.messages} messages
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                >
                  Continue →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Your Personas
          </h2>
          <Link
            href="/personas"
            className="text-xs font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--accent)" }}
          >
            View All →
          </Link>
        </div>

        {personas.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed p-8 text-center"
            style={{ borderColor: "var(--card-border)" }}
          >
            <p className="mb-1 text-4xl">👥</p>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>No personas yet</p>
            <p className="mb-4 text-xs" style={{ color: "var(--muted)" }}>
              Create your first PM persona to start interviewing
            </p>
            <Link
              href="/personas/new"
              className="inline-flex rounded-xl px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: "var(--accent)" }}
            >
              Create Persona
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {personas.slice(0, 6).map((persona) => (
              <div
                key={persona.id}
                className="group rounded-2xl border p-4 transition-all hover:shadow-sm"
                style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="text-3xl">{persona.avatarEmoji}</span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {persona._count.interviews} interview{persona._count.interviews !== 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{persona.name}</p>
                <p className="mb-3 text-xs" style={{ color: "var(--muted)" }}>
                  {persona.role}{persona.company ? ` · ${persona.company}` : ""}
                </p>
                <button
                  onClick={() => startInterview(persona.id)}
                  className="w-full rounded-xl py-2 text-xs font-medium transition-all hover:opacity-90"
                  style={{ background: "var(--muted-bg)", color: "var(--foreground)" }}
                >
                  Start Interview
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {recentCompleted.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Recent Completed
          </h2>
          <div className="space-y-2">
            {recentCompleted.map((interview) => (
              <Link
                key={interview.id}
                href={`/interviews/${interview.id}/review`}
                className="flex items-center gap-4 rounded-2xl border p-4 transition-all hover:shadow-sm"
                style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
              >
                <span className="text-2xl">{interview.persona.avatarEmoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {interview.title}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {interview._count.messages} messages · {formatDistanceToNow(new Date(interview.updatedAt), { addSuffix: true })}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ background: "#34c75920", color: "var(--success)" }}
                >
                  Review
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
