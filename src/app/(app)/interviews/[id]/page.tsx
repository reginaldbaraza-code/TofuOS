"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { SUGGESTED_QUESTIONS } from "@/lib/prompts";

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
          className="flex items-center justify-between border-b px-3 py-2 sm:px-5 sm:py-3 shrink-0"
          style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{interview.persona.avatarEmoji}</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {interview.persona.name}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {interview.persona.role}
                {interview.persona.company ? ` at ${interview.persona.company}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tabular-nums" style={{ color: "var(--muted)" }}>
              {formatTime(elapsed)}
            </span>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="hidden rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:block"
              style={{ background: "var(--muted-bg)", color: "var(--foreground)" }}
            >
              {showSuggestions ? "Hide" : "Show"} Questions
            </button>
            <button
              onClick={endInterview}
              disabled={ending || messages.length < 2}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--danger)" }}
            >
              {ending ? "Analyzing..." : "End Interview"}
            </button>
          </div>
        </div>

        {error && (
          <div
            className="mx-auto max-w-2xl px-3 py-2 rounded-lg flex items-center justify-between gap-2"
            style={{ background: "var(--danger)", color: "#fff" }}
          >
            <span className="text-sm">
              {error.message || "Something went wrong. Check that the Gemini API key is set (GOOGLE_GENERATIVE_AI_API_KEY) in your deployment."}
            </span>
            <button
              type="button"
              onClick={() => clearError()}
              className="shrink-0 rounded px-2 py-1 text-xs font-medium hover:bg-white/20"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6 min-h-0">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 sm:py-16 text-center">
              <span className="mb-3 text-4xl sm:text-5xl">{interview.persona.avatarEmoji}</span>
              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                Interview with {interview.persona.name}
              </p>
              <p className="mt-1 max-w-sm text-xs" style={{ color: "var(--muted)" }}>
                Start the conversation by asking a question.
              </p>
            </div>
          )}

          <div className="mx-auto max-w-2xl space-y-4">
            {messages.map((msg) => {
              const text = getMessageText(msg);
              if (!text) return null;
              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  {msg.role === "assistant" && (
                    <span className="mr-2 mt-1 shrink-0 text-lg">{interview.persona.avatarEmoji}</span>
                  )}
                  <div
                    className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                    style={{
                      background: msg.role === "user" ? "var(--chat-user)" : "var(--chat-assistant)",
                      color: msg.role === "user" ? "#ffffff" : "var(--foreground)",
                      borderBottomRightRadius: msg.role === "user" ? "4px" : undefined,
                      borderBottomLeftRadius: msg.role === "assistant" ? "4px" : undefined,
                    }}
                  >
                    {text}
                  </div>
                </div>
              );
            })}

            {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-start animate-fade-in">
                <span className="mr-2 mt-1 text-lg">{interview.persona.avatarEmoji}</span>
                <div
                  className="rounded-2xl px-4 py-3 text-sm"
                  style={{ background: "var(--chat-assistant)" }}
                >
                  <span className="inline-flex gap-1">
                    <span className="animate-pulse-slow" style={{ color: "var(--muted)" }}>●</span>
                    <span className="animate-pulse-slow" style={{ color: "var(--muted)", animationDelay: "0.2s" }}>●</span>
                    <span className="animate-pulse-slow" style={{ color: "var(--muted)", animationDelay: "0.4s" }}>●</span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t p-2 sm:p-4 shrink-0" style={{ borderColor: "var(--card-border)" }}>
          <div className="mx-auto flex max-w-2xl gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask a question..."
              rows={1}
              className="flex-1 resize-none rounded-xl border px-3 py-2.5 text-sm transition-all sm:px-4 sm:py-3"
              style={{
                background: "var(--card)",
                borderColor: "var(--card-border)",
                color: "var(--foreground)",
              }}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="shrink-0 rounded-xl px-3 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-40 sm:px-4 sm:py-3"
              style={{ background: "var(--accent)" }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {showSuggestions && (
        <div
          className="hidden w-72 shrink-0 overflow-y-auto border-l p-4 lg:block"
          style={{ background: "var(--sidebar-bg)", borderColor: "var(--card-border)" }}
        >
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Suggested Questions
          </h3>
          <div className="space-y-4">
            {SUGGESTED_QUESTIONS.map((category) => (
              <div key={category.category}>
                <p className="mb-1.5 text-xs font-medium" style={{ color: "var(--foreground)" }}>
                  {category.category}
                </p>
                <div className="space-y-1">
                  {category.questions.map((q) => (
                    <button
                      key={q}
                      onClick={() => useSuggestion(q)}
                      className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs leading-snug transition-all hover:opacity-80"
                      style={{ color: "var(--muted)", background: "transparent" }}
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
