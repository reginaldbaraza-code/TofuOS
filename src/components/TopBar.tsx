import Link from "next/link";
import { Plus, BarChart3, Share2, Settings, ChevronDown, LogOut, FolderOpen } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";

const TopBar = () => {
  const { user, signOut } = useAuth();
  const {
    currentProject,
    projects,
    setCurrentProjectId,
    createProjectAndSwitch,
    refreshProjects,
    isLoading: projectLoading,
  } = useProject();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleNewProject = async () => {
    setDropdownOpen(false);
    setCreating(true);
    try {
      await createProjectAndSwitch("Untitled Project");
      await refreshProjects();
    } finally {
      setCreating(false);
    }
  };

  const handleSelectProject = (id: string) => {
    setCurrentProjectId(id);
    setDropdownOpen(false);
  };

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

        {/* Project switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors truncate min-w-0"
          >
            <FolderOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium truncate max-w-[140px] md:max-w-[200px]">
              {projectLoading ? "Loading…" : currentProject?.name ?? "No project"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0" onClick={() => setDropdownOpen(false)} aria-hidden />
              <div className="absolute top-full left-0 mt-1 w-72 panel-bg border border-border rounded-xl shadow-lg py-1 max-h-80 overflow-y-auto z-50">
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => handleSelectProject(proj.id)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                      currentProject?.id === proj.id ? "text-foreground font-medium bg-muted/50" : "text-muted-foreground"
                    }`}
                  >
                    {currentProject?.id === proj.id ? (
                      <svg className="w-4 h-4 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      <span className="w-4" />
                    )}
                    <span className="truncate">{proj.name}</span>
                  </button>
                ))}
                <div className="border-t border-border mt-1 pt-1">
                  <button
                    type="button"
                    onClick={handleNewProject}
                    disabled={creating}
                    className="w-full text-left px-4 py-2.5 text-sm text-primary font-medium hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New project
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
          <BarChart3 className="w-4 h-4" />
          Analytics
        </button>
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <Link
          href="/settings"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <div className="hidden sm:flex gap-1">
          <Link
            href="/settings"
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
        <button
          onClick={signOut}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
        <div className="w-8 h-8 rounded-full tofu-gradient ml-1 md:ml-2 flex-shrink-0 flex items-center justify-center text-primary-foreground text-xs font-medium" title={user?.email}>
          {user?.user_metadata?.display_name?.charAt(0) ?? user?.email?.charAt(0) ?? "?"}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
