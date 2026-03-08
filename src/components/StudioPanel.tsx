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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StudioItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const studioItems: StudioItem[] = [
  { id: "insights", label: "Analyze sources / Insights", icon: <Lightbulb className="w-4 h-4" />, color: "text-tofu-warm", bgColor: "bg-orange-500/10" },
  { id: "prd", label: "PRD", icon: <FileText className="w-4 h-4" />, color: "text-primary", bgColor: "bg-primary/10" },
  { id: "coding-rules", label: "AI Coding Rules & Standards", icon: <Code className="w-4 h-4" />, color: "text-tofu-warm", bgColor: "bg-orange-500/10" },
  { id: "api-docs", label: "API Documentation", icon: <BookOpen className="w-4 h-4" />, color: "text-primary", bgColor: "bg-primary/10" },
  { id: "accessibility", label: "Accessibility Compliance", icon: <CheckSquare className="w-4 h-4" />, color: "text-tofu-warm", bgColor: "bg-orange-500/10" },
  { id: "architecture", label: "App Architecture Plan", icon: <LayoutDashboard className="w-4 h-4" />, color: "text-primary", bgColor: "bg-primary/10" },
  { id: "bug-fix", label: "Bug Investigation & Fix Plan", icon: <Bug className="w-4 h-4" />, color: "text-destructive", bgColor: "bg-destructive/10" },
  { id: "competitive", label: "Competitive Analysis Report", icon: <BarChart3 className="w-4 h-4" />, color: "text-tofu-warm", bgColor: "bg-orange-500/10" },
  { id: "journey-map", label: "Customer Journey Map", icon: <Users className="w-4 h-4" />, color: "text-primary", bgColor: "bg-primary/10" },
  { id: "db-schema", label: "Database Schema Design", icon: <Database className="w-4 h-4" />, color: "text-tofu-warm", bgColor: "bg-orange-500/10" },
  { id: "feature-spec", label: "Feature Implementation Spec", icon: <Rocket className="w-4 h-4" />, color: "text-primary", bgColor: "bg-primary/10" },
  { id: "gtm", label: "Go-to-Market Plan", icon: <Map className="w-4 h-4" />, color: "text-tofu-warm", bgColor: "bg-orange-500/10" },
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
  const [documents, setDocuments] = useState<StudioDocumentItem[]>([]);
  const [documentModalDoc, setDocumentModalDoc] = useState<StudioDocumentItem | null>(null);
  const [modalContent, setModalContent] = useState("");

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
          setDocuments((prev) => [saved, ...prev]);
          setDocumentModalDoc(saved);
          setModalContent(saved.content);
        } else {
          setDocumentModalDoc(null);
          setModalContent("");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Generation failed");
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

  const handleOpenDocument = (doc: StudioDocumentItem) => {
    setDocumentModalDoc(doc);
    setModalContent(doc.content);
  };

  const handleCloseDocumentModal = () => {
    setDocumentModalDoc(null);
    setModalContent("");
  };

  const handleSaveModalDocument = useCallback(async () => {
    if (!documentModalDoc) return;
    try {
      await updateStudioDocument(documentModalDoc.id, modalContent);
      setDocuments((prev) =>
        prev.map((d) => (d.id === documentModalDoc.id ? { ...d, content: modalContent } : d))
      );
      setDocumentModalDoc((prev) => (prev ? { ...prev, content: modalContent } : null));
      toast.success("Saved");
    } catch {
      toast.error("Failed to save");
    }
  }, [documentModalDoc, modalContent]);

  const handleRegenerateModalDocument = useCallback(async () => {
    if (!documentModalDoc || !currentProjectId) return;
    setLoading(true);
    setLoadingLabel(documentModalDoc.label);
    try {
      const { content } = await generateStudioDocument(documentModalDoc.document_type, selectedSourceIds);
      await updateStudioDocument(documentModalDoc.id, content);
      setModalContent(content);
      setDocuments((prev) =>
        prev.map((d) => (d.id === documentModalDoc.id ? { ...d, content } : d))
      );
      setDocumentModalDoc((prev) => (prev ? { ...prev, content } : null));
      toast.success("Regenerated");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Regeneration failed");
    } finally {
      setLoading(false);
    }
  }, [documentModalDoc, currentProjectId, selectedSourceIds]);

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteStudioDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (documentModalDoc?.id === id) handleCloseDocumentModal();
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

  return (
    <aside className={`${mobile ? "w-full h-full" : "w-80 min-w-[300px] shrink-0 border-l"} border-border flex flex-col panel-bg`} aria-label="Studio">
      <div className="p-4 pb-3 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground tracking-tight">Studio</h2>
        <button
          type="button"
          onClick={() => setGridLayout(!gridLayout)}
          className="p-1.5 rounded-lg hover:bg-muted transition-smooth text-muted-foreground hover:text-foreground"
          title={gridLayout ? "List layout" : "Grid layout"}
        >
          {gridLayout ? (
            <List className="w-4 h-4" />
          ) : (
            <LayoutGrid className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex-shrink-0 overflow-y-auto p-3">
        <div className={gridLayout ? "grid grid-cols-2 gap-2" : "flex flex-col gap-1.5"}>
          {studioItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleDocumentCardClick(item)}
              className={`flex items-center gap-2.5 p-3 rounded-xl text-left transition-all group border studio-card-bg studio-card-hover focus-ring ${
                activeItem === item.id
                  ? "bg-primary/10 border-primary/30 shadow-sm"
                  : "border-transparent hover:border-border hover:shadow-sm"
              }`}
            >
              <div className={`w-7 h-7 rounded-lg ${item.bgColor} flex items-center justify-center shrink-0`}>
                <span className={item.color}>{item.icon}</span>
              </div>
              <span className="text-xs font-medium text-foreground leading-tight flex-1">
                {item.label}
              </span>
              <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Loader + document list */}
      <div className="flex-1 min-h-0 flex flex-col border-t border-border bg-background overflow-hidden">
        {loading && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/20 animate-fade-in">
            <div className="w-8 h-8 rounded-lg tofu-gradient-subtle flex items-center justify-center">
              <RefreshCw className="w-4 h-4 animate-spin text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Generating {loadingLabel}…</p>
              <p className="text-xs text-muted-foreground">based on {selectedSourceIds.length} source{selectedSourceIds.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        )}

        {!loading && documents.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-8 px-4 text-muted-foreground animate-fade-in">
            <div className="w-12 h-12 rounded-2xl tofu-gradient-subtle flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-primary/60" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">No documents yet</p>
            <p className="text-xs leading-relaxed max-w-[220px]">
              Select sources, then click a document type above to generate.
            </p>
          </div>
        )}

        {/* Documents list */}
        {documents.length > 0 && (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-between px-3 py-2 sticky top-0 bg-background border-b border-border z-10">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Documents</p>
              <span className="text-[10px] text-muted-foreground tabular-nums">{documents.length}</span>
            </div>
            <ul className="space-y-0.5 p-2 pb-4">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl group transition-smooth ${
                    documentModalDoc?.id === doc.id ? "bg-primary/10" : "hover:bg-muted/50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleOpenDocument(doc)}
                    className="flex-1 min-w-0 flex items-center gap-2.5 text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
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
                        className="p-1.5 rounded-lg hover:bg-muted sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
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
        )}
      </div>
      {error && <p className="text-xs text-destructive px-4 py-2 flex-shrink-0 border-t border-border">{error}</p>}

      {/* Document view/edit popup */}
      <Dialog open={!!documentModalDoc} onOpenChange={(open) => !open && handleCloseDocumentModal()}>
        <DialogContent className="z-[60] max-w-3xl h-[85vh] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden w-[95vw] sm:w-full">
          <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border flex-shrink-0 pr-12">
            <DialogHeader className="min-w-0 flex-1">
              <DialogTitle className="text-base truncate">{documentModalDoc?.label}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button
                type="button"
                onClick={handleSaveModalDocument}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-smooth"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(modalContent);
                  toast.success("Copied");
                }}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
                title="Copy"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                type="button"
                onClick={() => documentModalDoc && downloadAsPdf(modalContent, documentModalDoc.label)}
                className="p-2 rounded-lg hover:bg-muted transition-smooth flex items-center gap-1"
                title="Download PDF"
              >
                <Download className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs hidden sm:inline text-muted-foreground">Download</span>
              </button>
              <button
                type="button"
                onClick={handleRegenerateModalDocument}
                className="p-2 rounded-lg hover:bg-muted transition-smooth flex items-center gap-1"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs hidden sm:inline text-muted-foreground">Regenerate</span>
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col min-h-[200px]">
            <textarea
              value={modalContent}
              onChange={(e) => setModalContent(e.target.value)}
              className="flex-1 min-h-[200px] w-full p-5 text-sm font-mono whitespace-pre-wrap resize-none focus:outline-none focus:ring-0 border-0 bg-transparent overflow-auto leading-relaxed"
              spellCheck={false}
            />
          </div>
        </DialogContent>
      </Dialog>

      <InsightsModal
        open={insightsModalOpen}
        onOpenChange={setInsightsModalOpen}
        projectId={currentProjectId}
      />
    </aside>
  );
};

export default StudioPanel;
