'use client';

import { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  ExternalLink,
  MoreVertical,
  Trash2,
  Info,
  Copy,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchSources,
  analyzeSources,
  getProjectInsights,
  saveProjectInsights,
  getJiraConfig,
} from "@/lib/api";
import type { InsightItem, InsightStatus } from "@/lib/api";
import JiraConfigModal from "@/components/JiraConfigModal";
import CreateJiraModal from "@/components/CreateJiraModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const insightStatusColors: Record<InsightStatus, { border: string; badge: string; label: string }> = {
  not_started: {
    border: "border-l-slate-400 dark:border-l-slate-500",
    badge: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-400/30",
    label: "Not started",
  },
  in_progress: {
    border: "border-l-amber-500 dark:border-l-amber-400",
    badge: "bg-amber-500/15 text-amber-800 dark:text-amber-200 border-amber-500/30",
    label: "In progress",
  },
  done: {
    border: "border-l-emerald-500 dark:border-l-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border-emerald-500/30",
    label: "Done",
  },
};

interface InsightsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string | null;
}

export default function InsightsModal({ open, onOpenChange, projectId }: InsightsModalProps) {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [insightStatusFilter, setInsightStatusFilter] = useState<InsightStatus | "all">("all");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [jiraConfigured, setJiraConfigured] = useState(false);
  const [jiraConfigModalOpen, setJiraConfigModalOpen] = useState(false);
  const [createJiraModalOpen, setCreateJiraModalOpen] = useState(false);
  const [createJiraInsight, setCreateJiraInsight] = useState<{ summary: string; description: string } | null>(null);
  const [lastProjectKey, setLastProjectKey] = useState("");
  const [insightDetail, setInsightDetail] = useState<InsightItem | null>(null);

  const loadInsights = useCallback(async () => {
    if (!projectId || !open) return;
    try {
      const list = await getProjectInsights(projectId);
      setInsights(list);
    } catch {
      setInsights([]);
    }
  }, [projectId, open]);

  useEffect(() => {
    if (open && projectId) {
      loadInsights();
      getJiraConfig().then((c) => {
        setJiraConfigured(!!c?.configured);
        if (c?.lastProjectKey) setLastProjectKey(c.lastProjectKey);
      });
    }
  }, [open, projectId, loadInsights]);

  const handleAnalyze = async () => {
    if (!projectId) return;
    setAnalyzeError(null);
    setAnalyzing(true);
    try {
      const sources = await fetchSources(projectId);
      const selectedIds = sources.filter((s) => s.selected).map((s) => s.id);
      if (selectedIds.length === 0) {
        setAnalyzeError("Select at least one source in the left panel first.");
        return;
      }
      const { insights: list } = await analyzeSources(selectedIds);
      const withStatus = (list || []).map((i) => ({ ...i, status: (i.status ?? "not_started") as InsightStatus }));
      setInsights(withStatus);
      await saveProjectInsights(projectId, withStatus);
      toast.success("Analysis complete.");
    } catch (e) {
      setAnalyzeError(e instanceof Error ? e.message : "Analysis failed");
      setInsights([]);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCreateJiraClick = (insight: InsightItem) => {
    const payload = { summary: insight.summary, description: insight.description };
    if (!jiraConfigured) {
      setJiraConfigModalOpen(true);
      setCreateJiraInsight(payload);
    } else {
      setCreateJiraInsight(payload);
      setCreateJiraModalOpen(true);
    }
  };

  const handleJiraConfigSaved = () => {
    getJiraConfig().then((c) => {
      setJiraConfigured(!!c?.configured);
      if (c?.lastProjectKey) setLastProjectKey(c.lastProjectKey);
    });
    if (createJiraInsight) setCreateJiraModalOpen(true);
  };

  const handleDeleteInsight = async (index: number) => {
    if (!projectId) return;
    const next = insights.filter((_, i) => i !== index);
    setInsights(next);
    try {
      await saveProjectInsights(projectId, next);
      toast.success("Insight removed");
    } catch {
      toast.error("Failed to remove insight");
      setInsights(insights);
    }
  };

  const handleCopyFullInsight = (insight: InsightItem) => {
    const text = `${insight.summary}\n\n${insight.description}${insight.action ? `\n\nAction: ${insight.action}` : ""}`;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const setInsightStatus = async (index: number, status: InsightStatus) => {
    if (!projectId) return;
    const next = insights.map((insight, i) => (i === index ? { ...insight, status } : insight));
    setInsights(next);
    try {
      await saveProjectInsights(projectId, next);
    } catch {
      setInsights(insights);
    }
  };

  const moveInsight = async (index: number, delta: number) => {
    if (!projectId) return;
    const next = [...insights];
    const j = index + delta;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setInsights(next);
    try {
      await saveProjectInsights(projectId, next);
    } catch {
      setInsights(insights);
    }
  };

  const filteredInsights =
    insightStatusFilter === "all"
      ? insights
      : insights.filter((i) => (i.status ?? "not_started") === insightStatusFilter);

  if (!open) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <DialogHeader>
              <DialogTitle className="text-base">Insights from sources</DialogTitle>
            </DialogHeader>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="p-1.5 rounded hover:bg-muted"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden px-4 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 py-3">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing || !projectId}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium tofu-gradient text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                <Sparkles className="w-4 h-4" />
                {analyzing ? "Analyzing…" : "Analyze sources"}
              </button>
              <select
                value={insightStatusFilter}
                onChange={(e) => setInsightStatusFilter(e.target.value as InsightStatus | "all")}
                className="text-xs rounded-md border border-border bg-background px-2 py-1.5 text-foreground"
                aria-label="Filter by status"
              >
                <option value="all">All</option>
                <option value="not_started">{insightStatusColors.not_started.label}</option>
                <option value="in_progress">{insightStatusColors.in_progress.label}</option>
                <option value="done">{insightStatusColors.done.label}</option>
              </select>
            </div>
            {analyzeError && (
              <p className="text-sm text-destructive mb-2">{analyzeError}</p>
            )}
            <p className="text-xs text-muted-foreground mb-2">
              Select sources in the left panel, then run Analyze. Manage status, export to Jira, or view details below.
            </p>
            <ul className="space-y-2 overflow-y-auto flex-1 min-h-0 pr-1">
              {filteredInsights.length === 0 ? (
                <li className="text-sm text-muted-foreground py-4 text-center">
                  {insights.length === 0 ? "No insights yet. Run Analyze sources." : "No insights match the filter."}
                </li>
              ) : (
                filteredInsights.map((insight) => {
                  const globalIndex = insights.indexOf(insight);
                  const status = insight.status ?? "not_started";
                  return (
                    <li
                      key={globalIndex}
                      className={cn(
                        "flex flex-col sm:flex-row sm:items-start gap-2 text-sm text-foreground bg-background border border-border rounded-lg px-3 py-2 border-l-4",
                        insightStatusColors[status].border
                      )}
                    >
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <div className="flex flex-col gap-0 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveInsight(globalIndex, -1)}
                            disabled={globalIndex === 0}
                            className="p-0.5 rounded hover:bg-muted disabled:opacity-30"
                            aria-label="Move up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveInsight(globalIndex, 1)}
                            disabled={globalIndex === insights.length - 1}
                            className="p-0.5 rounded hover:bg-muted disabled:opacity-30"
                            aria-label="Move down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium shrink-0",
                            insightStatusColors[status].badge
                          )}
                        >
                          {insightStatusColors[status].label}
                        </span>
                        <select
                          value={status}
                          onChange={(e) => setInsightStatus(globalIndex, e.target.value as InsightStatus)}
                          className="text-xs rounded border border-border bg-muted/50 px-2 py-0.5 text-foreground"
                        >
                          {(["not_started", "in_progress", "done"] as const).map((s) => (
                            <option key={s} value={s}>{insightStatusColors[s].label}</option>
                          ))}
                        </select>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={() => setInsightDetail(insight)}
                          onKeyDown={(e) => e.key === "Enter" && setInsightDetail(insight)}
                          className="min-w-0 cursor-pointer hover:underline focus:outline-none focus:underline"
                        >
                          <span className="block truncate">{insight.summary}</span>
                          {insight.action && (
                            <span className="block truncate text-xs text-muted-foreground font-normal mt-0.5">
                              → {insight.action}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCreateJiraClick(insight)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Export to Jira
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className="p-1.5 rounded hover:bg-muted" aria-label="More">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setInsightDetail(insight)} className="flex items-center gap-2 cursor-pointer">
                              <Info className="w-4 h-4" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyFullInsight(insight)} className="flex items-center gap-2 cursor-pointer">
                              <Copy className="w-4 h-4" />
                              Copy full
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteInsight(globalIndex)}
                              className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail popup */}
      <Dialog open={!!insightDetail} onOpenChange={(open) => !open && setInsightDetail(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {insightDetail && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base pr-6">{insightDetail.summary}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Status</p>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                      insightStatusColors[insightDetail.status ?? "not_started"].badge
                    )}
                  >
                    {insightStatusColors[insightDetail.status ?? "not_started"].label}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Description</p>
                  <p className="text-foreground whitespace-pre-wrap">{insightDetail.description || "—"}</p>
                </div>
                {insightDetail.action && (
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Action to take</p>
                    <p className="text-foreground whitespace-pre-wrap rounded-md bg-primary/10 dark:bg-primary/20 border border-primary/20 px-3 py-2">
                      {insightDetail.action}
                    </p>
                  </div>
                )}
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Sources</p>
                  <p className="text-foreground">
                    {insightDetail.sourceNames?.length ? insightDetail.sourceNames.join(", ") : "—"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Evidence</p>
                  <p className="text-foreground whitespace-pre-wrap">{insightDetail.evidence || "—"}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <JiraConfigModal
        open={jiraConfigModalOpen}
        onOpenChange={setJiraConfigModalOpen}
        onSaved={handleJiraConfigSaved}
      />
      <CreateJiraModal
        key={createJiraModalOpen && createJiraInsight ? `jira-${createJiraInsight.summary}` : "jira-closed"}
        open={createJiraModalOpen}
        onOpenChange={setCreateJiraModalOpen}
        insight={createJiraInsight}
        initialProjectKey={lastProjectKey}
        projectId={projectId}
        onCreated={(url, issueKey) => {
          setLastProjectKey(issueKey.split("-")[0] || lastProjectKey);
          getJiraConfig().then((c) => {
            if (c?.lastProjectKey) setLastProjectKey(c.lastProjectKey);
          });
        }}
      />
    </>
  );
}
