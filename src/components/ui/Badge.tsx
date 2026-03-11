"use client";

import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "success" | "danger" | "muted";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-[var(--muted-bg)] text-[var(--foreground)]",
    accent:
      "bg-[var(--accent-muted)] text-[var(--accent)]",
    success:
      "bg-[var(--success-muted)] text-[var(--success)]",
    danger:
      "bg-[var(--danger-muted)] text-[var(--danger)]",
    muted:
      "bg-transparent text-[var(--muted)] border border-[var(--card-border)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
