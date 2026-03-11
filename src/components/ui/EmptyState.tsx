"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-2xl)] border border-dashed border-[var(--card-border)] bg-[var(--card)]/50 py-12 px-6 text-center sm:py-16",
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-5xl opacity-90 sm:text-6xl" aria-hidden>
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[var(--foreground)] sm:text-lg">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-[var(--muted)]">
          {description}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center justify-center rounded-[var(--radius-lg)] bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[var(--accent-hover)] hover:shadow-[var(--shadow-md)]"
          >
            {action.label}
          </Link>
        )}
        {secondaryAction && (
          <Link
            href={secondaryAction.href}
            className="inline-flex items-center justify-center rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-all hover:bg-[var(--muted-bg)]"
          >
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </div>
  );
}
