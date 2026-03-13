# Tofu

**Synthetic research platform.** Create AI-powered professional personas from any industry, run realistic interviews in a chat interface, and extract pain points, themes, and insights into a reusable knowledge base.

---

## What it does

- **Personas** — Create personas from 38 built-in templates (across 9 industry categories), a quick prompt ("ER nurse at Charite Berlin", "midwife running her own practice"), a detailed form, deep web research, company URL, or LinkedIn PDF upload. Optional AI generation from role, company, and industry.
- **Interviews** — Chat with a persona in real time. Use suggested questions or your own. Streaming responses with a clear transcript.
- **Insights** — After an interview, run AI analysis to get a summary, pain points, themes, key quotes, and follow-up ideas.
- **Knowledge base** — Insights page shows recurring themes and top pain points across all completed interviews. Filter and bulk-export.
- **Export** — Single or bulk export in Markdown, JSON, or CSV (ZIP for bulk).

---

## Tech stack

| Layer        | Tech |
|-------------|------|
| Framework   | Next.js 16 (App Router), React 19 |
| Language    | TypeScript |
| Styling     | Tailwind CSS 4, design tokens (CSS variables) |
| Auth & DB   | Supabase (Auth + Postgres) |
| AI          | Vercel AI SDK + multi-provider (OpenAI, Google Gemini, Anthropic Claude) |
| UI          | Lucide React, Framer Motion |
| Deploy      | Vercel (or any Node 20+ host) |

---

## Prerequisites

- **Node.js** 20+
- **pnpm** (or npm/yarn)
- **Supabase** account — [supabase.com](https://supabase.com)
- **AI provider API key** — at least one of:
  - OpenAI — [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
  - Google Gemini — [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
  - Anthropic Claude — [console.anthropic.com](https://console.anthropic.com)

---

## Run locally

### 1. Clone and install

```bash
git clone https://github.com/your-org/TofuOS.git
cd TofuOS
pnpm install
```

### 2. Environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Supabase (Project Settings → API in dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI Provider: "openai" | "google" | "anthropic" (default: openai)
AI_PROVIDER=openai

# Provider API keys (only the active provider needs a key)
OPENAI_API_KEY=sk-...
# GOOGLE_GENERATIVE_AI_API_KEY=...
# ANTHROPIC_API_KEY=...

# Optional: override model (provider-specific)
# AI_MODEL=gpt-4o-mini          # OpenAI default
# AI_MODEL=gemini-2.5-flash     # Google default
# AI_MODEL=claude-sonnet-4-5-20250514  # Anthropic default

# Tavily (for Deep Research + Company URL persona generation)
TAVILY_API_KEY=your_tavily_key
```

### 3. Database (Supabase)

In the [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor**, run the migration:

- Open `supabase/migrations/001_initial.sql`
- Copy its contents into the SQL Editor and run it

This creates `profiles`, `personas`, `interviews`, `messages` and RLS policies.

### 4. Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up or log in, then create a persona and start an interview.

---

## Switching AI providers

The app supports three AI providers via the `AI_PROVIDER` environment variable. To switch:

1. Set `AI_PROVIDER` to `openai`, `google`, or `anthropic`
2. Ensure the corresponding API key is set
3. Optionally override the model with `AI_MODEL`

No code changes needed — just update env vars and restart.

---

## Scripts

| Command        | Description        |
|----------------|--------------------|
| `pnpm dev`     | Start dev server   |
| `pnpm build`   | Production build   |
| `pnpm start`   | Run production app |
| `pnpm lint`    | Run ESLint         |

---

## Deployment (Vercel)

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. In **Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `AI_PROVIDER` (optional, defaults to `openai`)
   - `OPENAI_API_KEY` (or the key for your chosen provider)
   - `TAVILY_API_KEY` (optional, for deep research)
   - `AI_MODEL` (optional, to override default model)
3. Deploy. The app uses the same Supabase project; no extra DB setup if you already ran the migration.

**Auth redirects:** In Supabase → **Authentication → URL Configuration**, set **Site URL** and **Redirect URLs** to your production URL (e.g. `https://your-app.vercel.app`) so sign-in and email confirmation work.

---

## Project structure

```
src/
├── app/
│   ├── (app)/          # Authenticated app (dashboard, personas, interviews, insights)
│   ├── (auth)/         # Login, register
│   └── api/            # API routes (chat, personas, interviews, insights, export, deep-research)
├── components/
│   └── ui/             # Shared UI (Card, Button, PageHeader, etc.)
├── lib/
│   ├── ai.ts           # AI provider abstraction (OpenAI/Gemini/Claude) + retry helpers
│   ├── prompts.ts      # Persona system + generation prompts
│   ├── persona-templates.ts  # 38 templates across 9 categories
│   └── supabase/       # Supabase client, server, session
├── types/
└── ...
supabase/
└── migrations/         # SQL to run in Supabase (e.g. 001_initial.sql)
```

---

## License

Private / unlicensed unless otherwise specified.
