"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Input, Textarea } from "@/components/ui";
import { PERSONA_TEMPLATES } from "@/lib/persona-templates";
import {
  Sparkles,
  FileText,
  User,
  Linkedin,
  Briefcase,
  Globe,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import type { PersonaSourceType } from "@/types/persona";

type Step = "sources" | "quick" | "templates" | "create" | "generate";

const QUICK_EXAMPLES = [
  "PM at Mercedes",
  "Series A startup PM in devtools",
  "Enterprise payments PM",
  "Growth PM at fintech startup",
];

export default function NewPersonaPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("sources");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [quickPrompt, setQuickPrompt] = useState("");
  const [form, setForm] = useState({
    name: "",
    avatarEmoji: "👤",
    age: "",
    role: "",
    company: "",
    companySize: "",
    industry: "",
    experienceYears: "",
    background: "",
    toolsUsed: "",
    painPoints: "",
    communicationStyle: "",
    personality: "",
  });
  const [genParams, setGenParams] = useState({
    role: "",
    company: "",
    companySize: "",
    industry: "",
    experienceYears: "",
    additionalContext: "",
  });

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const savePersona = async (data: Record<string, unknown>) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      router.push("/personas");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save persona");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = quickPrompt.trim();
    if (!prompt) {
      setError("Enter a short description");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quickPrompt: prompt }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const persona = await res.json();
      await savePersona(persona);
    } catch {
      setError(
        "Failed to generate. Check that GOOGLE_GENERATIVE_AI_API_KEY is set."
      );
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      setError("Name and role are required");
      return;
    }
    await savePersona(form);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...genParams,
          experienceYears: genParams.experienceYears
            ? parseInt(genParams.experienceYears, 10)
            : undefined,
        }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const persona = await res.json();
      await savePersona(persona);
    } catch {
      setError(
        "Failed to generate. Check that GOOGLE_GENERATIVE_AI_API_KEY is set."
      );
      setLoading(false);
    }
  };

  const handleTemplate = async (index: number) => {
    await savePersona({ ...PERSONA_TEMPLATES[index] });
  };

  const inputStyle = {
    background: "var(--card)",
    borderColor: "var(--card-border)",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Back */}
      <Link
        href="/personas"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] transition-colors hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Personas
      </Link>

      {step === "sources" && (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              New persona
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Create a PM persona to interview. Choose how you’d like to start.
            </p>
          </div>

          {/* Quick prompt hero */}
          <Card padding="lg" className="mb-6" variant="elevated">
            <div className="mb-4 flex items-center gap-2 text-[var(--accent)]">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold">Quick generate</span>
            </div>
            <p className="mb-4 text-sm text-[var(--muted)]">
              Describe the PM in one line. AI will generate a full persona.
            </p>
            <form onSubmit={handleQuickGenerate} className="flex gap-2">
              <input
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder='e.g. "PM at Mercedes" or "Growth PM at fintech startup"'
                className="flex-1 rounded-[var(--radius-lg)] border bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)]"
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Generate"
                )}
              </Button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => {
                    setQuickPrompt(ex);
                  }}
                  className="rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1 text-xs text-[var(--muted)] transition-colors hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                >
                  {ex}
                </button>
              ))}
            </div>
          </Card>

          {/* Source cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            <SourceCard
              icon={<FileText className="h-5 w-5" />}
              title="Templates"
              description="Pre-built PM personas. One click to add."
              onClick={() => setStep("templates")}
            />
            <SourceCard
              icon={<User className="h-5 w-5" />}
              title="Manual"
              description="Build from scratch with a form."
              onClick={() => setStep("create")}
            />
            <SourceCard
              icon={<Sparkles className="h-5 w-5" />}
              title="AI Generate"
              description="Fill role, company, industry — AI fills the rest."
              onClick={() => setStep("generate")}
            />
            <SourceCard
              icon={<Linkedin className="h-5 w-5" />}
              title="LinkedIn"
              description="Import from LinkedIn profile."
              comingSoon
            />
            <SourceCard
              icon={<Briefcase className="h-5 w-5" />}
              title="Resume"
              description="Upload a resume to create a persona."
              comingSoon
            />
            <SourceCard
              icon={<Globe className="h-5 w-5" />}
              title="Company URL"
              description="Scrape company context for the persona."
              comingSoon
            />
          </div>
        </>
      )}

      {step !== "sources" && (
        <>
          <button
            type="button"
            onClick={() => { setStep("sources"); setError(""); }}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          {error && (
            <div
              className="mb-4 rounded-[var(--radius-lg)] border border-[var(--danger)]/30 bg-[var(--danger-muted)] px-4 py-3 text-sm text-[var(--danger)]"
            >
              {error}
            </div>
          )}

          {step === "templates" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Choose a template
              </h2>
              <p className="text-sm text-[var(--muted)]">
                Pre-built realistic PM personas. Add to your library with one
                click.
              </p>
              <div className="space-y-3">
                {PERSONA_TEMPLATES.map((template, i) => (
                  <Card key={i} padding="md" className="flex gap-4">
                    <span className="text-4xl">{template.avatarEmoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[var(--foreground)]">
                        {template.name}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {template.role} · {template.company}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)] line-clamp-2">
                        {template.background}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleTemplate(i)}
                      disabled={loading}
                    >
                      {loading ? "..." : "Add"}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step === "create" && (
            <form onSubmit={handleCreate} className="space-y-5">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Manual persona
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Name *"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="e.g. Sarah Chen"
                  required
                />
                <Input
                  label="Emoji"
                  value={form.avatarEmoji}
                  onChange={(e) => updateForm("avatarEmoji", e.target.value)}
                  maxLength={4}
                />
              </div>
              <Input
                label="Role *"
                value={form.role}
                onChange={(e) => updateForm("role", e.target.value)}
                placeholder="e.g. Senior Product Manager"
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Company"
                  value={form.company}
                  onChange={(e) => updateForm("company", e.target.value)}
                  placeholder="e.g. Stripe"
                />
                <Input
                  label="Company size"
                  value={form.companySize}
                  onChange={(e) => updateForm("companySize", e.target.value)}
                  placeholder="e.g. Series B, ~200 people"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Industry"
                  value={form.industry}
                  onChange={(e) => updateForm("industry", e.target.value)}
                  placeholder="e.g. FinTech"
                />
                <Input
                  label="Years of experience"
                  type="number"
                  value={form.experienceYears}
                  onChange={(e) => updateForm("experienceYears", e.target.value)}
                  placeholder="5"
                />
              </div>
              <Textarea
                label="Background"
                value={form.background}
                onChange={(e) => updateForm("background", e.target.value)}
                placeholder="Career history, education..."
                rows={3}
              />
              <Textarea
                label="Tools used"
                value={form.toolsUsed}
                onChange={(e) => updateForm("toolsUsed", e.target.value)}
                placeholder="Jira, Figma, Amplitude..."
                rows={2}
              />
              <Textarea
                label="Pain points (revealed in conversation)"
                value={form.painPoints}
                onChange={(e) => updateForm("painPoints", e.target.value)}
                placeholder="Specific frustrations..."
                rows={4}
              />
              <Textarea
                label="Communication style"
                value={form.communicationStyle}
                onChange={(e) => updateForm("communicationStyle", e.target.value)}
                placeholder="Data-driven, storyteller..."
                rows={2}
              />
              <Textarea
                label="Personality"
                value={form.personality}
                onChange={(e) => updateForm("personality", e.target.value)}
                placeholder="Key traits..."
                rows={2}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create persona"}
              </Button>
            </form>
          )}

          {step === "generate" && (
            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="rounded-[var(--radius-lg)] bg-[var(--accent-muted)] p-4 text-sm text-[var(--accent)]">
                Describe the type of PM. AI will generate a complete persona with
                backstory, pain points, and personality.
              </div>
              <Input
                label="Role"
                value={genParams.role}
                onChange={(e) =>
                  setGenParams((p) => ({ ...p, role: e.target.value }))
                }
                placeholder="e.g. Senior PM, VP of Product"
              />
              <Input
                label="Company"
                value={genParams.company}
                onChange={(e) =>
                  setGenParams((p) => ({ ...p, company: e.target.value }))
                }
                placeholder="e.g. Mercedes, or leave blank"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Company size"
                  value={genParams.companySize}
                  onChange={(e) =>
                    setGenParams((p) => ({ ...p, companySize: e.target.value }))
                  }
                  placeholder="e.g. 50 people, Fortune 500"
                />
                <Input
                  label="Industry"
                  value={genParams.industry}
                  onChange={(e) =>
                    setGenParams((p) => ({ ...p, industry: e.target.value }))
                  }
                  placeholder="e.g. HealthTech, FinTech"
                />
              </div>
              <Input
                label="Years of experience"
                type="number"
                value={genParams.experienceYears}
                onChange={(e) =>
                  setGenParams((p) => ({ ...p, experienceYears: e.target.value }))
                }
                placeholder="e.g. 5"
              />
              <Textarea
                label="Additional context"
                value={genParams.additionalContext}
                onChange={(e) =>
                  setGenParams((p) => ({
                    ...p,
                    additionalContext: e.target.value,
                  }))
                }
                placeholder="Any extra details..."
                rows={3}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Generating..." : "Generate with AI"}
              </Button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

function SourceCard({
  icon,
  title,
  description,
  onClick,
  comingSoon,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  comingSoon?: boolean;
}) {
  return (
    <Card
      padding="md"
      className={`flex flex-col gap-2 transition-all ${
        comingSoon
          ? "opacity-75"
          : "cursor-pointer hover:shadow-[var(--shadow-md)]"
      }`}
      onClick={comingSoon ? undefined : onClick}
      role={comingSoon ? undefined : "button"}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] text-[var(--muted)]"
        style={{ background: "var(--muted-bg)" }}
      >
        {icon}
      </div>
      <p className="font-medium text-[var(--foreground)]">{title}</p>
      <p className="text-xs text-[var(--muted)]">{description}</p>
      {comingSoon && (
        <span className="mt-1 text-xs font-medium text-[var(--muted)]">
          Coming soon
        </span>
      )}
    </Card>
  );
}
