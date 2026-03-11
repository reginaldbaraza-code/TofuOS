"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outline" | "ghost";
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant = "default", padding = "md", children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[var(--radius-xl)] border transition-all duration-200",
        variant === "default" &&
          "bg-[var(--card)] border-[var(--card-border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-[var(--card-border)]",
        variant === "elevated" &&
          "bg-[var(--card)] border-[var(--card-border)] shadow-[var(--shadow-md)]",
        variant === "outline" &&
          "bg-transparent border-[var(--card-border)]",
        variant === "ghost" &&
          "bg-[var(--muted-bg-elevated)] border-transparent",
        paddingMap[padding],
        className
      )}
      style={{ borderColor: "var(--card-border)" }}
      {...props}
    >
      {children}
    </div>
  );
});

export const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardHeader({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("mb-4", className)}
      {...props}
    />
  );
});

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(function CardTitle({ className, ...props }, ref) {
  return (
    <h3
      ref={ref}
      className={cn(
        "text-sm font-semibold tracking-tight text-[var(--foreground)]",
        className
      )}
      {...props}
    />
  );
});

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn("mt-1 text-xs text-[var(--muted)]", className)}
      {...props}
    />
  );
});
