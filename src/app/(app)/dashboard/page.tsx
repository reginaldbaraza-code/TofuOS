"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  PageHeader,
  Card,
  Badge,
  EmptyState,
  Button,
  Skeleton,
} from "@/components/ui";
import { Users, MessageCircle, Activity, ChevronRight } from "lucide-react";

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
      setPersonas(Array.isArray(p) ? p : []);
      setInterviews(Array.isArray(i) ? i : []);
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

  const activeInterviews = interviews.filter((i) => i.status === "active");
  const recentCompleted = interviews
    .filter((i) => i.status === "completed")
    .slice(0, 5);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-10">
          <Skeleton className="mb-2 h-9 w-72" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} padding="lg">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2 h-10 w-16" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Dashboard"
        description="Your command center. Start an interview, review insights, or add a new persona."
      />

      {/* Stats */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card padding="lg" variant="elevated">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)]"
              style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
            >
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                Personas
              </p>
              <p className="text-2xl font-semibold text-[var(--foreground)]">
                {personas.length}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="lg" variant="elevated">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)]"
              style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
            >
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                Total interviews
              </p>
              <p className="text-2xl font-semibold text-[var(--foreground)]">
                {interviews.length}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="lg" variant="elevated">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)]"
              style={{ background: "var(--success-muted)", color: "var(--success)" }}
            >
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                Active now
              </p>
              <p className="text-2xl font-semibold text-[var(--foreground)]">
                {activeInterviews.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active interviews */}
      {activeInterviews.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Continue interviewing
          </h2>
          <div className="space-y-3">
            {activeInterviews.map((interview) => (
              <Link
                key={interview.id}
                href={`/interviews/${interview.id}`}
                className="block"
              >
                <Card
                  padding="md"
                  className="flex items-center gap-4 transition-all hover:shadow-[var(--shadow-md)]"
                >
                  <span className="text-3xl">
                    {interview.persona.avatarEmoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--foreground)]">
                      {interview.title}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {interview.persona.role}
                      {interview.persona.company
                        ? ` at ${interview.persona.company}`
                        : ""}{" "}
                      · {interview._count.messages} messages
                    </p>
                  </div>
                  <Badge variant="accent">Continue</Badge>
                  <ChevronRight className="h-4 w-4 text-[var(--muted)]" />
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Personas */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Your personas
          </h2>
          <Link
            href="/personas"
            className="text-sm font-medium text-[var(--accent)] transition-colors hover:underline"
          >
            View all
          </Link>
        </div>

        {personas.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No personas yet"
            description="Create your first persona to start interviewing. Use a template, quick prompt, or build from scratch."
            action={{ label: "Create Persona", href: "/personas/new" }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {personas.slice(0, 6).map((persona) => (
              <Card
                key={persona.id}
                padding="md"
                className="group transition-all hover:shadow-[var(--shadow-md)]"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="text-4xl">{persona.avatarEmoji}</span>
                  <span className="text-xs text-[var(--muted)]">
                    {persona._count.interviews} interview
                    {persona._count.interviews !== 1 ? "s" : ""}
                  </span>
                </div>
                <p className="font-medium text-[var(--foreground)]">
                  {persona.name}
                </p>
                <p className="text-sm text-[var(--muted)]">
                  {persona.role}
                  {persona.company ? ` · ${persona.company}` : ""}
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-4 w-full"
                  onClick={() => startInterview(persona.id)}
                >
                  Start interview
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Recent completed */}
      {recentCompleted.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Recent completed
          </h2>
          <div className="space-y-3">
            {recentCompleted.map((interview) => (
              <Link
                key={interview.id}
                href={`/interviews/${interview.id}/review`}
                className="block"
              >
                <Card
                  padding="md"
                  className="flex items-center gap-4 transition-all hover:shadow-[var(--shadow-md)]"
                >
                  <span className="text-3xl">
                    {interview.persona.avatarEmoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--foreground)]">
                      {interview.title}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {interview._count.messages} messages ·{" "}
                      {formatDistanceToNow(new Date(interview.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <Badge variant="success">Review</Badge>
                  <ChevronRight className="h-4 w-4 text-[var(--muted)]" />
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
