'use client';

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createJiraIssue } from "@/lib/api";

interface CreateJiraModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insight: string;
  initialProjectKey?: string;
  onCreated?: (url: string, projectKey: string) => void;
}

export default function CreateJiraModal({
  open,
  onOpenChange,
  insight,
  initialProjectKey = "",
  onCreated,
}: CreateJiraModalProps) {
  const [summary, setSummary] = useState(insight);
  const [description, setDescription] = useState(insight);
  const [projectKey, setProjectKey] = useState(initialProjectKey);
  const [issueType, setIssueType] = useState("Task");
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSummary(insight);
      setDescription(insight);
      setProjectKey(initialProjectKey);
      setCreatedUrl(null);
    }
  }, [open, insight, initialProjectKey]);

  const reset = () => {
    setSummary(insight);
    setDescription(insight);
    setProjectKey("");
    setIssueType("Task");
    setError(null);
    setCreatedUrl(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleCreate = async () => {
    setError(null);
    if (!summary.trim()) {
      setError("Summary is required.");
      return;
    }
    if (!projectKey.trim()) {
      setError("Project key is required (e.g. KAN).");
      return;
    }
    setCreating(true);
    try {
      const result = await createJiraIssue({
        summary: summary.trim(),
        description: description.trim() || summary.trim(),
        projectKey: projectKey.trim(),
        issueType: issueType.trim() || undefined,
      });
      setCreatedUrl(result.url);
      onCreated?.(result.url, projectKey.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create issue");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Jira ticket</DialogTitle>
          <DialogDescription>
            Create a Jira issue from this insight. Edit summary and optional fields below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {createdUrl ? (
            <div className="space-y-2">
              <p className="text-sm text-foreground">Ticket created.</p>
              <a
                href={createdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline"
              >
                Open in Jira
              </a>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => handleOpenChange(false)}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="jira-summary">Summary</Label>
                <Input
                  id="jira-summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Issue summary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jira-description">Description (optional)</Label>
                <Input
                  id="jira-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Issue description"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="jira-project">Project key</Label>
                  <Input
                    id="jira-project"
                    value={projectKey}
                    onChange={(e) => setProjectKey(e.target.value)}
                    placeholder="e.g. PROJ"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jira-type">Issue type</Label>
                  <Input
                    id="jira-type"
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    placeholder="Task"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                onClick={handleCreate}
                disabled={creating}
                className="w-full tofu-gradient text-primary-foreground hover:opacity-90"
              >
                {creating ? "Creating…" : "Create issue"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
