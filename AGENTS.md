# Agent Handover — PM-Synthetic

You are working on **PM-Synthetic**: an internal web app for conducting synthetic interviews with AI-powered Product Manager personas. Users create PM personas (from templates, manually, or via AI), start interviews with them, chat in real time (streaming), and export conversations for insights. For full product context — mission, YC background, design philosophy, and principles — read **docs/vision.md** first.

---

## What to Read

### Required (read first, every time)

1. **docs/vision.md** — Product mission, YC context, design philosophy (Apple-like), product principles, future roadmap.
2. **docs/architecture.md** — Tech stack, request flow, directory structure, key decisions.
3. **docs/conventions.md** — Code style, file structure, **agent best practices**, and the rule: **after shipping a feature, document it** in `docs/features/<feature>.md` and update this file if reading order changes.
4. **docs/setup.md** — Prerequisites, env vars, database (local SQLite + Turso), run/build, ngrok, GitHub, Vercel deployment.

### Read when relevant (only for the area you’re changing)

- **docs/features/authentication.md** — Login, register, session, middleware.
- **docs/features/personas.md** — Persona CRUD, 21 templates, AI generation, system prompts.
- **docs/features/interviews.md** — Interview lifecycle, streaming chat, message persistence, review.
- **docs/features/export.md** — Single/bulk export, formats, ZIP.
- **docs/features/insights.md** — AI insight extraction on interview review.

### Reference on demand

- **docs/api-reference.md** — All API endpoints, methods, auth, request/response.
- **docs/database-schema.md** — Prisma models, relations, migrations.

---

## Quick Commands

| Command | Purpose |
|--------|--------|
| `pnpm install` | Install dependencies |
| `pnpm prisma generate` | Generate Prisma client (after schema change) |
| `pnpm prisma migrate dev` | Apply migrations (dev); use `migrate deploy` for prod |
| `pnpm dev` | Start dev server (default port 3000) |
| `pnpm build` | Production build |
| `vercel --prod` | Deploy to Vercel (after `vercel login` and env vars in dashboard) |

---

## Known Issues / Tech Debt

- Next.js may warn about workspace root (multiple lockfiles); optional fix: set `turbopack.root` in next.config or remove extra lockfile.
- Production uses Turso (libSQL); Prisma CLI uses `LOCAL_DATABASE_URL` or `DATABASE_URL` for migrations. Apply migration SQL to Turso manually; see docs/setup.md.
- Middleware uses cookie-based auth check (not `auth()`) so it stays Edge-compatible; see docs/features/authentication.md.
- Chat API converts client `UIMessage` (with `parts`) to standard `{ role, content }` for OpenAI; see docs/features/interviews.md.
- Export uses `uint8array` for ZIP (not `nodebuffer`) for Edge compatibility.

---

## After You Ship a Feature

1. Add or update **docs/features/<feature>.md** with behavior, key files, and gotchas.
2. If the “what to read” order for the next agent changes, update the sections above in this file.
