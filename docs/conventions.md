# Conventions

## File and Folder Structure

- **Routes:** App Router under `src/app/`. Route groups: `(app)` for protected app pages, `(auth)` for login/register. API routes under `src/app/api/`.
- **Lib:** Shared logic, config, and data in `src/lib/` (ai, supabase, prompts, persona-templates). No business logic in page components beyond wiring and local UI state.
- **Components:** Reusable UI in `src/components/`. Use `providers.tsx` for app-wide providers. Subfolders `chat/`, `personas/`, `ui/` are available for feature-specific or generic UI.
- **Types:** Global type extensions in `src/types/`.
- **Database:** SQL migrations in `supabase/migrations/`. Run new migrations in the Supabase Dashboard SQL Editor.

## Code Style

- **TypeScript:** Strict mode. Prefer explicit types for API boundaries and lib functions.
- **Styling:** Tailwind CSS. Theme via CSS variables (e.g. `var(--card)`, `var(--foreground)`) in `src/app/globals.css`; avoid hard-coded colors in components when a variable exists.
- **API routes:** Use Supabase server client for session. Return `NextResponse.json()` with appropriate status. Log and return generic error messages to the client; log full errors server-side.
- **Errors:** Catch in try/catch; respond with 4xx/5xx and a stable `{ error }` shape where applicable.

## API Pattern

1. Check session via Supabase server client; return 401 if no user.
2. Parse body/params (and validate required fields).
3. Optionally load and check ownership (e.g. interview belongs to user via RLS or explicit check).
4. Perform Supabase queries and/or AI calls via `getModel()` from `src/lib/ai.ts`.
5. Return JSON or stream with correct status and headers.

## Documentation Standard (Best Practice)

**After shipping a feature:**

1. **Create or update** the corresponding feature doc under `docs/features/<feature>.md`. Include: what the feature does, key files, main flows, and any gotchas (e.g. UIMessage conversion for chat, uint8array for ZIP).
2. **Update `AGENTS.md`** if the “what to read” order or tiers change (e.g. new required or contextual doc).

Keep `docs/api-reference.md` and `docs/database-schema.md` in sync when you add or change API routes or schema.

## Git / Workflow

- Do not commit `.env` or secrets. `.env` is in `.gitignore`.
- Run `pnpm build` before committing to catch type and build errors.
- After schema changes: write a new SQL migration in `supabase/migrations/`, run it in the Supabase Dashboard SQL Editor, and update `docs/database-schema.md` if the documented schema no longer matches.

## Agent Best Practices

- **Always read `AGENTS.md` first** — Follow the reading tiers (required, contextual, reference) before touching code. Required docs include vision and architecture so you understand why the product exists and how it is built.

- **Always run `pnpm build` after changes** — Never leave the codebase in a broken state. Fix type errors, lint, and failing builds before considering a task done.

- **Design principle: Apple-like UI** — Clean layout, generous whitespace, subtle animations, CSS variable theming. No cluttered screens. When in doubt, less is more. See `docs/vision.md` for design philosophy.

- **Extensibility mindset** — Write code that anticipates future features. Persona creation is modular (templates, manual, AI generate) so new sources (e.g. LinkedIn upload, "PM at [Company]") can be added as further options. Avoid tight coupling and one-off hacks.

- **Quality over speed** — This is a product the team uses and shares. Features should work end-to-end before being considered done. Test the full user flow (e.g. create persona → start interview → chat → export), not just the API.

- **Document after shipping** — After completing any feature, update `docs/features/<feature>.md` and `AGENTS.md` if reading order or dependencies change. See "Documentation Standard" above.

- **Error handling** — Never swallow errors silently. Log full errors server-side; show clear, user-friendly messages client-side. Use stable `{ error }` shapes in API responses.

- **Persona realism** — When adding or changing templates or prompts, ensure depth: specific backstories, real tools and companies, nuanced pain points, distinct communication styles. No generic filler. Personas should feel like real professionals in conversation.
