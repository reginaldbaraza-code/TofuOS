'use client';

import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Code,
  BookOpen,
  CheckSquare,
  LayoutDashboard,
  Bug,
  BarChart3,
  Users,
  Database,
  Rocket,
  Map,
  Pencil,
  Sparkles,
  Copy,
  Download,
  LayoutGrid,
  List,
} from "lucide-react";
import { fetchSources, generateStudioDocument } from "@/lib/api";

interface StudioItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const studioItems: StudioItem[] = [
  { id: "prd", label: "PRD", icon: <FileText className="w-4 h-4" />, color: "text-primary" },
  { id: "coding-rules", label: "AI Coding Rules & Standards", icon: <Code className="w-4 h-4" />, color: "text-tofu-warm" },
  { id: "api-docs", label: "API Documentation", icon: <BookOpen className="w-4 h-4" />, color: "text-primary" },
  { id: "accessibility", label: "Accessibility Compliance", icon: <CheckSquare className="w-4 h-4" />, color: "text-tofu-warm" },
  { id: "architecture", label: "App Architecture Plan", icon: <LayoutDashboard className="w-4 h-4" />, color: "text-primary" },
  { id: "bug-fix", label: "Bug Investigation & Fix Plan", icon: <Bug className="w-4 h-4" />, color: "text-destructive" },
  { id: "competitive", label: "Competitive Analysis Report", icon: <BarChart3 className="w-4 h-4" />, color: "text-tofu-warm" },
  { id: "journey-map", label: "Customer Journey Map", icon: <Users className="w-4 h-4" />, color: "text-primary" },
  { id: "db-schema", label: "Database Schema Design", icon: <Database className="w-4 h-4" />, color: "text-tofu-warm" },
  { id: "feature-spec", label: "Feature Implementation Spec", icon: <Rocket className="w-4 h-4" />, color: "text-primary" },
  { id: "gtm", label: "Go-to-Market Plan", icon: <Map className="w-4 h-4" />, color: "text-tofu-warm" },
];

const StudioPanel = ({ mobile }: { mobile?: boolean }) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [gridLayout, setGridLayout] = useState(true);
  const [sources, setSources] = useState<{ id: string; selected: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSources = useCallback(async () => {
    try {
      const list = await fetchSources();
      setSources(list.map((s) => ({ id: s.id, selected: s.selected })));
    } catch {
      setSources([]);
    }
  }, []);

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  const selectedSourceIds = sources.filter((s) => s.selected).map((s) => s.id);

  const handleCreateDocument = async () => {
    if (!activeItem) {
      setError("Select a document type above first.");
      return;
    }
    setError(null);
    setOutput(null);
    setLoading(true);
    try {
      const { content } = await generateStudioDocument(activeItem, selectedSourceIds);
      setOutput(content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const label = studioItems.find((i) => i.id === activeItem)?.label ?? "document";
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${label.replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside className={`${mobile ? "w-full h-full" : "w-80 min-w-[300px] border-l"} border-border flex flex-col panel-bg`}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Studio</h2>
        <button
          type="button"
          onClick={() => setGridLayout(!gridLayout)}
          className="p-1 rounded hover:bg-muted transition-colors"
          title={gridLayout ? "List layout" : "Grid layout"}
        >
          {gridLayout ? (
            <List className="w-4 h-4 text-muted-foreground" />
          ) : (
            <LayoutGrid className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className={gridLayout ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2"}>
          {studioItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveItem(activeItem === item.id ? null : item.id)}
              className={`flex items-center gap-2.5 p-3 rounded-xl text-left transition-all group ${
                activeItem === item.id
                  ? "bg-primary/10 border border-primary/30"
                  : "studio-card-bg studio-card-hover border border-transparent"
              }`}
            >
              <span className={item.color}>{item.icon}</span>
              <span className="text-xs font-medium text-foreground leading-tight flex-1">
                {item.label}
              </span>
              <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Studio Output Area */}
      <div className="p-4 border-t border-border bg-background pb-safe flex flex-col min-h-0">
        {output ? (
          <>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-medium text-foreground">Output</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded hover:bg-muted transition-colors"
                  title="Copy"
                >
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-1.5 rounded hover:bg-muted transition-colors"
                  title="Download .md"
                >
                  <Download className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto rounded-lg border border-border bg-muted/30 p-3 text-sm text-foreground whitespace-pre-wrap font-mono max-h-64 min-h-[120px]">
              {output}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-6">
            <Sparkles className="w-6 h-6 text-primary mb-2" />
            <p className="text-sm font-medium text-primary">
              Studio output will be saved here.
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Select a document type above, ensure sources are selected in the left panel, then click Create Document.
            </p>
          </div>
        )}
        {error && <p className="text-xs text-destructive mt-2">{error}</p>}
        <button
          type="button"
          onClick={handleCreateDocument}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 tofu-gradient text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-70 mt-3"
        >
          <FileText className="w-4 h-4" />
          {loading ? "Generating…" : "Create Document"}
        </button>
      </div>
    </aside>
  );
};

export default StudioPanel;
