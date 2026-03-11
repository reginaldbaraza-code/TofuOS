"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileText, Code, ChevronDown } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

export type ExportFormat = "markdown" | "json" | "csv";

interface ExportPanelProps {
  onExport: (format: ExportFormat) => Promise<void>;
  disabled?: boolean;
  variant?: "single" | "bulk";
  className?: string;
}

export function ExportPanel({
  onExport,
  disabled,
  variant = "single",
  className,
}: ExportPanelProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onOutside);
    return () => document.removeEventListener("click", onOutside);
  }, []);

  const handleExport = async (format: ExportFormat) => {
    setExporting(true);
    try {
      await onExport(format);
      setOpen(false);
    } finally {
      setExporting(false);
    }
  };

  const formats: { format: ExportFormat; label: string; icon: React.ReactNode }[] = [
    { format: "markdown", label: "Markdown (.md)", icon: <FileText className="h-4 w-4" /> },
    { format: "json", label: "JSON", icon: <Code className="h-4 w-4" /> },
  ];
  if (variant === "bulk") {
    formats.push({ format: "csv", label: "CSV", icon: <FileText className="h-4 w-4" /> });
  }

  return (
    <div className={cn("relative", className)} ref={ref}>
      <Button
        size="sm"
        variant="outline"
        leftIcon={<Download className="h-4 w-4" />}
        rightIcon={<ChevronDown className="h-4 w-4" />}
        onClick={() => setOpen(!open)}
        disabled={disabled || exporting}
      >
        Export
      </Button>
      {open && (
        <div
          className="absolute right-0 top-full z-10 mt-1 min-w-[160px] rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] py-1 shadow-[var(--shadow-lg)]"
          role="menu"
        >
          {formats.map(({ format, label, icon }) => (
            <button
              key={format}
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted-bg)]"
              onClick={() => handleExport(format)}
              disabled={exporting}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
