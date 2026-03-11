"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSupabaseSession } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  Lightbulb,
  Menu,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/personas", label: "Personas", icon: Users },
  { href: "/interviews", label: "Interviews", icon: MessageCircle },
  { href: "/insights", label: "Insights", icon: Lightbulb },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, loading } = useSupabaseSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore if Supabase not configured
    }
    router.push("/login");
    router.refresh();
  };

  useEffect(() => {
    if (loading) return;
    if (!session?.user) router.replace("/login");
  }, [loading, session?.user, router]);

  if (loading || !session?.user) {
    return (
      <div
        className="flex h-dvh items-center justify-center"
        style={{ background: "var(--background)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--muted-bg)]" />
          <p className="text-sm text-[var(--muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-dvh overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-[var(--overlay)] backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar: frosted, soft border */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r transition-transform duration-300 ease-out md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          background: "var(--sidebar-bg)",
          borderColor: "var(--sidebar-border)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
        }}
      >
        {/* Logo / app name */}
        <div
          className="flex h-14 items-center gap-2.5 border-b px-5"
          style={{ borderColor: "var(--sidebar-border)" }}
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)]"
            style={{ background: "var(--accent)", color: "white" }}
          >
            <MessageCircle className="h-5 w-5" strokeWidth={2} />
          </div>
          <span
            className="text-base font-semibold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Tofu
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)]"
                        : "text-[var(--muted)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <Icon
                      className="h-5 w-5 shrink-0 opacity-90"
                      strokeWidth={1.75}
                    />
                    {item.label}
                    {isActive && (
                      <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User & sign out */}
        <div
          className="border-t p-3"
          style={{ borderColor: "var(--sidebar-border)" }}
        >
          <div className="flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2.5">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium"
              style={{
                background: "var(--accent-muted)",
                color: "var(--accent)",
              }}
            >
              {(session?.user?.name || session?.user?.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                {session?.user?.name || "User"}
              </p>
              <p
                className="truncate text-xs"
                style={{ color: "var(--muted)" }}
              >
                {session?.user?.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="shrink-0 rounded-[var(--radius-md)] p-2 text-[var(--muted)] transition-colors hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              title="Sign out"
              type="button"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header
          className="flex h-14 items-center gap-3 border-b px-4 md:hidden"
          style={{
            background: "var(--card)",
            borderColor: "var(--card-border)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-[var(--radius-md)] p-2 text-[var(--foreground)] transition-colors hover:bg-[var(--muted-bg)]"
            type="button"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Tofu
          </span>
        </header>

        <main className="flex-1 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
