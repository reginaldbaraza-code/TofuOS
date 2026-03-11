"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, Button, Skeleton } from "@/components/ui";
import { ChevronLeft, MessageCircle } from "lucide-react";

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
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-6 h-6 w-24" />
        <Skeleton className="mb-8 h-32 w-full" />
      </div>
    );
  }

  const infoItems = [
    { label: "Role", value: persona.role },
    { label: "Company", value: persona.company },
    { label: "Company size", value: persona.companySize },
    { label: "Industry", value: persona.industry },
    {
      label: "Experience",
      value: persona.experienceYears ? `${persona.experienceYears} years` : null,
    },
    { label: "Age", value: persona.age != null ? String(persona.age) : null },
  ].filter((item) => item.value);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/personas"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] transition-colors hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Personas
      </Link>

      <div className="animate-fade-in">
        <div className="mb-8 flex flex-wrap items-start gap-4">
          <span className="text-5xl">{persona.avatarEmoji}</span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              {persona.name}
            </h1>
            <p className="text-sm text-[var(--muted)]">
              {persona.role}
              {persona.company ? ` at ${persona.company}` : ""}
            </p>
          </div>
          <Button
            leftIcon={<MessageCircle className="h-4 w-4" />}
            onClick={startInterview}
          >
            Start interview
          </Button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {infoItems.map((item) => (
            <Card key={item.label} padding="md">
              <p className="text-xs font-medium text-[var(--muted)]">
                {item.label}
              </p>
              <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]">
                {String(item.value)}
              </p>
            </Card>
          ))}
        </div>

        {persona.background && (
          <Section title="Background">
            <p className="text-sm leading-relaxed text-[var(--foreground)]">
              {persona.background}
            </p>
          </Section>
        )}
        {persona.toolsUsed && (
          <Section title="Tools used">
            <p className="text-sm leading-relaxed text-[var(--foreground)]">
              {persona.toolsUsed}
            </p>
          </Section>
        )}
        {persona.communicationStyle && (
          <Section title="Communication style">
            <p className="text-sm leading-relaxed text-[var(--foreground)]">
              {persona.communicationStyle}
            </p>
          </Section>
        )}
        {persona.personality && (
          <Section title="Personality">
            <p className="text-sm leading-relaxed text-[var(--foreground)]">
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
                  href={
                    interview.status === "active"
                      ? `/interviews/${interview.id}`
                      : `/interviews/${interview.id}/review`
                  }
                  className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-3 transition-colors hover:bg-[var(--muted-bg)]"
                >
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {interview.title}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {formatDistanceToNow(new Date(interview.createdAt), {
                      addSuffix: true,
                    })}
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        {title}
      </h2>
      <Card padding="md">{children}</Card>
    </div>
  );
}
