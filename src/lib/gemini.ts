/**
 * Call a Gemini API function with retry on 429 (rate limit).
 * Retries once after a delay, then returns a user-friendly error.
 */
const RATE_LIMIT_RETRY_DELAY_MS = 30_000; // 30 seconds
const MAX_RETRIES = 1;

function isRateLimitError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("429") ||
    message.includes("Too Many Requests") ||
    message.includes("quota") ||
    message.includes("Quota exceeded")
  );
}

export async function withGeminiRetry<T>(
  fn: () => Promise<T>
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (isRateLimitError(error) && attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RATE_LIMIT_RETRY_DELAY_MS));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export const QUOTA_EXCEEDED_MESSAGE =
  "Gemini API rate limit or quota exceeded. " +
  "Wait a few minutes or check your plan and billing at https://ai.google.dev/gemini-api/docs/rate-limits. " +
  "Free tier has limited requests per minute and per day.";
