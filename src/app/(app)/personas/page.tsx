"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Persona {
  id: string;
  name: string;
  avatarEmoji: string;
  role: string;
  company: string | null;
  industry: string | null;
  experienceYears: number | null;
  _count: { interviews: number };
}

export default function PersonasPage() {
  const router = useRouter();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/personas")
      .then((r) => r.json())
      .then((data) => {
        setPersonas(data);
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

  const deletePersona = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will also delete all their interviews.`)) return;
    await fetch(`/api/personas/${id}`, { method: "DELETE" });
    setPersonas((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = personas.filter(
    (p) =>
      !filter ||
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.role.toLowerCase().includes(filter.toLowerCase()) ||
      p.company?.toLowerCase().includes(filter.toLowerCase()) ||
      p.industry?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm animate-pulse-slow" style={{ color: "var(--muted)" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
            Personas
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {personas.length} persona{personas.length !== 1 ? "s" : ""} in your library
          </p>
        </div>
        <Link
          href="/personas/new"
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: "var(--accent)" }}
        >
          + New Persona
        </Link>
      </div>

      {personas.length > 3 && (
        <div className="mb-5">
          <input
            type="text"
            placeholder="Filter by name, role, company, or industry..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full rounded-xl border px-4 py-2.5 text-sm transition-all"
            style={{
              background: "var(--card)",
              borderColor: "var(--card-border)",
              color: "var(--foreground)",
            }}
          />
        </div>
      )}

      {personas.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed p-8 text-center sm:p-12"
          style={{ borderColor: "var(--card-border)" }}
        >
          <p className="mb-2 text-5xl">👥</p>
          <p className="text-base font-medium" style={{ color: "var(--foreground)" }}>
            No personas yet
          </p>
          <p className="mb-6 text-sm" style={{ color: "var(--muted)" }}>
            Create a persona from scratch, use a template, or let AI generate one for you
          </p>
          <Link
            href="/personas/new"
            className="inline-flex rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            Create Your First Persona
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((persona, i) => (
            <div
              key={persona.id}
              className="group animate-fade-in rounded-2xl border p-5 transition-all hover:shadow-md"
              style={{
                background: "var(--card)",
                borderColor: "var(--card-border)",
                animationDelay: `${i * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="mb-3 flex items-start justify-between">
                <span className="text-4xl">{persona.avatarEmoji}</span>
                <button
                  onClick={() => deletePersona(persona.id, persona.name)}
                  className="rounded-lg p-1 text-xs opacity-0 transition-all group-hover:opacity-100 hover:opacity-70"
                  style={{ color: "var(--danger)" }}
                  title="Delete persona"
                >
                  ×
                </button>
              </div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {persona.name}
              </h3>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {persona.role}
              </p>
              {persona.company && (
                <p className="text-xs" style={{ color: "var(--muted)" }}>{persona.company}</p>
              )}
              <div className="mt-1 flex items-center gap-2">
                {persona.industry && (
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{persona.industry}</span>
                )}
                {persona.experienceYears && (
                  <span className="text-xs" style={{ color: "var(--muted)" }}>· {persona.experienceYears}y exp</span>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => startInterview(persona.id)}
                  className="flex-1 rounded-xl py-2 text-xs font-medium text-white transition-all hover:opacity-90"
                  style={{ background: "var(--accent)" }}
                >
                  Interview
                </button>
                <Link
                  href={`/personas/${persona.id}`}
                  className="rounded-xl px-3 py-2 text-xs font-medium transition-all hover:opacity-80"
                  style={{ background: "var(--muted-bg)", color: "var(--foreground)" }}
                >
                  View
                </Link>
              </div>

              <p className="mt-2 text-center text-xs" style={{ color: "var(--muted)" }}>
                {persona._count.interviews} {persona._count.interviews === 1 ? "interview" : "interviews"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
