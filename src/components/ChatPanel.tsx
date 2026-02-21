import { useState } from "react";
import { Send, ThumbsUp, ThumbsDown, Copy, Pin, SlidersHorizontal, MoreVertical } from "lucide-react";

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
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

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
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 chat-input-bg border border-border rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-ring transition-shadow">
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
    </main>
  );
};

export default ChatPanel;
