# PM Interviews — Synthetic Product Manager Research

Conduct realistic synthetic interviews with AI-powered Product Manager personas. Built to help teams discover PM pain points, workflows, and insights at scale.

## Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-actual-key-here
NEXTAUTH_SECRET=change-me-to-a-random-secret
```

### 3. Set up database

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and start interviewing.

## Features

- **21 pre-built PM personas** covering startup, enterprise, growth, platform, healthtech, gaming, automotive, cybersecurity, EdTech, fintech, GovTech, AgriTech, and many more archetypes
- **AI persona generation** — describe the PM type you want and GPT-4o creates a complete persona
- **Manual persona builder** — full control over every detail
- **Streaming chat** — real-time, iMessage-style interview interface
- **Suggested interview questions** — organized by category (discovery, pain points, tools, deeper exploration)
- **AI-powered insights** — automatic extraction of pain points, themes, key quotes after each interview
- **Export** — single or bulk export in Markdown, JSON, or CSV formats with ZIP packaging

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + SQLite (local) / Turso libSQL (production)
- NextAuth.js (credentials)
- Vercel AI SDK + OpenAI GPT-4o
