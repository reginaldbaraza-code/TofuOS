"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { SUGGESTED_QUESTIONS } from "@/lib/prompts";
import { Button } from "@/components/ui";
import { Mic, MicOff, MessageCircle, ChevronRight, Sparkles } from "lucide-react";

interface InterviewData {
  id: string;
  title: string;
  status: string;
  persona: {
    id: string;
    name: string;
    avatarEmoji: string;
    role: string;
    company: string | null;
  };
  messages: {
    id: string;
    role: string;
    content: string;
    createdAt: string;
  }[];
}

export default function InterviewChatPage() {
  const params = useParams();
  const router = useRouter();
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [voiceMode, setVoiceMode] = useState(false); // Stub: ready for speech-to-text / text-to-speech
  const [ending, setEnding] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, setMessages, error, clearError } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { interviewId: params.id as string },
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    fetch(`/api/interviews/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setInterview(data);
        if (data.messages?.length) {
          setMessages(
            data.messages.map((m: { id: string; role: string; content: string }) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content,
              parts: [{ type: "text" as const, text: m.content }],
            }))
          );
        }
        setLoading(false);
      });
  }, [params.id, setMessages]);

  useEffect(() => {
    if (!interview) return;
    const start = new Date(interview.messages?.[0]?.createdAt || Date.now()).getTime();
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [interview]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv || !containerRef.current) return;
    const onResize = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${vv.height}px`;
      }
    };
    vv.addEventListener("resize", onResize);
    vv.addEventListener("scroll", onResize);
    return () => {
      vv.removeEventListener("resize", onResize);
      vv.removeEventListener("scroll", onResize);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const endInterview = async () => {
    setEnding(true);
    try {
      await fetch(`/api/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId: params.id }),
      });
      router.push(`/interviews/${params.id}/review`);
    } catch {
      setEnding(false);
      alert("Failed to end interview. Please try again.");
    }
  };

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput("");
    sendMessage({ text: msg });
  }, [input, isLoading, sendMessage]);

  const useSuggestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getMessageText = (msg: { content?: string; parts?: Array<{ type: string; text?: string }> }) => {
    if (msg.parts) {
      return msg.parts
        .filter((p): p is { type: string; text: string } => p.type === "text" && typeof p.text === "string")
        .map((p) => p.text)
        .join("");
    }
    return msg.content || "";
  };

  if (loading || !interview) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm animate-pulse-slow" style={{ color: "var(--muted)" }}>Loading interview...</div>
      </div>
    );
  }

  if (interview.status === "completed") {
    router.push(`/interviews/${params.id}/review`);
    return null;
  }

  return (
    <div ref={containerRef} className="flex h-full max-h-full overflow-hidden">
      <div className="flex flex-1 flex-col min-h-0 min-w-0">
        <div
          className="flex items-center justify-between border-b px-4 py-3 sm:px-6 shrink-0"
          style={{
            background: "var(--card)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0">{interview.persona.avatarEmoji}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                {interview.persona.name}
              </p>
              <p className="text-xs text-[var(--muted)] truncate">
                {interview.persona.role}
                {interview.persona.company ? ` at ${interview.persona.company}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="font-mono text-xs tabular-nums text-[var(--muted)] hidden sm:inline"
              aria-label="Elapsed time"
            >
              {formatTime(elapsed)}
            </span>
            <button
              type="button"
              onClick={() => setVoiceMode(!voiceMode)}
              className={`rounded-[var(--radius-lg)] p-2.5 transition-colors ${
                voiceMode ? "bg-[var(--accent-muted)] text-[var(--accent)]" : "text-[var(--muted)] hover:bg-[var(--muted-bg)]"
              }`}
              title={voiceMode ? "Voice mode on (coming soon)" : "Voice mode (coming soon)"}
              aria-pressed={voiceMode}
            >
              {voiceMode ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="hidden sm:flex items-center gap-1.5 rounded-[var(--radius-lg)] px-3 py-2 text-xs font-medium text-[var(--muted)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              {showSuggestions ? "Hide" : "Show"} questions
            </button>
            <Button
              size="sm"
              variant="danger"
              onClick={endInterview}
              disabled={ending || messages.length < 2}
            >
              {ending ? "Analyzing…" : "End interview"}
            </Button>
          </div>
        </div>

        {error && (
          <div
            className="mx-auto max-w-2xl px-4 py-3 rounded-[var(--radius-lg)] flex items-center justify-between gap-3 border border-[var(--danger)]/30 bg-[var(--danger-muted)]"
          >
            <span className="text-sm text-[var(--danger)]">
              {error.message || "Something went wrong. Check that OPENAI_API_KEY is set in your deployment."}
            </span>
            <button
              type="button"
              onClick={() => clearError()}
              className="shrink-0 rounded-[var(--radius-md)] px-2 py-1 text-xs font-medium text-[var(--danger)] hover:bg-[var(--danger)]/10"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 min-h-0">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center">
              <span className="mb-4 text-5xl sm:text-6xl">{interview.persona.avatarEmoji}</span>
              <p className="text-base font-medium text-[var(--foreground)]">
                Interview with {interview.persona.name}
              </p>
              <p className="mt-2 max-w-sm text-sm text-[var(--muted)]">
                Start the conversation by asking a question. Use the suggestions panel or type your own.
              </p>
            </div>
          )}

          <div className="mx-auto max-w-2xl space-y-5">
            {messages.map((msg) => {
              const text = getMessageText(msg);
              if (!text) return null;
              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  {msg.role === "assistant" && (
                    <span className="mr-2 mt-1 shrink-0 text-xl">{interview.persona.avatarEmoji}</span>
                  )}
                  <div
                    className={`max-w-[85%] rounded-[var(--radius-xl)] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "rounded-br-md bg-[var(--chat-user)] text-white"
                        : "rounded-bl-md bg-[var(--chat-assistant)] text-[var(--foreground)]"
                    }`}
                  >
                    {text}
                  </div>
                </div>
              );
            })}

            {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-start animate-fade-in">
                <span className="mr-2 mt-1 text-xl shrink-0">{interview.persona.avatarEmoji}</span>
                <div className="rounded-[var(--radius-xl)] rounded-bl-md bg-[var(--chat-assistant)] px-4 py-3">
                  <span className="inline-flex gap-1">
                    <span className="animate-pulse-slow text-[var(--muted)]">●</span>
                    <span className="animate-pulse-slow text-[var(--muted)]" style={{ animationDelay: "0.2s" }}>●</span>
                    <span className="animate-pulse-slow text-[var(--muted)]" style={{ animationDelay: "0.4s" }}>●</span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div
          className="border-t p-3 sm:p-4 shrink-0"
          style={{ borderColor: "var(--card-border)" }}
        >
          <div className="mx-auto flex max-w-2xl gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask a question..."
              rows={1}
              className="flex-1 resize-none rounded-[var(--radius-xl)] border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)] disabled:opacity-50"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              Send
            </Button>
          </div>
        </div>
      </div>

      {showSuggestions && (
        <div
          className="hidden w-80 shrink-0 overflow-y-auto border-l p-4 lg:block"
          style={{
            background: "var(--sidebar-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            <MessageCircle className="h-4 w-4" />
            Suggested questions
          </h3>
          <div className="space-y-4">
            {SUGGESTED_QUESTIONS.map((category) => (
              <div key={category.category}>
                <p className="mb-2 text-xs font-medium text-[var(--foreground)]">
                  {category.category}
                </p>
                <div className="space-y-1">
                  {category.questions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => useSuggestion(q)}
                      className="block w-full rounded-[var(--radius-lg)] px-3 py-2 text-left text-xs leading-snug text-[var(--muted)] transition-colors hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
