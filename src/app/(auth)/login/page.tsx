"use client";

import { useState } from "react";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Input } from "@/components/ui";
import { MessageCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(
        message.includes("NEXT_PUBLIC_SUPABASE")
          ? "App not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel (or .env.local)."
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!hasSupabaseConfig()) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 bg-[var(--background)]">
        <Card className="w-full max-w-md p-6 text-center" padding="none">
          <p className="mb-2 text-lg font-medium text-[var(--foreground)]">
            Configuration required
          </p>
          <p className="text-sm text-[var(--muted)]">
            Add <strong>NEXT_PUBLIC_SUPABASE_URL</strong> and{" "}
            <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> in your Vercel project
            → Settings → Environment Variables, then redeploy.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 bg-[var(--background)]">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[var(--radius-2xl)]"
            style={{ background: "var(--accent)", color: "white" }}
          >
            <MessageCircle className="h-7 w-7" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Tofu
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Sign in to start interviewing PM personas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-[var(--radius-lg)] border border-[var(--danger)]/30 bg-[var(--danger-muted)] px-4 py-3 text-sm text-[var(--danger)]">
              {error}
            </div>
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-[var(--accent)] transition-colors hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
