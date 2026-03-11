"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    containerClassName?: string;
  }
>(function Input(
  { className, label, error, containerClassName, id, ...props },
  ref
) {
  const inputId = id ?? (label ? label.replace(/\s/g, "-").toLowerCase() : undefined);
  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-[var(--muted)]"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "w-full rounded-[var(--radius-lg)] border bg-[var(--card)] px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)]",
          error && "border-[var(--danger)]",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-[var(--danger)]">{error}</p>
      )}
    </div>
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
    containerClassName?: string;
  }
>(function Textarea(
  { className, label, error, containerClassName, id, ...props },
  ref
) {
  const inputId = id ?? (label ? label.replace(/\s/g, "-").toLowerCase() : undefined);
  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-[var(--muted)]"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          "w-full rounded-[var(--radius-lg)] border bg-[var(--card)] px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)] resize-none",
          error && "border-[var(--danger)]",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-[var(--danger)]">{error}</p>
      )}
    </div>
  );
});
