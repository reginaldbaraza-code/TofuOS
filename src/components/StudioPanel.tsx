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
  MoreVertical,
  Trash2,
} from "lucide-react";
import { fetchSources, generateStudioDocument, getStudioDocuments, saveStudioDocument, updateStudioDocument, deleteStudioDocument } from "@/lib/api";
import type { StudioDocumentItem } from "@/lib/api";
import { useProject } from "@/contexts/ProjectContext";
import InsightsModal from "@/components/InsightsModal";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [documents, setDocuments] = useState<StudioDocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    if (!currentProjectId) {
      setDocuments([]);
      return;
    }
    try {
      const list = await getStudioDocuments(currentProjectId);
      setDocuments(list);
    } catch {
      setDocuments([]);
    }
  }, [currentProjectId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

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
        const label = studioItems.find((i) => i.id === documentType)?.label ?? documentType;
        if (currentProjectId) {
          const saved = await saveStudioDocument(currentProjectId, {
            document_type: documentType,
            label,
            content,
            source_count: selectedSourceIds.length,
          });
          setOutputContent(content);
          setOutputLabel(label);
          setDocuments((prev) => [saved, ...prev]);
          setSelectedDocId(saved.id);
        } else {
          setOutputContent(content);
          setOutputLabel(label);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Generation failed");
        setOutputContent("");
      } finally {
        setLoading(false);
      }
    },
    [selectedSourceIds, currentProjectId]
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

  const handleOpenDocument = (doc: StudioDocumentItem) => {
    setSelectedDocId(doc.id);
    setOutputContent(doc.content);
    setOutputLabel(doc.label);
    setOutputType(doc.document_type);
  };

  const handleSaveCurrentDocument = useCallback(async () => {
    if (!selectedDocId || outputContent === undefined) return;
    try {
      await updateStudioDocument(selectedDocId, outputContent);
      setDocuments((prev) =>
        prev.map((d) => (d.id === selectedDocId ? { ...d, content: outputContent } : d))
      );
    } catch {
      toast.error("Failed to save");
    }
  }, [selectedDocId, outputContent]);

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteStudioDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (selectedDocId === id) {
        setSelectedDocId(null);
        setOutputContent("");
        setOutputLabel("");
        setOutputType(null);
      }
      toast.success("Document deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const downloadAsPdf = (content: string, label: string) => {
    if (!content) return;
    const filename = `${label.replace(/\s+/g, "-")}.pdf`;
    const doc = new jsPDF({ format: "a4", unit: "mm" });
    const margin = 20;
    const pageWidth = doc.getPageWidth();
    const maxWidth = pageWidth - margin * 2;
    let y = margin;
    const lineHeight = 6;
    const fontSize = 10;
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(content, maxWidth);
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

  function formatTimeAgo(createdAt: string | undefined): string {
    if (!createdAt) return "";
    const d = new Date(createdAt);
    const now = new Date();
    const mins = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  const handleCopyOutput = () => {
    if (outputContent) {
      navigator.clipboard.writeText(outputContent);
      toast.success("Copied to clipboard");
    }
  };

  const handleDownloadOutput = () => {
    downloadAsPdf(outputContent, outputLabel);
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

      {/* Loader card (only for the document being generated) + document list below */}
      <div className="flex-1 min-h-0 flex flex-col border-t border-border bg-background overflow-hidden">
        {loading ? (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Generating {loadingLabel}…</p>
              <p className="text-xs text-muted-foreground">based on {selectedSourceIds.length} source{selectedSourceIds.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        ) : null}

        {!loading && (outputContent || selectedDocId) ? (
          <>
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border flex-shrink-0">
              <span className="text-xs font-medium text-foreground truncate">{outputLabel}</span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleSaveCurrentDocument}
                  className="text-xs text-muted-foreground hover:text-foreground px-1.5"
                >
                  Save
                </button>
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
              onBlur={handleSaveCurrentDocument}
              className="flex-1 min-h-[160px] w-full p-3 text-sm text-foreground font-mono whitespace-pre-wrap resize-none focus:outline-none focus:ring-0 border-0 bg-transparent"
              spellCheck={false}
            />
          </>
        ) : !loading ? (
          <div className="flex flex-col items-center justify-center text-center py-6 px-4 text-muted-foreground">
            <FileText className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs leading-relaxed">
              Select sources in the left panel, then click a document type above to generate. Documents appear in the list below.
            </p>
          </div>
        ) : null}

        {/* List of generated documents */}
        {documents.length > 0 ? (
          <div className="flex-shrink-0 border-t border-border overflow-y-auto max-h-[40%]">
            <p className="text-xs font-medium text-muted-foreground px-3 py-2">Generated documents</p>
            <ul className="space-y-0.5 pb-2">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className={`flex items-center gap-2 px-3 py-2 mx-2 rounded-lg group ${
                    selectedDocId === doc.id ? "bg-primary/10" : "hover:bg-muted/50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleOpenDocument(doc)}
                    className="flex-1 min-w-0 flex items-center gap-2 text-left"
                  >
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{doc.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.source_count} source{doc.source_count !== 1 ? "s" : ""} · {formatTimeAgo(doc.created_at)}
                      </p>
                    </div>
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-muted sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                        aria-label="Options"
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenDocument(doc)} className="cursor-pointer">
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => downloadAsPdf(doc.content, doc.label)}
                        className="cursor-pointer"
                      >
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
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
