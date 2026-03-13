# Vercel environment variables

Set these in your Vercel project: **Settings → Environment Variables**. Apply to **Production** (and Preview if you want the same for PR previews).

---

## Required

| Variable | Description | Where to get it |
|----------|-------------|------------------|
| **`NEXT_PUBLIC_SUPABASE_URL`** | Supabase project URL | Supabase Dashboard → Project Settings → API → Project URL |
| **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** | Supabase anon/public key | Supabase Dashboard → Project Settings → API → anon public |
| **AI provider key** | At least one: `OPENAI_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, or `ANTHROPIC_API_KEY` | Provider dashboard |

---

## Optional

| Variable | Description |
|----------|-------------|
| **`AI_PROVIDER`** | `openai` (default), `google`, or `anthropic` |
| **`AI_MODEL`** | Override default model (e.g. `gpt-4o`, `gemini-2.5-flash`, `claude-sonnet-4-5-20250514`) |
| **`TAVILY_API_KEY`** | For deep research persona generation |

---

## After first deploy

In **Supabase → Authentication → URL Configuration**, set **Site URL** to your Vercel URL (e.g. `https://your-app.vercel.app`) so auth redirects work.

---

## Summary

- **Auth & DB:** Supabase (Postgres + Auth).
- **AI:** Vercel AI SDK with multi-provider support (OpenAI, Google Gemini, Anthropic Claude); configured via `AI_PROVIDER` env var.
- **Build:** `pnpm build` (Next.js only).
