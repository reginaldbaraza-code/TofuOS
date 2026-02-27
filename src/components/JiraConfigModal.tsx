'use client';

import { useState } from "react";
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

interface JiraConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export default function JiraConfigModal({ open, onOpenChange, onSaved }: JiraConfigModalProps) {
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError(null);
    const d = domain.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (!d || !email.trim() || !apiToken.trim()) {
      setError("Domain, email, and API token are required.");
      return;
    }
    setSaving(true);
    try {
      const { saveJiraConfig } = await import("@/lib/api");
      await saveJiraConfig(d, email.trim(), apiToken.trim());
      onSaved();
      onOpenChange(false);
      setDomain("");
      setEmail("");
      setApiToken("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Jira configuration</DialogTitle>
          <DialogDescription>
            Connect your Jira to create tickets from insights. Use your Atlassian email and an{" "}
            <a
              href="https://id.atlassian.com/manage-profile/security/api-tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              API token
            </a>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="jira-domain">Jira domain</Label>
            <Input
              id="jira-domain"
              placeholder="your-site.atlassian.net"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jira-email">Email</Label>
            <Input
              id="jira-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jira-token">API token</Label>
            <Input
              id="jira-token"
              type="password"
              placeholder="••••••••"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full tofu-gradient text-primary-foreground hover:opacity-90"
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
