/**
 * Shared AI model and retry helpers.
 *
 * Supports multiple providers via the AI_PROVIDER env var:
 *   - "openai"    (default) — requires OPENAI_API_KEY
 *   - "google"    — requires GOOGLE_GENERATIVE_AI_API_KEY
 *   - "anthropic" — requires ANTHROPIC_API_KEY
 *
 * Override the model with AI_MODEL (or legacy OPENAI_MODEL).
 */
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";

type AIProvider = "openai" | "google" | "anthropic";

const PROVIDER_DEFAULTS: Record<AIProvider, string> = {
  openai: "gpt-4o-mini",
  google: "gemini-2.5-flash",
  anthropic: "claude-sonnet-4-5-20250514",
};

const PROVIDER_FACTORIES = {
  openai: (model: string) => openai(model),
  google: (model: string) => google(model),
  anthropic: (model: string) => anthropic(model),
} as const;

function getProvider(): AIProvider {
  const p = (process.env.AI_PROVIDER || "openai").toLowerCase();
  if (p !== "openai" && p !== "google" && p !== "anthropic") {
    throw new Error(
      `Unknown AI_PROVIDER: "${p}". Use "openai", "google", or "anthropic".`
    );
  }
  return p;
}

export function getModel() {
  const provider = getProvider();
  const model =
    process.env.AI_MODEL || process.env.OPENAI_MODEL || PROVIDER_DEFAULTS[provider];
  return PROVIDER_FACTORIES[provider](model);
}

/** Check if an error is a quota/rate-limit error from any AI provider */
export function isQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /quota|rate.?limit|429|insufficient_quota|too many requests|exceeded|resource.?exhausted/i.test(
    msg
  );
}

/** Parse retry delay from error message for backoff */
export function getRetryAfterSeconds(err: unknown): number {
  const msg = err instanceof Error ? err.message : String(err);
  const match = msg.match(/retry.+?(\d+(?:\.\d+)?)\s*s/i);
  if (match) return Math.ceil(parseFloat(match[1]));
  return 25; // default 25s
}

/**
 * Call an async function that uses the AI model; on quota error, wait and retry up to maxRetries times.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < maxRetries && isQuotaError(err)) {
        const waitSec = getRetryAfterSeconds(err);
        await new Promise((r) => setTimeout(r, waitSec * 1000));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}
