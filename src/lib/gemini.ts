/**
 * Shared Gemini model and retry helpers.
 * Free tier: use GEMINI_MODEL=gemini-1.5-flash (or gemini-2.5-flash) if you hit quota on gemini-2.0-flash.
 */
import { google } from "@ai-sdk/google";

const DEFAULT_MODEL = "gemini-1.5-flash";

export function getGeminiModel() {
  return google(process.env.GEMINI_MODEL || DEFAULT_MODEL);
}

/** Check if an error is a quota/rate-limit error from Gemini */
export function isQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    /quota|rate limit|RESOURCE_EXHAUSTED|429|exceeded your current quota/i.test(msg) ||
    /generativelanguage\.googleapis\.com/i.test(msg)
  );
}

/** Parse "Please retry in X.XXs" from error message for backoff */
export function getRetryAfterSeconds(err: unknown): number {
  const msg = err instanceof Error ? err.message : String(err);
  const match = msg.match(/retry in (\d+(?:\.\d+)?)\s*s/i);
  if (match) return Math.ceil(parseFloat(match[1]));
  return 25; // default 25s
}

/**
 * Call an async function that uses Gemini; on quota error, wait and retry up to maxRetries times.
 */
export async function withGeminiRetry<T>(
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
