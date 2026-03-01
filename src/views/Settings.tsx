'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getJiraConfig } from "@/lib/api";
import JiraConfigModal from "@/components/JiraConfigModal";
import { Button } from "@/components/ui/button";
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
  User,
  LogOut,
  Key,
  ExternalLink,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Sparkles,
  Info,
} from "lucide-react";

const Settings = () => {
  const { user, signOut } = useAuth();
  const [jiraConfigured, setJiraConfigured] = useState(false);
  const [jiraConfigModalOpen, setJiraConfigModalOpen] = useState(false);

  useEffect(() => {
    getJiraConfig().then((c) => setJiraConfigured(!!c?.configured));
  }, []);

  const handleJiraConfigSaved = () => {
    setJiraConfigured(true);
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
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Jira</p>
                  <p className="text-xs text-muted-foreground">
                    Create tickets from insights in the Chat panel
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {jiraConfigured ? (
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
                    {jiraConfigured ? "Reconfigure" : "Configure"}
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
    </div>
  );
};

export default Settings;
