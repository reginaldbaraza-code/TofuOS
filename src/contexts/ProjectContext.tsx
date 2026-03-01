'use client';

import * as React from "react";
import {
  fetchProjects,
  createProject,
  type Project,
} from "@/lib/api";

const STORAGE_KEY = "tofuos-current-project-id";

interface ProjectContextValue {
  currentProjectId: string | null;
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  setCurrentProjectId: (id: string | null) => void;
  refreshProjects: () => Promise<void>;
  createProjectAndSwitch: (name?: string) => Promise<Project>;
  ensureProject: () => Promise<string | null>;
}

const ProjectContext = React.createContext<ProjectContextValue | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectIdState] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const setCurrentProjectId = React.useCallback((id: string | null) => {
    setCurrentProjectIdState(id);
    if (typeof window !== "undefined") {
      if (id) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const refreshProjects = React.useCallback(async () => {
    const list = await fetchProjects();
    setProjects(list);
    return;
  }, []);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const list = await fetchProjects();
      if (!mounted) return;
      setProjects(list);
      const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored && list.some((p) => p.id === stored)) {
        setCurrentProjectIdState(stored);
      } else if (list.length > 0) {
        setCurrentProjectIdState(list[0].id);
        if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, list[0].id);
      }
      setIsLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [refreshProjects]);

  const createProjectAndSwitch = React.useCallback(async (name: string = "Untitled Project") => {
    const project = await createProject(name);
    setProjects((prev) => [project, ...prev]);
    setCurrentProjectId(project.id);
    return project;
  }, [setCurrentProjectId]);

  const ensureProject = React.useCallback(async () => {
    if (currentProjectId) return currentProjectId;
    if (projects.length > 0) {
      setCurrentProjectId(projects[0].id);
      return projects[0].id;
    }
    const project = await createProject("Untitled Project");
    setProjects((prev) => [project, ...prev]);
    setCurrentProjectId(project.id);
    return project.id;
  }, [currentProjectId, projects, setCurrentProjectId]);

  const currentProject = currentProjectId
    ? projects.find((p) => p.id === currentProjectId) ?? null
    : null;

  const value: ProjectContextValue = {
    currentProjectId,
    currentProject,
    projects,
    isLoading,
    setCurrentProjectId,
    refreshProjects,
    createProjectAndSwitch,
    ensureProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = React.useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
