"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Button, Badge, EmptyState, Skeleton } from "@/components/ui";
import { Users, Search, MessageCircle, Trash2 } from "lucide-react";

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
        setPersonas(Array.isArray(data) ? data : []);
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
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} padding="md">
              <Skeleton className="mb-3 h-12 w-12 rounded-[var(--radius-lg)]" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Personas"
        description={`${personas.length} persona${personas.length !== 1 ? "s" : ""} in your library. Create and interview personas.`}
        action={
          <Link href="/personas/new">
            <Button leftIcon={<Users className="h-4 w-4" />}>
              New persona
            </Button>
          </Link>
        }
      />

      {personas.length > 3 && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Filter by name, role, company, or industry..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-[var(--radius-xl)] border border-[var(--card-border)] bg-[var(--card)] py-2.5 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)]"
            />
          </div>
        </div>
      )}

      {personas.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No personas yet"
          description="Create a persona from a template, quick prompt, or build one from scratch. Then start interviewing."
          action={{ label: "Create your first persona", href: "/personas/new" }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((persona) => (
            <Card
              key={persona.id}
              padding="md"
              className="group transition-all hover:shadow-[var(--shadow-md)]"
            >
              <div className="mb-3 flex items-start justify-between">
                <span className="text-4xl">{persona.avatarEmoji}</span>
                <button
                  type="button"
                  onClick={() => deletePersona(persona.id, persona.name)}
                  className="rounded-[var(--radius-md)] p-1.5 text-[var(--muted)] opacity-0 transition-opacity hover:bg-[var(--danger-muted)] hover:text-[var(--danger)] group-hover:opacity-100"
                  title="Delete persona"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="font-semibold text-[var(--foreground)]">
                {persona.name}
              </p>
              <p className="text-sm text-[var(--muted)]">{persona.role}</p>
              {persona.company && (
                <p className="text-sm text-[var(--muted)]">{persona.company}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {persona.industry && (
                  <Badge variant="muted">{persona.industry}</Badge>
                )}
                {persona.experienceYears != null && (
                  <span className="text-xs text-[var(--muted)]">
                    {persona.experienceYears}y exp
                  </span>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  leftIcon={<MessageCircle className="h-4 w-4" />}
                  onClick={() => startInterview(persona.id)}
                >
                  Interview
                </Button>
                <Link href={`/personas/${persona.id}`}>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </Link>
              </div>
              <p className="mt-2 text-center text-xs text-[var(--muted)]">
                {persona._count.interviews} interview
                {persona._count.interviews !== 1 ? "s" : ""}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
