'use client';

import { useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
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
  LayoutGrid,
  List,
  Lightbulb,
  Copy,
  Download,
  RefreshCw,
} from "lucide-react";
import { fetchSources, generateStudioDocument } from "@/lib/api";
import { useProject } from "@/contexts/ProjectContext";
import InsightsModal from "@/components/InsightsModal";
import { toast } from "sonner";

interface StudioItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const studioItems: StudioItem[] = [
  { id: "insights", label: "Analyze sources / Insights", icon: <Lightbulb className="w-4 h-4" />, color: "text-tofu-warm" },
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
  const { currentProjectId } = useProject();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [gridLayout, setGridLayout] = useState(true);
  const [sources, setSources] = useState<{ id: string; selected: boolean }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [insightsModalOpen, setInsightsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("");
  const [outputContent, setOutputContent] = useState("");
  const [outputLabel, setOutputLabel] = useState("");
  const [outputType, setOutputType] = useState<string | null>(null);

  const loadSources = useCallback(async () => {
    if (!currentProjectId) {
      setSources([]);
      return;
    }
    try {
      const list = await fetchSources(currentProjectId);
      setSources(list.map((s) => ({ id: s.id, selected: s.selected })));
    } catch {
      setSources([]);
    }
  }, [currentProjectId]);

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  const selectedSourceIds = sources.filter((s) => s.selected).map((s) => s.id);

  const runDocumentGeneration = useCallback(
    async (documentType: string) => {
      if (selectedSourceIds.length === 0) {
        setError("Select at least one source in the left panel. Documents are generated from your added sources.");
        return;
      }
      setError(null);
      setLoading(true);
      setLoadingLabel(studioItems.find((i) => i.id === documentType)?.label ?? documentType);
      setOutputType(documentType);
      try {
        const { content } = await generateStudioDocument(documentType, selectedSourceIds);
        setOutputContent(content);
        setOutputLabel(studioItems.find((i) => i.id === documentType)?.label ?? documentType);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Generation failed");
        setOutputContent("");
      } finally {
        setLoading(false);
      }
    },
    [selectedSourceIds]
  );

  const handleDocumentCardClick = (item: StudioItem) => {
    if (item.id === "insights") {
      setInsightsModalOpen(true);
      setActiveItem(null);
      return;
    }
    setActiveItem(activeItem === item.id ? null : item.id);
    runDocumentGeneration(item.id);
  };

  const handleRegenerateDocument = useCallback(() => {
    if (outputType) runDocumentGeneration(outputType);
  }, [outputType, runDocumentGeneration]);

  const handleCopyOutput = () => {
    if (outputContent) {
      navigator.clipboard.writeText(outputContent);
      toast.success("Copied to clipboard");
    }
  };

  const handleDownloadOutput = () => {
    if (!outputContent) return;
    const filename = `${outputLabel.replace(/\s+/g, "-")}.pdf`;
    const doc = new jsPDF({ format: "a4", unit: "mm" });
    const margin = 20;
    const pageWidth = doc.getPageWidth();
    const maxWidth = pageWidth - margin * 2;
    let y = margin;
    const lineHeight = 6;
    const fontSize = 10;
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(outputContent, maxWidth);
    for (const line of lines) {
      if (y > doc.getPageHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    }
    doc.save(filename);
    toast.success("Downloaded as PDF");
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

      <div className="flex-shrink-0 overflow-y-auto p-3">
        <div className={gridLayout ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2"}>
          {studioItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleDocumentCardClick(item)}
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

      {/* Output area below buttons: loader or document */}
      <div className="flex-1 min-h-0 flex flex-col border-t border-border bg-background overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-muted-foreground">
            <RefreshCw className="w-8 h-8 animate-spin mb-3" />
            <p className="text-sm">Generating {loadingLabel} document…</p>
          </div>
        ) : outputContent ? (
          <>
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border flex-shrink-0">
              <span className="text-xs font-medium text-foreground truncate">{outputLabel}</span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyOutput}
                  className="p-1.5 rounded hover:bg-muted transition-colors"
                  title="Copy"
                >
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button
                  type="button"
                  onClick={handleDownloadOutput}
                  className="p-1.5 rounded hover:bg-muted transition-colors flex items-center gap-1"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground hidden sm:inline">Download</span>
                </button>
                <button
                  type="button"
                  onClick={handleRegenerateDocument}
                  className="p-1.5 rounded hover:bg-muted transition-colors flex items-center gap-1"
                  title="Regenerate"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground hidden sm:inline">Regenerate</span>
                </button>
              </div>
            </div>
            <textarea
              value={outputContent}
              onChange={(e) => setOutputContent(e.target.value)}
              className="flex-1 min-h-[200px] w-full p-3 text-sm text-foreground font-mono whitespace-pre-wrap resize-none focus:outline-none focus:ring-0 border-0 bg-transparent"
              spellCheck={false}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-8 px-4 text-muted-foreground">
            <FileText className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs leading-relaxed">
              Select sources in the left panel, then click a document type above to generate. The document will appear here and you can edit, copy, or download it.
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive px-4 py-2 flex-shrink-0">{error}</p>}
      <InsightsModal
        open={insightsModalOpen}
        onOpenChange={setInsightsModalOpen}
        projectId={currentProjectId}
      />
    </aside>
  );
};

export default StudioPanel;
