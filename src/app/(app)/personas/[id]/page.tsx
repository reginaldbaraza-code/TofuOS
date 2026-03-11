"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface PersonaDetail {
  id: string;
  name: string;
  avatarEmoji: string;
  age: number | null;
  role: string;
  company: string | null;
  companySize: string | null;
  industry: string | null;
  experienceYears: number | null;
  background: string | null;
  toolsUsed: string | null;
  painPoints: string | null;
  communicationStyle: string | null;
  personality: string | null;
  interviews: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }[];
  _count: { interviews: number };
}

export default function PersonaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [persona, setPersona] = useState<PersonaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/personas/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setPersona(data);
        setLoading(false);
      });
  }, [params.id]);

  const startInterview = async () => {
    if (!persona) return;
    const res = await fetch("/api/interviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personaId: persona.id }),
    });
    const interview = await res.json();
    router.push(`/interviews/${interview.id}`);
  };

  if (loading || !persona) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm animate-pulse-slow" style={{ color: "var(--muted)" }}>Loading...</div>
      </div>
    );
  }

  const infoItems = [
    { label: "Role", value: persona.role },
    { label: "Company", value: persona.company },
    { label: "Company Size", value: persona.companySize },
    { label: "Industry", value: persona.industry },
    { label: "Experience", value: persona.experienceYears ? `${persona.experienceYears} years` : null },
    { label: "Age", value: persona.age },
  ].filter((item) => item.value);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm transition-colors hover:opacity-80"
        style={{ color: "var(--accent)" }}
      >
        ← Back
      </button>

      <div className="animate-fade-in">
        <div className="mb-6 flex flex-wrap items-start gap-4">
          <span className="text-5xl">{persona.avatarEmoji}</span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
              {persona.name}
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {persona.role}{persona.company ? ` at ${persona.company}` : ""}
            </p>
          </div>
          <button
            onClick={startInterview}
            className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            Start Interview
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border p-3"
              style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
            >
              <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>{item.label}</p>
              <p className="mt-0.5 text-sm font-medium" style={{ color: "var(--foreground)" }}>
                {String(item.value)}
              </p>
            </div>
          ))}
        </div>

        {persona.background && (
          <Section title="Background">
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              {persona.background}
            </p>
          </Section>
        )}

        {persona.toolsUsed && (
          <Section title="Tools Used">
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              {persona.toolsUsed}
            </p>
          </Section>
        )}

        {persona.communicationStyle && (
          <Section title="Communication Style">
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              {persona.communicationStyle}
            </p>
          </Section>
        )}

        {persona.personality && (
          <Section title="Personality">
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              {persona.personality}
            </p>
          </Section>
        )}

        {persona.interviews.length > 0 && (
          <Section title={`Interviews (${persona._count.interviews})`}>
            <div className="space-y-2">
              {persona.interviews.map((interview) => (
                <Link
                  key={interview.id}
                  href={interview.status === "active" ? `/interviews/${interview.id}` : `/interviews/${interview.id}/review`}
                  className="flex items-center justify-between rounded-xl border p-3 transition-all hover:shadow-sm"
                  style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
                >
                  <span className="text-sm" style={{ color: "var(--foreground)" }}>{interview.title}</span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {formatDistanceToNow(new Date(interview.createdAt), { addSuffix: true })}
                  </span>
                </Link>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        {title}
      </h2>
      <div
        className="rounded-xl border p-4"
        style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
      >
        {children}
      </div>
    </div>
  );
}
