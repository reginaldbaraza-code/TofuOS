'use client';

import { useState } from "react";
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
  Sparkles,
} from "lucide-react";

interface StudioItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const studioItems: StudioItem[] = [
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
  const [activeItem, setActiveItem] = useState<string | null>(null);

  return (
    <aside className={`${mobile ? "w-full h-full" : "w-80 min-w-[300px] border-l"} border-border flex flex-col panel-bg`}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Studio</h2>
        <button className="p-1 rounded hover:bg-muted transition-colors">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {studioItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(activeItem === item.id ? null : item.id)}
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

      {/* Studio Output Area */}
      <div className="p-4 border-t border-border bg-background pb-safe">
        <div className="flex flex-col items-center text-center py-6">
          <Sparkles className="w-6 h-6 text-primary mb-2" />
          <p className="text-sm font-medium text-primary">
            Studio output will be saved here.
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            After adding sources, click to generate PRDs,
            Feature Specs, and more.
          </p>
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 tofu-gradient text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
          <FileText className="w-4 h-4" />
          Create Document
        </button>
      </div>
    </aside>
  );
};

export default StudioPanel;
