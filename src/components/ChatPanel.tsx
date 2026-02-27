'use client';

import { useState, useEffect } from "react";
import { Send, ThumbsUp, ThumbsDown, Copy, Pin, SlidersHorizontal, MoreVertical, Sparkles, ExternalLink } from "lucide-react";
import { fetchSources, analyzeSources, getJiraConfig } from "@/lib/api";
import JiraConfigModal from "@/components/JiraConfigModal";
import CreateJiraModal from "@/components/CreateJiraModal";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "What should we build next based on customer feedback?",
  "Create a PRD for the most requested feature.",
  "Which pain points appear most frequently in the interviews?",
];

const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Based on the **47 customer interviews** and usage data, I've summarized the key insights:\n\n**Top Pain Points:**\n- 73% of users report difficulties with **feature prioritization**\n- Missing connection between **customer feedback** and **development planning**\n- Manual synthesis of interviews takes an average of **12 hours per sprint**\n\n**Recommended Next Steps:**\n1. Implement automatic feedback categorization\n2. Calculate impact score based on user frequency\n3. Direct integration with the development backlog",
    },
  ]);
  const [input, setInput] = useState("");
  const [insights, setInsights] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [jiraConfigured, setJiraConfigured] = useState(false);
  const [jiraConfigModalOpen, setJiraConfigModalOpen] = useState(false);
  const [createJiraModalOpen, setCreateJiraModalOpen] = useState(false);
  const [createJiraInsight, setCreateJiraInsight] = useState("");
  const [lastProjectKey, setLastProjectKey] = useState("");

  useEffect(() => {
    getJiraConfig().then((c) => {
      setJiraConfigured(!!c?.configured);
      if (c?.lastProjectKey) setLastProjectKey(c.lastProjectKey);
    });
  }, []);

  const handleAnalyze = async () => {
    setAnalyzeError(null);
    setAnalyzing(true);
    try {
      const sources = await fetchSources();
      const selectedIds = sources.filter((s) => s.selected).map((s) => s.id);
      if (selectedIds.length === 0) {
        setAnalyzeError("Select at least one source in the left panel.");
        return;
      }
      const { insights: list } = await analyzeSources(selectedIds);
      setInsights(list || []);
    } catch (e) {
      setAnalyzeError(e instanceof Error ? e.message : "Analysis failed");
      setInsights([]);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCreateJiraClick = (insight: string) => {
    if (!jiraConfigured) {
      setJiraConfigModalOpen(true);
      setCreateJiraInsight(insight);
    } else {
      setCreateJiraInsight(insight);
      setCreateJiraModalOpen(true);
    }
  };

  const handleJiraConfigSaved = () => {
    getJiraConfig().then((c) => {
      setJiraConfigured(!!c?.configured);
      if (c?.lastProjectKey) setLastProjectKey(c.lastProjectKey);
    });
    if (createJiraInsight) {
      setCreateJiraModalOpen(true);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      {
        role: "assistant",
        content: "I'm analyzing your request and creating a detailed proposal based on the available sources...",
      },
    ]);
    setInput("");
  };

  const renderContent = (text: string) => {
    // Simple bold markdown rendering
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 panel-bg">
      {/* Header */}
      <div className="px-6 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Chat</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium tofu-gradient text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            <Sparkles className="w-4 h-4" />
            {analyzing ? "Analyzing…" : "Analyze sources"}
          </button>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Insights list (PM analysis) */}
      {insights.length > 0 && (
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h3 className="text-sm font-medium text-foreground mb-3">Insights (project manager)</h3>
          <ul className="space-y-2">
            {insights.map((insight, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-foreground bg-background border border-border rounded-lg px-3 py-2"
              >
                <span className="flex-1 min-w-0">{insight}</span>
                <button
                  type="button"
                  onClick={() => handleCreateJiraClick(insight)}
                  className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Create Jira ticket
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {analyzeError && (
        <div className="px-6 py-2 text-sm text-destructive">{analyzeError}</div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === "assistant" ? (
              <div className="space-y-3">
                <div className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                  {renderContent(msg.content)}
                </div>
                <div className="flex items-center gap-1 pt-1">
                  <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Save to Note">
                    <Pin className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Copy">
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-muted transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-muted transition-colors">
                    <ThumbsDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="tofu-gradient text-primary-foreground px-4 py-2.5 rounded-2xl rounded-br-md text-sm max-w-md">
                  {msg.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Suggestions */}
        <div className="space-y-2 pt-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(s);
              }}
              className="block w-fit text-left text-sm px-4 py-2.5 suggestion-bg rounded-xl suggestion-hover transition-colors text-foreground border border-border"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex items-center gap-2 chat-input-bg border border-border rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-ring transition-shadow mb-safe">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
          />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            3 Sources
          </span>
          <button
            onClick={handleSend}
            className="p-1.5 rounded-lg tofu-gradient text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground text-center mt-2">
          tofuOS can make mistakes. Please verify the responses.
        </p>
      </div>

      <JiraConfigModal
        open={jiraConfigModalOpen}
        onOpenChange={setJiraConfigModalOpen}
        onSaved={handleJiraConfigSaved}
      />
      <CreateJiraModal
        open={createJiraModalOpen}
        onOpenChange={setCreateJiraModalOpen}
        insight={createJiraInsight}
        initialProjectKey={lastProjectKey}
        onCreated={(url, key) => {
          setLastProjectKey(key);
        }}
      />
    </main>
  );
};

export default ChatPanel;
