/**
 * Shared AI model and retry helpers.
 * Uses OpenAI via Vercel AI SDK. Set OPENAI_MODEL to override the default model.
 */
import { openai } from "@ai-sdk/openai";

const DEFAULT_MODEL = "gpt-4o-mini";

export function getModel() {
  return openai(process.env.OPENAI_MODEL || DEFAULT_MODEL);
}

/** Check if an error is a quota/rate-limit error from OpenAI */
export function isQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /quota|rate.?limit|429|insufficient_quota|too many requests|exceeded/i.test(
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
