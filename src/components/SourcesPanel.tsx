import { Plus, Search, FileText, Upload, Link, CheckSquare } from "lucide-react";
import { useState } from "react";

interface Source {
  id: string;
  name: string;
  type: "pdf" | "link" | "transcript";
  selected: boolean;
}

const initialSources: Source[] = [
  { id: "1", name: "Customer_Interviews_Q4.pdf", type: "pdf", selected: true },
  { id: "2", name: "Usage_Analytics_Jan2026.csv", type: "transcript", selected: true },
  { id: "3", name: "Competitor_Analysis.pdf", type: "pdf", selected: false },
];

const SourcesPanel = ({ mobile }: { mobile?: boolean }) => {
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSource = (id: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  const allSelected = sources.every((s) => s.selected);
  const toggleAll = () => {
    setSources((prev) => prev.map((s) => ({ ...s, selected: !allSelected })));
  };

  const iconForType = (type: Source["type"]) => {
    switch (type) {
      case "pdf": return <FileText className="w-4 h-4 text-destructive" />;
      case "link": return <Link className="w-4 h-4 text-primary" />;
      case "transcript": return <FileText className="w-4 h-4 text-tofu-warm" />;
    }
  };

  return (
    <aside className={`${mobile ? "w-full h-full" : "w-72 min-w-[280px] border-r"} border-border flex flex-col panel-bg`}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Sources</h2>
        <button className="p-1 rounded hover:bg-muted transition-colors">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        </button>
      </div>

      <div className="p-3">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Plus className="w-4 h-4" />
          Add Sources
        </button>
      </div>

      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-lg border-none outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="px-3 pb-2">
        <button
          onClick={toggleAll}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${allSelected ? "bg-primary border-primary" : "border-border"}`}>
            {allSelected && <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
          Select All Sources
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {sources
          .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((source) => (
            <div
              key={source.id}
              onClick={() => toggleSource(source.id)}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors group"
            >
              <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${source.selected ? "bg-primary border-primary" : "border-border"}`}>
                {source.selected && <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              {iconForType(source.type)}
              <span className="text-sm truncate text-foreground">{source.name}</span>
            </div>
          ))}
      </div>
    </aside>
  );
};

export default SourcesPanel;
