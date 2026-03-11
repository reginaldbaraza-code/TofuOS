"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeClasses = {
  sm: "rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium gap-1.5",
  md: "rounded-[var(--radius-lg)] px-4 py-2.5 text-sm font-medium gap-2",
  lg: "rounded-[var(--radius-xl)] px-5 py-3 text-sm font-medium gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  },
  ref
) {
  const base =
    "inline-flex items-center justify-center transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent)] disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
    secondary:
      "bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-[var(--card-border)]",
    ghost:
      "bg-transparent text-[var(--foreground)] hover:bg-[var(--muted-bg)]",
    danger:
      "bg-[var(--danger)] text-white hover:opacity-90",
    outline:
      "border border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted-bg-elevated)]",
  };

  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizeClasses[size], className)}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
});
