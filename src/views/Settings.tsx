'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";
import {
  getJiraConfig,
  fetchProjects,
  updateProject,
  deleteProject,
  type JiraConfig,
  type Project,
} from "@/lib/api";
import JiraConfigModal from "@/components/JiraConfigModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  LogOut,
  Key,
  ExternalLink,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Sparkles,
  Info,
  FolderOpen,
  Pencil,
  Trash2,
} from "lucide-react";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { projects: _projects, setCurrentProjectId, refreshProjects, currentProjectId } = useProject();
  const [jiraConfig, setJiraConfig] = useState<JiraConfig | null>(null);
  const [jiraConfigModalOpen, setJiraConfigModalOpen] = useState(false);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getJiraConfig().then((c) => setJiraConfig(c ?? null));
  }, []);

  useEffect(() => {
    fetchProjects().then(setProjectsList);
  }, [jiraConfigModalOpen]);

  const loadProjects = () => {
    fetchProjects().then(setProjectsList);
    refreshProjects();
  };

  const handleJiraConfigSaved = () => {
    getJiraConfig().then((c) => setJiraConfig(c ?? null));
  };

  const handleStartRename = (proj: Project) => {
    setEditingProjectId(proj.id);
    setEditingName(proj.name);
  };

  const handleSaveRename = async () => {
    if (!editingProjectId || !editingName.trim()) return;
    setSaving(true);
    try {
      await updateProject(editingProjectId, editingName.trim());
      setEditingProjectId(null);
      setEditingName("");
      loadProjects();
    } finally {
      setSaving(false);
    }
  };

  const handleCancelRename = () => {
    setEditingProjectId(null);
    setEditingName("");
  };

  const handleConfirmDelete = async () => {
    if (!deleteProjectId) return;
    setDeleting(true);
    try {
      await deleteProject(deleteProjectId);
      if (currentProjectId === deleteProjectId) {
        const remaining = projectsList.filter((p) => p.id !== deleteProjectId);
        setCurrentProjectId(remaining[0]?.id ?? null);
      }
      setDeleteProjectId(null);
      loadProjects();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border panel-bg">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/" className="rounded-lg">
              <ChevronLeft className="w-5 h-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Account */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              Account
            </CardTitle>
            <CardDescription>Your account and sign-in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Email</Label>
              <p className="text-sm text-foreground font-medium">{user?.email ?? "—"}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => signOut()}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="w-4 h-4" />
              Integrations
            </CardTitle>
            <CardDescription>Connect Jira and configure AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Jira */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Jira</p>
                  <p className="text-xs text-muted-foreground">
                    Create tickets from insights in the Chat panel
                  </p>
                  {jiraConfig?.configured && jiraConfig.domain && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Current: <span className="text-foreground">{jiraConfig.domain}</span>
                      {jiraConfig.email && (
                        <> · <span className="text-foreground">{jiraConfig.email}</span></>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {jiraConfig?.configured ? (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <CheckCircle className="w-4 h-4" />
                      Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <XCircle className="w-4 h-4" />
                      Not connected
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setJiraConfigModalOpen(true)}
                  >
                    {jiraConfig?.configured ? "Reconfigure" : "Configure"}
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Gemini */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">AI (Gemini)</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Chat, insights, and Studio use Google Gemini. Set{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-[11px]">
                      GOOGLE_GEMINI_API_KEY
                    </code>{" "}
                    in your environment: <code className="rounded bg-muted px-1 py-0.5 text-[11px]">.env.local</code> for
                    local dev, or in Vercel Project Settings → Environment Variables for production.
                  </p>
                  <a
                    href="https://ai.google.dev/gemini-api/docs/api-key"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                  >
                    Get an API key
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Projects
            </CardTitle>
            <CardDescription>
              Rename or delete projects. Sources, chat, and insights are stored per project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {projectsList.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects yet. Create one from the app header.</p>
            ) : (
              <ul className="space-y-2">
                {projectsList.map((proj) => (
                  <li
                    key={proj.id}
                    className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/20"
                  >
                    {editingProjectId === proj.id ? (
                      <>
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveRename();
                            if (e.key === "Escape") handleCancelRename();
                          }}
                          className="flex-1 h-8"
                          placeholder="Project name"
                          autoFocus
                        />
                        <Button size="sm" onClick={handleSaveRename} disabled={saving}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelRename}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm font-medium text-foreground truncate">
                          {proj.name}
                        </span>
                        {currentProjectId === proj.id && (
                          <span className="text-xs text-muted-foreground shrink-0">Current</span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => handleStartRename(proj)}
                          title="Rename"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                          onClick={() => setDeleteProjectId(proj.id)}
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* About */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="w-4 h-4" />
              About
            </CardTitle>
            <CardDescription>App and help</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-foreground font-medium">tofuOS</p>
            <p className="text-xs text-muted-foreground">
              AI-powered product management workspace. Use sources, chat, and Studio to generate PRDs, specs, and Jira tickets.
            </p>
            <a
              href="https://github.com/reginaldbaraza-code/TofuOS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
            >
              View on GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
          </CardContent>
        </Card>
      </div>

      <JiraConfigModal
        open={jiraConfigModalOpen}
        onOpenChange={setJiraConfigModalOpen}
        onSaved={handleJiraConfigSaved}
      />
      <Dialog open={!!deleteProjectId} onOpenChange={(open) => !open && setDeleteProjectId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              This will permanently delete this project and all its sources, chat messages, and insights. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProjectId(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
