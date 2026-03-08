'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { Send, ThumbsUp, ThumbsDown, Copy, Pin, Search, X, MessageSquare, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  fetchSources,
  chatWithAI,
  getChatMessages,
  appendChatMessage,
  searchProject,
} from "@/lib/api";
import type { InsightItem, InsightStatus, Source, ChatMessage } from "@/lib/api";
import { useProject } from "@/contexts/ProjectContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "What should we build next based on customer feedback?",
  "Create a PRD for the most requested feature.",
  "Which pain points appear most frequently?",
];

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

const ChatPanel = () => {
  const { currentProjectId, currentProject } = useProject();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{ sources: Source[]; messages: ChatMessage[]; insights: InsightItem[] } | null>(null);
  const [selectedSourcesCount, setSelectedSourcesCount] = useState(0);
  const [selectedSourceNames, setSelectedSourceNames] = useState<string[]>([]);
  const [feedbackByIndex, setFeedbackByIndex] = useState<Record<number, "up" | "down">>({});
  const [insightDetail, setInsightDetail] = useState<InsightItem | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages and source count when project changes
  useEffect(() => {
    if (!currentProjectId) {
      setMessages([]);
      setSelectedSourcesCount(0);
      return;
    }
    (async () => {
      const [msgList, sourcesList] = await Promise.all([
        getChatMessages(currentProjectId),
        fetchSources(currentProjectId),
      ]);
      setMessages(msgList.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })));
      const selected = sourcesList.filter((s) => s.selected);
      setSelectedSourcesCount(selected.length);
      setSelectedSourceNames(selected.map((s) => s.name));
    })();
  }, [currentProjectId]);

  const refreshSourceCount = useCallback(() => {
    if (!currentProjectId) return;
    fetchSources(currentProjectId).then((list) => {
      const selected = list.filter((s) => s.selected);
      setSelectedSourcesCount(selected.length);
      setSelectedSourceNames(selected.map((s) => s.name));
    }).catch(() => {});
  }, [currentProjectId]);

  useEffect(() => {
    window.addEventListener("focus", refreshSourceCount);
    return () => window.removeEventListener("focus", refreshSourceCount);
  }, [refreshSourceCount]);

  const runSearch = useCallback(() => {
    if (!currentProjectId || !searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    searchProject(currentProjectId, searchQuery).then((r) => {
      const hasAny = r.sources.length > 0 || r.messages.length > 0 || r.insights.length > 0;
      setSearchResults(hasAny ? r : null);
    });
  }, [currentProjectId, searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setSearchOpen(false);
  };

  const handleSend = async () => {
    if (!input.trim() || !currentProjectId) return;
    
    const userMessage = input;
    setInput("");
    
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage }
    ];
    
    setMessages([
      ...newMessages,
      { role: "assistant", content: "Thinking..." }
    ]);

    try {
      await appendChatMessage(currentProjectId, "user", userMessage);
      const sources = await fetchSources(currentProjectId);
      const selectedIds = sources.filter((s) => s.selected).map((s) => s.id);
      
      const response = await chatWithAI(
        userMessage,
        selectedIds,
        messages,
        currentProject?.summary ?? undefined
      );
      
      await appendChatMessage(currentProjectId, "assistant", response.content);
      setMessages([
        ...newMessages,
        { role: "assistant", content: response.content }
      ]);
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : "Sorry, I encountered an error. Please check your connection and Gemini API key.";
      setMessages([
        ...newMessages,
        { role: "assistant", content: errMsg }
      ]);
    }
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const isThinking =
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    messages[messages.length - 1].content === "Thinking...";

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const handlePin = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Saved to clipboard");
  };

  const setFeedback = (index: number, value: "up" | "down") => {
    setFeedbackByIndex((prev) => {
      const next = { ...prev };
      if (prev[index] === value) {
        delete next[index];
        return next;
      }
      next[index] = value;
      return next;
    });
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden panel-bg" role="main" aria-label="Chat">
      {/* Compact header */}
      <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-border flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground tracking-tight">Chat</h2>
        {currentProjectId && (
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className={cn(
              "p-1.5 rounded-lg transition-smooth",
              searchOpen ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            aria-label="Toggle search"
          >
            <Search className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Collapsible search */}
      {searchOpen && currentProjectId && (
        <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-border space-y-2 animate-slide-up">
          <div className="flex gap-1.5">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search sources, chat, insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
                className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border border-border bg-muted/50 focus:bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-smooth"
                aria-label="Search project"
                autoFocus
              />
            </div>
            <button
              type="button"
              onClick={runSearch}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-smooth focus-ring"
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearSearch}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {searchResults && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3 max-h-40 overflow-y-auto animate-fade-in">
              {searchResults.sources.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Sources</p>
                  {searchResults.sources.slice(0, 5).map((s) => (
                    <p key={s.id} className="text-xs truncate py-0.5">{s.name}</p>
                  ))}
                  {searchResults.sources.length > 5 && <p className="text-xs text-muted-foreground">+{searchResults.sources.length - 5} more</p>}
                </div>
              )}
              {searchResults.messages.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Chat</p>
                  {searchResults.messages.slice(0, 3).map((m, i) => (
                    <p key={i} className="text-xs truncate py-0.5">{m.content.slice(0, 80)}{m.content.length > 80 ? "…" : ""}</p>
                  ))}
                  {searchResults.messages.length > 3 && <p className="text-xs text-muted-foreground">+{searchResults.messages.length - 3} more</p>}
                </div>
              )}
              {searchResults.insights.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Insights</p>
                  {searchResults.insights.slice(0, 3).map((i, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInsightDetail(i)}
                      className="block w-full text-left text-xs truncate hover:text-primary py-0.5 transition-colors"
                    >
                      {i.summary}
                    </button>
                  ))}
                  {searchResults.insights.length > 3 && <p className="text-xs text-muted-foreground">+{searchResults.insights.length - 3} more</p>}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Insight detail popup (from search only) */}
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
                    <p className="text-foreground whitespace-pre-wrap rounded-md bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 px-3 py-2">{insightDetail.action}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Sources</p>
                  <p className="text-foreground">
                    {insightDetail.sourceNames?.length
                      ? insightDetail.sourceNames.join(", ")
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Evidence / Analysis</p>
                  <p className="text-foreground whitespace-pre-wrap">{insightDetail.evidence || "—"}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5">
        {messages.length === 0 && !isThinking && (
          <div className="flex flex-col items-center justify-center text-center py-12 sm:py-16 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl tofu-gradient flex items-center justify-center mb-4 shadow-md animate-pulse-soft">
              <MessageSquare className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {selectedSourcesCount === 0 ? "Welcome to tofuOS" : "Start a conversation"}
            </h3>
            {selectedSourcesCount === 0 ? (
              <div className="max-w-sm space-y-4">
                <p className="text-sm text-muted-foreground">Add sources and let AI help you analyze, plan, and build.</p>
                <div className="grid gap-2 text-left">
                  {[
                    { icon: <FileText className="w-4 h-4 text-primary" />, text: "Add sources — documents, reviews, or audio" },
                    { icon: <Sparkles className="w-4 h-4 text-tofu-warm" />, text: "Use Studio to analyze and generate docs" },
                    { icon: <MessageSquare className="w-4 h-4 text-primary" />, text: "Chat using your sources as context" },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                      <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0 shadow-sm">
                        {step.icon}
                      </div>
                      <span className="text-sm text-foreground">{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-sm">
                <p className="text-sm text-muted-foreground mb-2">
                  Ask questions about your sources, or use Studio for structured analysis.
                </p>
                <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                  {selectedSourcesCount} source{selectedSourcesCount !== 1 ? "s" : ""} selected
                </span>
              </div>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
            {msg.role === "assistant" ? (
              <div className="space-y-2 group">
                <div className="flex gap-3">
                  <div className="w-0.5 shrink-0 rounded-full bg-primary/30 self-stretch" />
                  <div className="text-sm leading-relaxed text-foreground whitespace-pre-line break-words flex-1 min-w-0">
                    {msg.content === "Thinking..." ? (
                      <div className="space-y-2 py-1">
                        <div className="h-4 w-3/4 rounded animate-shimmer" />
                        <div className="h-4 w-1/2 rounded animate-shimmer" />
                        <div className="h-4 w-2/3 rounded animate-shimmer" />
                      </div>
                    ) : (
                      renderContent(msg.content)
                    )}
                  </div>
                </div>
                {msg.content !== "Thinking..." && (
                  <div className="flex items-center gap-0.5 pl-3.5 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {[
                      { icon: <Pin className="w-3.5 h-3.5" />, title: "Save", action: () => handlePin(msg.content) },
                      { icon: <Copy className="w-3.5 h-3.5" />, title: "Copy", action: () => handleCopy(msg.content) },
                    ].map((btn, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={btn.action}
                        className="p-1.5 rounded-md hover:bg-muted transition-smooth text-muted-foreground hover:text-foreground"
                        title={btn.title}
                      >
                        {btn.icon}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFeedback(i, "up")}
                      className={cn(
                        "p-1.5 rounded-md transition-smooth",
                        feedbackByIndex[i] === "up" ? "bg-primary/15 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                      title="Good response"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedback(i, "down")}
                      className={cn(
                        "p-1.5 rounded-md transition-smooth",
                        feedbackByIndex[i] === "down" ? "bg-destructive/15 text-destructive" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                      title="Bad response"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="tofu-gradient text-primary-foreground px-4 py-2.5 rounded-2xl rounded-br-md text-sm max-w-[85%] sm:max-w-md break-words shadow-sm">
                  {msg.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Suggestion chips — horizontal scroll, only when no messages and sources exist */}
        {messages.length === 0 && !isThinking && selectedSourcesCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 animate-slide-up">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(s)}
                className="text-left text-xs px-4 py-2.5 rounded-full border border-border bg-background hover:bg-muted hover:border-primary/30 transition-smooth text-muted-foreground hover:text-foreground focus-ring"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 sm:p-5 border-t border-border bg-background shrink-0">
        {selectedSourceNames.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="inline-flex items-center rounded-full bg-muted text-muted-foreground px-2.5 py-1 text-[11px] font-medium">
              {selectedSourcesCount} source{selectedSourcesCount !== 1 ? "s" : ""}
            </span>
            <span className="text-[11px] text-muted-foreground truncate" title={selectedSourceNames.join(", ")}>
              {selectedSourceNames.slice(0, 2).join(", ")}{selectedSourceNames.length > 2 ? ` +${selectedSourceNames.length - 2}` : ""}
            </span>
          </div>
        )}
        <div className="flex items-end gap-2 chat-input-bg border border-border rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-primary/30 transition-all min-w-0 shadow-sm">
          <textarea
            placeholder="Type a message..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Auto-resize
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            className="flex-1 min-w-0 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground resize-none max-h-[120px]"
            aria-label="Chat message"
            style={{ height: "auto" }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 rounded-xl tofu-gradient text-primary-foreground hover:opacity-90 transition-smooth shrink-0 disabled:opacity-40 shadow-sm"
            aria-label="Send message"
            title="Send (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground text-center mt-2.5 px-1">
          Chat uses your selected sources as context. tofuOS can make mistakes — verify responses.
        </p>
      </div>
    </main>
  );
};

export default ChatPanel;
