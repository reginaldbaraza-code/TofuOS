# tofuOS — Restrategy, Functionality & Vercel Deployment Guide

This document is the single source of truth for **restrategizing the project**, **verifying functionality**, and **deploying to Vercel**. It is written for senior developers, project managers, and anyone responsible for deployment.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Pre-Flight Checklist](#2-pre-flight-checklist)
3. [Restrategy Steps](#3-restrategy-steps)
4. [Functionality Verification](#4-functionality-verification)
5. [Vercel Deployment Guidelines](#5-vercel-deployment-guidelines)
6. [Updates & Improvements](#6-updates--improvements)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Executive Summary

| Item | Detail |
|------|--------|
| **Stack** | Next.js 15 (App Router), React 18, TypeScript, Supabase (auth + Postgres), Google Gemini (AI), Jira Cloud API |
| **Deploy target** | Vercel (frontend + serverless API routes) |
| **Critical constraints** | React 18.x required (Next.js 15 CJS resolution); no secrets in repo; env vars in Vercel and Supabase |
| **Out of scope on Vercel** | Standalone Express server in `server/` — not deployed; use Next.js API routes or deploy `server/` elsewhere |

---

## 2. Pre-Flight Checklist

Before restrategizing or deploying, confirm:

- [ ] **Node.js** 18.x or 20.x (Vercel default; check with `node -v`).
- [ ] **Git** repo is clean or changes are committed; branch for deployment (e.g. `main`) is known.
- [ ] **Vercel** project is linked to the correct GitHub repo and branch.
- [ ] **Supabase** project exists; you have the project URL and anon key (Settings → API).
- [ ] **Secrets** are never committed; `.env` and `.env.local` are in `.gitignore` (they are).
- [ ] **package.json** uses React 18.x (`"react": "^18.3.1"`, `"react-dom": "^18.3.1"`); no React 19 if you see `Cannot find module './cjs/react.production.js'`.
- [ ] **next.config.mjs** has `eslint: { ignoreDuringBuilds: true }` and `typescript: { ignoreBuildErrors: true }` if you need builds to succeed before fixing all lint/type errors.

---

## 3. Restrategy Steps

### 3.1 Codebase & Dependencies

- [ ] **Audit dependencies**  
  Run `npm audit` and address critical/high issues. Use `npm audit fix` where safe; avoid `--force` unless you accept breaking changes.
- [ ] **Lockfile**  
  Commit `package-lock.json` so Vercel and all environments resolve the same versions.
- [ ] **Remove unused code**  
  Delete or archive unused features, dead API routes, and obsolete env references.
- [ ] **Single source of truth for API**  
  Decide: either Next.js API routes only (Vercel), or a separate backend (e.g. `server/` on Railway). Update frontend to call one base URL (e.g. same origin on Vercel, or `NEXT_PUBLIC_API_URL` for an external API).
- [ ] **React version**  
  Keep React at 18.x for Next.js 15 compatibility until Next.js officially supports React 19 without CJS issues.

### 3.2 Environment & Secrets

- [ ] **Document every env var**  
  List in README and in this guide: `NEXT_PUBLIC_*`, `OPENAI_API_KEY`, `GOOGLE_GEMINI_API_KEY`, Supabase vars, etc.
- [ ] **Create `.env.example`**  
  List variable names with placeholder values and short comments. Add to repo; keep `.env` and `.env.local` out of repo.
- [ ] **Vercel env vars**  
  Map each required variable to Vercel Project → Settings → Environment Variables (Production, Preview, Development as needed).
- [ ] **Supabase redirect URLs**  
  Add production and preview URLs (e.g. `https://your-app.vercel.app`, `https://*.vercel.app`) in Supabase → Authentication → URL Configuration.

### 3.3 Build & Quality Gates

- [ ] **Local build**  
  Run `npm run build` from repo root. Fix any hard failures (missing modules, syntax errors).
- [ ] **ESLint**  
  Either fix rules that fail the build or keep `eslint.ignoreDuringBuilds: true` until they are fixed. Prefer fixing over ignoring long-term.
- [ ] **TypeScript**  
  Either fix type errors or keep `typescript.ignoreBuildErrors: true` temporarily. Plan to remove once types are clean.
- [ ] **vercel.json**  
  Keep minimal: `framework`, `buildCommand`, `installCommand` if you need to override defaults. Avoid conflicting with Next.js defaults.

### 3.4 Auth & Data

- [ ] **Supabase tables**  
  Ensure `sources` and `jira_configs` (or equivalent) exist and RLS policies match the app’s expectations.
- [ ] **Auth flow**  
  Test sign-in and sign-out locally and on a preview URL; confirm redirects and session behavior.
- [ ] **API routes**  
  Ensure `/api/analyze`, `/api/chat`, `/api/jira/create-issue` (and any others) use the same auth and env vars as in production.

---

## 4. Functionality Verification

### 4.1 Local Verification

| Step | Action | Expected result |
|------|--------|------------------|
| 1 | `npm install` | No fatal errors; lockfile present. |
| 2 | Create `.env.local` with required vars (see README) | File exists; not committed. |
| 3 | `npm run build` | Build completes; no `MODULE_NOT_FOUND` or unhandled rejections. |
| 4 | `npm run dev` | App runs at http://localhost:3000. |
| 5 | Open app → Sign in (Supabase) | Login succeeds; redirect to main app. |
| 6 | Add a source (e.g. document or review URL) | Source appears and is persisted (Supabase). |
| 7 | Run “Analyze sources” (or equivalent) | AI insights return (Gemini/OpenAI configured). |
| 8 | Create Jira ticket from an insight | Jira issue is created; config stored in Supabase. |
| 9 | Sign out and sign back in | Session and data persist as expected. |

### 4.2 Post-Deploy Verification (Vercel)

- [ ] Production URL loads (no 500 or blank page).
- [ ] Sign in / sign out works; redirect URLs are in Supabase.
- [ ] Sources load and save (Supabase connection and RLS).
- [ ] AI analysis runs (env var for Gemini/OpenAI set in Vercel).
- [ ] Jira creation works (env or user-stored config).
- [ ] No console errors or failed network requests for critical flows.

---

## 5. Vercel Deployment Guidelines

### 5.1 Project Configuration

- **Framework:** Next.js (auto-detected when `next.config.mjs` or `next.config.js` exists).
- **Build Command:** `npm run build` (or set in vercel.json).
- **Output:** Next.js uses `.next`; do not set a custom output directory unless you have a static export.
- **Install Command:** `npm install` (default).
- **Root Directory:** Repo root (where `package.json` and `next.config.mjs` live).

### 5.2 Environment Variables (Vercel Dashboard)

Set these under **Project → Settings → Environment Variables** for the appropriate environments (Production / Preview / Development):

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key. |
| `OPENAI_API_KEY` | If using OpenAI | Server-side; not prefixed with `NEXT_PUBLIC_`. |
| `GOOGLE_GEMINI_API_KEY` | If using Gemini | Server-side. |

Add any other keys your API routes or server code expect. **Never commit real values.**

### 5.3 Deployment Steps

1. **Push to the deployment branch** (e.g. `main`). Vercel will trigger a build.
2. **Confirm build** in Vercel dashboard: Build log completes without errors.
3. **Set env vars** if not already set; redeploy if you added or changed them.
4. **Supabase:** Add the production (and optionally preview) site URL to Authentication → URL Configuration → Redirect URLs.
5. **Smoke-test** production: auth, sources, AI, Jira.

### 5.4 Common Vercel Issues

| Issue | Cause | Action |
|-------|--------|--------|
| `Cannot find module './cjs/react.production.js'` | React 19 + Next.js 15 CJS resolution | Pin React to 18.x in `package.json`; remove overrides forcing React 19. |
| Build fails on ESLint | Strict ESLint in CI | Set `eslint.ignoreDuringBuilds: true` in next.config or fix lint errors. |
| Build fails on TypeScript | Strict TS in CI | Set `typescript.ignoreBuildErrors: true` temporarily or fix types. |
| 500 on API routes | Missing or wrong env vars | Check Vercel env; ensure API routes read the same vars as local. |
| Auth redirect fails | Redirect URL not allowlisted | Add exact Vercel URL (and wildcard preview if needed) in Supabase. |
| “Invalid API key” (AI) | Key not set or wrong env name | Ensure key is set in Vercel for the environment that runs the route. |

---

## 6. Updates & Improvements

### 6.1 Short-Term (Pre/Post Deploy)

- **Remove or document `server/`**  
  If the app uses only Next.js API routes, either remove the Express server or document that it is optional (e.g. for local or a separate deployment).
- **Harden env handling**  
  Validate required env at startup or first use; return clear errors in development and safe fallbacks or 503 in production.
- **Fix lint and types**  
  Plan a sprint to address ESLint and TypeScript errors and then turn `ignoreDuringBuilds` and `ignoreBuildErrors` off.
- **README and .env.example**  
  Keep README aligned with actual setup; maintain `.env.example` with all required variables.

### 6.2 Medium-Term

- **Monitoring**  
  Add error tracking (e.g. Vercel Analytics, Sentry) and basic health checks for API routes.
- **Tests**  
  Add smoke or integration tests for auth, key API routes, and critical UI flows; run in CI or pre-deploy.
- **Security**  
  Review Supabase RLS and API route auth; ensure no secrets in client bundles; rotate keys if ever exposed.
- **Performance**  
  Use Next.js caching and image optimization where applicable; profile slow API routes and optimize or cache.

### 6.3 Long-Term

- **React 19**  
  When Next.js supports React 19 without CJS issues, upgrade and re-run full regression.
- **Unified backend**  
  If keeping a separate backend, consider migrating remaining logic into Next.js API routes or a single backend service for simpler ops.
- **Docs**  
  Keep this guide and the README in sync with any new env vars, deployment steps, or architecture changes.

---

## 7. Troubleshooting

### Build

- **`npm run build` fails locally**  
  Run `npm ci` and `npm run build` again. If it still fails, check the error (module not found, lint, type) and apply the corresponding fix from section 5.4.
- **Vercel build differs from local**  
  Ensure `package-lock.json` is committed and Vercel is not using a different Node version (set in Project Settings or `engines` in package.json if needed).

### Runtime

- **Blank page or 500**  
  Check browser console and Vercel Function logs; verify env vars and Supabase URL/keys.
- **Auth not working**  
  Confirm redirect URLs in Supabase and that `NEXT_PUBLIC_SUPABASE_*` are set in Vercel for the correct environment.
- **AI or Jira failing**  
  Confirm the corresponding API key or config is available to the running API route (server-side env or user-stored config in DB).

### Data

- **Sources or config not persisting**  
  Check Supabase tables and RLS; ensure the authenticated user matches the row’s `user_id` (or equivalent).
- **CORS or network errors**  
  Ensure the frontend calls the same origin on Vercel (no mixed origins unless CORS is explicitly configured).

---

*Last updated for Next.js 15, React 18, and Vercel deployment. Adjust version numbers and links as the stack evolves.*
