# Agent Handover — TofuOS

You are working on **TofuOS (Tofu)**: a synthetic research platform for conducting AI-powered interviews with professional personas from any industry. Users create personas (from templates, manually, via AI, deep web research, company URL, or LinkedIn PDF), start interviews, chat in real time (streaming), and export conversations for insights. For full product context — mission, design philosophy, and principles — read **docs/vision.md** first.

---

## What to Read

### Required (read first, every time)

1. **docs/vision.md** — Product mission, pivot context, design philosophy (Apple-like), product principles, future roadmap.
2. **docs/architecture.md** — Tech stack, request flow, directory structure, key decisions.
3. **docs/conventions.md** — Code style, file structure, **agent best practices**, and the rule: **after shipping a feature, document it** in `docs/features/<feature>.md` and update this file if reading order changes.

### Read when relevant (only for the area you're changing)

- **docs/features/authentication.md** — Login, register, session, middleware.
- **docs/features/personas.md** — Persona CRUD, 38 templates (9 categories), AI generation, deep search, system prompts.
- **docs/features/interviews.md** — Interview lifecycle, streaming chat, message persistence, review.
- **docs/features/export.md** — Single/bulk export, formats, ZIP.
- **docs/features/insights.md** — AI insight extraction on interview review.

### Reference on demand

- **docs/api-reference.md** — All API endpoints, methods, auth, request/response.
- **docs/database-schema.md** — Supabase tables, relations, RLS policies.

---

## Quick Commands

| Command | Purpose |
|--------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server (default port 3000) |
| `pnpm build` | Production build |
| `vercel --prod` | Deploy to Vercel (after `vercel login` and env vars in dashboard) |

For database changes: write a new SQL migration in `supabase/migrations/`, then run it in the Supabase Dashboard SQL Editor.

---

## Known Issues / Tech Debt

- Next.js may warn about workspace root (multiple lockfiles); optional fix: set `turbopack.root` in next.config or remove extra lockfile.
- Middleware uses cookie-based auth check (not server-side session call) so it stays Edge-compatible; see docs/features/authentication.md.
- Chat API converts client `UIMessage` (with `parts`) to standard `{ role, content }` for the AI provider; see docs/features/interviews.md.
- Export uses `uint8array` for ZIP (not `nodebuffer`) for Edge compatibility.
- AI provider is configured via `AI_PROVIDER` env var (openai/google/anthropic); see `src/lib/ai.ts`.

---

## After You Ship a Feature

1. Add or update **docs/features/<feature>.md** with behavior, key files, and gotchas.
2. If the "what to read" order for the next agent changes, update the sections above in this file.
