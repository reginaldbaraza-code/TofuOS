import TopBar from "@/components/TopBar";
import SourcesPanel from "@/components/SourcesPanel";
import ChatPanel from "@/components/ChatPanel";
import StudioPanel from "@/components/StudioPanel";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type MobileTab = "sources" | "chat" | "studio";

const Index = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<MobileTab>("chat");

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <TopBar />
        {/* Tab bar */}
        <div className="flex border-b border-border">
          {([
            { key: "sources", label: "Sources" },
            { key: "chat", label: "Chat" },
            { key: "studio", label: "Studio" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
        {/* Tab content */}
        <div className="flex-1 min-h-0">
          {activeTab === "sources" && <SourcesPanel mobile />}
          {activeTab === "chat" && <ChatPanel />}
          {activeTab === "studio" && <StudioPanel mobile />}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TopBar />
      <div className="flex flex-1 min-h-0">
        <SourcesPanel />
        <ChatPanel />
        <StudioPanel />
      </div>
    </div>
  );
};

export default Index;
