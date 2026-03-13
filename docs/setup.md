# Setup

## Prerequisites

- **Node.js** 20+
- **pnpm** (or npm/yarn)
- **Supabase** account — [supabase.com](https://supabase.com)
- At least one AI provider API key (OpenAI, Google Gemini, or Anthropic Claude)

## Quick Start

```bash
git clone https://github.com/your-org/TofuOS.git
cd TofuOS
pnpm install
cp .env.example .env.local
# Fill in .env.local with your values
pnpm dev
```

## Environment Variables

See `.env.example` for all variables. Key ones:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `AI_PROVIDER` | No | `openai` (default), `google`, or `anthropic` |
| `OPENAI_API_KEY` | If using OpenAI | OpenAI API key |
| `GOOGLE_GENERATIVE_AI_API_KEY` | If using Gemini | Google AI API key |
| `ANTHROPIC_API_KEY` | If using Claude | Anthropic API key |
| `AI_MODEL` | No | Override default model per provider |
| `TAVILY_API_KEY` | No | For deep research persona generation |

## Database (Supabase)

1. Create a Supabase project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor** and run `supabase/migrations/001_initial.sql`
3. This creates `profiles`, `personas`, `interviews`, `messages` tables with RLS policies

## Deployment (Vercel)

1. Push to GitHub → Import in [Vercel](https://vercel.com)
2. Add env vars in **Settings → Environment Variables**
3. Deploy

**Auth redirects:** In Supabase → **Authentication → URL Configuration**, set **Site URL** and **Redirect URLs** to your production URL.

For Vercel-specific env var details, see **[vercel-env-vars.md](vercel-env-vars.md)**.
