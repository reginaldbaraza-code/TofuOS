import { Plus, BarChart3, Share2, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";

const outputTypes = [
  "PRD",
  "AI Coding Rules & Standards",
  "API Documentation",
  "Accessibility Compliance Checklist",
  "App Architecture Plan",
  "Bug Investigation & Fix Plan",
  "Competitive Analysis Report",
  "Customer Journey Map",
  "Database Schema Design",
  "Feature Implementation Spec",
  "Go-to-Market Plan",
];

const TopBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("PRD");

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-3 md:px-4 panel-bg relative z-50">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg tofu-gradient flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">🧊</span>
          </div>
          <span className="font-semibold text-foreground text-sm tracking-tight hidden sm:inline">tofuOS</span>
        </div>

        <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

        {/* Output Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors truncate"
          >
            <span className="text-muted-foreground text-xs hidden sm:inline">ChatPRD:</span>
            <span className="font-medium truncate max-w-[120px] md:max-w-none">{selectedType}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0" onClick={() => setDropdownOpen(false)} />
              <div className="absolute top-full left-0 mt-1 w-72 panel-bg border border-border rounded-xl shadow-lg py-1 max-h-80 overflow-y-auto">
                {outputTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedType(type);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                      selectedType === type ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {selectedType === type && (
                      <svg className="w-4 h-4 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                    <span className={selectedType !== type ? "ml-6" : ""}>
                      ChatPRD: {type}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 tofu-gradient text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          New Project
        </button>
        <button className="md:hidden p-2 tofu-gradient text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
        </button>
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
          <BarChart3 className="w-4 h-4" />
          Analytics
        </button>
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <div className="hidden sm:flex gap-1">
          <button className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        <div className="w-8 h-8 rounded-full tofu-gradient ml-1 md:ml-2 flex-shrink-0" />
      </div>
    </header>
  );
};

export default TopBar;
