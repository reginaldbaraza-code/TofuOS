"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Input, Textarea } from "@/components/ui";
import { PERSONA_TEMPLATES } from "@/lib/persona-templates";
import { extractPdfText } from "@/lib/extract-pdf-text";
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

type Step = "sources" | "quick" | "templates" | "create" | "generate" | "companyUrl";

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
  const [isResumeUploading, setIsResumeUploading] = useState(false);
  const [resumePhase, setResumePhase] = useState<
    "idle" | "reading" | "llm" | "saving"
  >("idle");
  const [resumeStep, setResumeStep] = useState(0);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const [isDeepSearching, setIsDeepSearching] = useState(false);
  const [deepSearchStep, setDeepSearchStep] = useState(0);

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
  const [companyUrl, setCompanyUrl] = useState("");

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

  const handleDeepSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = genParams.additionalContext.trim();
    if (!query) {
      setError("Please provide some context for deep search.");
      return;
    }
    setIsDeepSearching(true);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/deep-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Deep research failed");
      }
      const persona = await res.json();
      await savePersona(persona);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Deep research failed. Please try again."
      );
      setLoading(false);
    }
    finally {
      setIsDeepSearching(false);
    }
  };

  const handleCompanyUrlDeepSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = companyUrl.trim();
    if (!url) {
      setError("Please enter a company URL.");
      return;
    }
    if (!/^https?:\/\//i.test(url) && !url.includes(".")) {
      setError("Please enter a valid company URL.");
      return;
    }
    const query = `Research this company website and its products, customers, and product management roles: ${url}`;
    setIsDeepSearching(true);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/deep-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Deep research failed");
      }
      const persona = await res.json();
      await savePersona(persona);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Deep research failed. Please try again."
      );
      setLoading(false);
    } finally {
      setIsDeepSearching(false);
    }
  };

  const handleTemplate = async (index: number) => {
    await savePersona({ ...PERSONA_TEMPLATES[index] });
  };

  const inputStyle = {
    background: "var(--card)",
    borderColor: "var(--card-border)",
  };

  useEffect(() => {
    if (!isResumeUploading || resumePhase === "idle") return;
    setResumeStep(0);
    const id = setInterval(() => {
      setResumeStep((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(id);
  }, [isResumeUploading, resumePhase]);

  const getResumeStatus = () => {
    if (!isResumeUploading || resumePhase === "idle") return "";
    const sequences: Record<string, string[]> = {
      reading: [
        "Reading PDF…",
        "Extracting text layers…",
        "Parsing sections & bullet points…",
      ],
      llm: [
        "Asking Gemini…",
        "Letting Gemini think…",
        "Aligning resume details with persona format…",
      ],
      saving: ["Saving persona…", "Finishing up persona details…"],
    };
    const messages = sequences[resumePhase] ?? [];
    if (!messages.length) return "";
    return messages[resumeStep % messages.length];
  };

  const resumeStatus = getResumeStatus();

  useEffect(() => {
    if (!isDeepSearching) return;
    setDeepSearchStep(0);
    const id = setInterval(() => {
      setDeepSearchStep((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(id);
  }, [isDeepSearching]);

  const getDeepSearchStatus = () => {
    if (!isDeepSearching) return "";

    const textSearchMessages = [
      "Scanning academic papers…",
      "Reading Reddit discussions…",
      "Analyzing job postings…",
      "Reviewing industry reports…",
      "Exploring startup databases…",
      "Checking GitHub repositories…",
      "Analyzing product reviews…",
      "Reading expert blog posts…",
      "Studying competitor websites…",
      "Reviewing conference talks…",
      "Analyzing LinkedIn discussions…",
      "Reading technical documentation…",
      "Scanning online communities…",
      "Checking hiring trends…",
      "Reviewing market research reports…",
      "Analyzing product launch announcements…",
      "Reading founder interviews…",
      "Exploring open-source projects…",
      "Reviewing academic citations…",
      "Identifying emerging trends…",
    ];

    const companyUrlMessages = [
      "Resolving company domain…",
      "Crawling homepage and key subpages…",
      "Analyzing product and solutions pages…",
      "Checking pricing and plans…",
      "Reviewing careers and jobs pages…",
      "Identifying product lines and segments…",
      "Scanning customer logos and case studies…",
      "Reviewing blog and news posts…",
      "Analyzing documentation and help center…",
      "Checking integrations and partner pages…",
      "Reviewing leadership and team pages…",
      "Analyzing investor and about pages…",
      "Summarizing company positioning…",
      "Deriving typical PM responsibilities…",
      "Identifying main user groups…",
      "Extracting key challenges from public info…",
      "Cross-checking findings across sources…",
      "Condensing insights into persona traits…",
      "Finalizing persona profile…",
      "Preparing persona for your library…",
    ];

    const messages =
      step === "companyUrl" ? companyUrlMessages : textSearchMessages;

    return messages[deepSearchStep % messages.length];
  };

  const deepSearchStatus = getDeepSearchStatus();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <input
        ref={resumeInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setError("");
          setIsResumeUploading(true);
          setResumePhase("reading");
          setLoading(true);
          try {
            const arrayBuffer = await file.arrayBuffer();
            const resumeText = await extractPdfText(arrayBuffer);
            if (!resumeText) {
              setError("Could not read text from PDF");
              setResumePhase("idle");
              setIsResumeUploading(false);
              setLoading(false);
              if (event.target) event.target.value = "";
              return;
            }
            setResumePhase("llm");
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 90_000);
            const res = await fetch("/api/personas/import-from-resume", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ resumeText }),
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!res.ok) {
              const err = await res.json().catch(() => null);
              throw new Error(err?.error || "Failed to import resume");
            }
            const persona = await res.json();
            setResumePhase("saving");
            await savePersona(persona);
          } catch (e) {
            const message =
              e instanceof Error && e.name === "AbortError"
                ? "Request took too long"
                : e instanceof Error
                  ? e.message
                  : "Failed to import resume. Check that GOOGLE_GENERATIVE_AI_API_KEY is set.";
            setError(message);
            setLoading(false);
          } finally {
            setIsResumeUploading(false);
            setResumePhase("idle");
            if (event.target) {
              event.target.value = "";
            }
          }
        }}
      />
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

            {isResumeUploading && (
              <div className="mt-4 space-y-2">
                <div className="text-xs font-medium text-[var(--muted)]">
                  {resumeStatus || "Processing resume…"}
                </div>
                <div className="relative h-1 w-full overflow-hidden rounded-full bg-[var(--muted-bg)]">
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)]/70 to-[var(--accent)]/0" />
                </div>
              </div>
            )}
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
              onClick={() => {
                resumeInputRef.current?.click();
              }}
            />
            <SourceCard
              icon={<Globe className="h-5 w-5" />}
              title="Company URL"
              description="Scrape company context for the persona."
              onClick={() => setStep("companyUrl")}
            />
            <SourceCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Deep search"
              description="Run a deeper search on the resume."
              onClick={() => setStep("generate")}
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
            <form onSubmit={handleDeepSearch} className="space-y-5">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Run deep search
              </h2>
              <div className="rounded-[var(--radius-lg)] bg-[var(--accent-muted)] p-4 text-sm text-[var(--accent)]">
                Paste or describe everything that matters about this PM: role,
                company, product, seniority, industry, challenges, and any other
                context. Deep search will turn this into a full persona.
              </div>
              <Textarea
                label="Deep search context"
                value={genParams.additionalContext}
                onChange={(e) =>
                  setGenParams((p) => ({
                    ...p,
                    additionalContext: e.target.value,
                  }))
                }
                placeholder="Example: Senior PM at a German automotive OEM working on in-car software platforms, 8 years experience, leads a cross‑functional team, struggles with aligning hardware and software roadmaps..."
                rows={6}
              />
              {isDeepSearching && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-[var(--muted)]">
                    {deepSearchStatus}
                  </div>
                  <div className="relative h-1 w-full overflow-hidden rounded-full bg-[var(--muted-bg)]">
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)]/70 to-[var(--accent)]/0" />
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading || isDeepSearching}>
                {loading || isDeepSearching ? "Running…" : "Run deep search"}
              </Button>
            </form>
          )}

          {step === "companyUrl" && (
            <form onSubmit={handleCompanyUrlDeepSearch} className="space-y-5">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Company URL deep search
              </h2>
              <div className="rounded-[var(--radius-lg)] bg-[var(--accent-muted)] p-4 text-sm text-[var(--accent)]">
                Paste a company website URL. We’ll research the company and
                generate a persona representing a typical Product Manager there.
              </div>
              <Input
                label="Company URL"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                placeholder="https://example.com"
              />
              {isDeepSearching && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-[var(--muted)]">
                    {deepSearchStatus}
                  </div>
                  <div className="relative h-1 w-full overflow-hidden rounded-full bg-[var(--muted-bg)]">
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)]/70 to-[var(--accent)]/0" />
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading || isDeepSearching}>
                {loading || isDeepSearching ? "Running…" : "Run search"}
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
