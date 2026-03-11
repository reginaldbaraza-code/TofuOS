# Tofu

**Synthetic Product Manager research.** Create AI-powered PM personas, run realistic interviews in a chat interface, and extract pain points, themes, and insights into a reusable knowledge base.

---

## What it does

- **Personas** — Create PM personas from templates, a quick prompt (“PM at Mercedes”, “Series A startup PM in devtools”), or a detailed form. Optional AI generation from role, company, and industry.
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
| AI          | Vercel AI SDK + Google Gemini (`@ai-sdk/google`) |
| UI          | Lucide React, Framer Motion |
| Deploy      | Vercel (or any Node 20+ host) |

---

## Prerequisites

- **Node.js** 20+
- **pnpm** (or npm/yarn)
- **Supabase** account — [supabase.com](https://supabase.com)
- **Google AI** API key (Gemini) — [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

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

# Gemini (get key at https://aistudio.google.com/app/apikey)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Optional: override model (default: gemini-2.5-flash)
# GEMINI_MODEL=gemini-2.0-flash
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
   - `GOOGLE_GENERATIVE_AI_API_KEY` (or `GEMINI_API_KEY`)
   - Optional: `GEMINI_MODEL` (e.g. `gemini-2.0-flash` if you hit quota or “model not found” with the default).
3. Deploy. The app uses the same Supabase project; no extra DB setup if you already ran the migration.

**Auth redirects:** In Supabase → **Authentication → URL Configuration**, set **Site URL** and **Redirect URLs** to your production URL (e.g. `https://your-app.vercel.app`) so sign-in and email confirmation work.

---

## Gemini free tier

The app defaults to **gemini-2.5-flash**. If you see:

- **“Model not found”** — Set `GEMINI_MODEL=gemini-2.0-flash` in Vercel (or `.env.local`).
- **“Quota exceeded”** — Free tier has rate limits. The app retries persona generation and insights; for chat, wait a minute and try again.

---

## Project structure

```
src/
├── app/
│   ├── (app)/          # Authenticated app (dashboard, personas, interviews, insights)
│   ├── (auth)/         # Login, register
│   └── api/            # API routes (chat, personas, interviews, insights, export)
├── components/
│   └── ui/             # Shared UI (Card, Button, PageHeader, etc.)
├── lib/
│   ├── gemini.ts       # Model + retry helpers
│   ├── prompts.ts      # Persona system + generation prompts
│   └── supabase/       # Supabase client, server, session
├── types/
└── ...
supabase/
└── migrations/         # SQL to run in Supabase (e.g. 001_initial.sql)
```

---

## License

Private / unlicensed unless otherwise specified.
