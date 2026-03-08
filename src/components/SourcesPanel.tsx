'use client';

import { Plus, Search, FileText, Link, Star, FileSpreadsheet } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import AddSourcesModal from "@/components/AddSourcesModal";
import type { StoreType } from "@/components/AddSourcesModal";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";
import {
  fetchSources,
  updateSources,
  addReviewsSource,
  addDocumentSources,
  addAudioSources,
  type Source,
} from "@/lib/api";

const typeConfig: Record<Source["type"], { icon: React.ReactNode; color: string; label: string }> = {
  pdf: { icon: <FileText className="w-4 h-4" />, color: "text-red-500", label: "PDF" },
  link: { icon: <Link className="w-4 h-4" />, color: "text-primary", label: "Link" },
  transcript: { icon: <FileText className="w-4 h-4" />, color: "text-tofu-warm", label: "Transcript" },
  reviews: { icon: <Star className="w-4 h-4" />, color: "text-amber-500", label: "Reviews" },
  document: { icon: <FileSpreadsheet className="w-4 h-4" />, color: "text-emerald-600", label: "Document" },
};

const SourcesPanel = ({ mobile }: { mobile?: boolean }) => {
  const { isAuthenticated } = useAuth();
  const { currentProjectId } = useProject();
  const [sources, setSources] = useState<Source[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSources = useCallback(async () => {
    if (!isAuthenticated || !currentProjectId) return;
    setLoading(true);
    setError(null);
    try {
      const list = await fetchSources(currentProjectId);
      setSources(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load sources");
      setSources([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentProjectId]);

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  const toggleSource = async (id: string) => {
    const next = sources.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s));
    setSources(next);
    try {
      const saved = await updateSources(next);
      setSources(saved);
    } catch {
      setSources(sources);
    }
  };

  const allSelected = sources.length > 0 && sources.every((s) => s.selected);
  const selectedCount = sources.filter((s) => s.selected).length;

  const toggleAll = async () => {
    const next = sources.map((s) => ({ ...s, selected: !allSelected }));
    setSources(next);
    try {
      const saved = await updateSources(next);
      setSources(saved);
    } catch {
      setSources(sources);
    }
  };

  const handleAddReviews = async (store: StoreType, appPageUrl: string) => {
    if (!currentProjectId) return;
    try {
      await addReviewsSource(currentProjectId, store, appPageUrl);
      await loadSources();
    } catch (e) {
      throw e;
    }
  };

  const handleAddDocuments = async (files: File[]) => {
    if (!currentProjectId) return;
    try {
      await addDocumentSources(currentProjectId, files);
      await loadSources();
    } catch (e) {
      throw e;
    }
  };

  const handleAddAudio = async (files: File[]) => {
    if (!currentProjectId) return;
    try {
      await addAudioSources(currentProjectId, files);
      await loadSources();
    } catch (e) {
      throw e;
    }
  };

  const filteredSources = sources.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={`${mobile ? "w-full h-full" : "w-72 min-w-[280px] shrink-0 border-r"} border-border flex flex-col panel-bg pb-safe`}
      aria-label="Sources"
    >
      {/* Header with selected-count badge */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground tracking-tight">Sources</h2>
        {selectedCount > 0 && (
          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-medium tabular-nums">
            {selectedCount} selected
          </span>
        )}
      </div>

      {/* Add sources button */}
      <div className="p-3 pt-3">
        <button
          onClick={() => setAddModalOpen(true)}
          disabled={!currentProjectId}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-primary border-2 border-dashed border-primary/25 hover:border-primary/50 hover:bg-primary/5 transition-smooth focus-ring disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Add sources"
        >
          <Plus className="w-4 h-4" aria-hidden />
          Add Sources
        </button>
        <AddSourcesModal
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
          onAddReviews={handleAddReviews}
          onAddDocuments={handleAddDocuments}
          onAddAudio={handleAddAudio}
        />
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden />
          <input
            type="search"
            placeholder="Search sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-muted/60 rounded-xl border border-transparent focus:border-border focus:bg-background outline-none focus:ring-2 focus:ring-ring/20 text-foreground placeholder:text-muted-foreground transition-smooth"
            aria-label="Search sources"
          />
        </div>
      </div>

      {/* Select all */}
      {sources.length > 0 && (
        <div className="px-3 pb-2">
          <button
            onClick={toggleAll}
            className="flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground transition-smooth focus-ring rounded-lg py-1 pr-1"
            aria-pressed={allSelected}
          >
            <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${allSelected ? "bg-primary border-primary" : "border-border"}`}>
              {allSelected && <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            Select All
          </button>
        </div>
      )}

      {/* Source list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-4 space-y-0.5">
        {loading ? (
          <div className="space-y-2 py-4">
            {[1,2,3].map((i) => (
              <div key={i} className="h-14 rounded-xl animate-shimmer" />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-destructive py-6 text-center px-2">{error}</p>
        ) : filteredSources.length === 0 && sources.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center text-center py-10 px-4 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl tofu-gradient-subtle flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-primary/60" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">No sources yet</p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
              Add documents, app reviews, or audio to get started with analysis.
            </p>
          </div>
        ) : filteredSources.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No sources match "{searchQuery}"</p>
        ) : (
          filteredSources.map((source) => {
            const cfg = typeConfig[source.type];
            return (
              <button
                key={source.id}
                type="button"
                onClick={() => toggleSource(source.id)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-muted/80 transition-smooth group text-left focus-ring"
                aria-pressed={source.selected}
                aria-label={`${source.name}, ${source.selected ? "selected" : "not selected"}`}
              >
                <div className={`w-4 h-4 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${source.selected ? "bg-primary border-primary" : "border-border"}`}>
                  {source.selected && <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <span className={cfg.color}>{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium truncate text-foreground block">{source.name}</span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <span className={`inline-flex items-center rounded-md px-1.5 py-0 text-[10px] font-medium ${cfg.color} bg-muted/80`}>
                      {cfg.label}
                    </span>
                    {source.created_at && (
                      <span>· {formatDistanceToNow(new Date(source.created_at), { addSuffix: true })}</span>
                    )}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default SourcesPanel;
