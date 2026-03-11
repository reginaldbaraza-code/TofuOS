# Feature: Authentication

## Overview

Authentication is handled by **Supabase Auth** (email + password). Sessions are managed by Supabase and stored in cookies via `@supabase/ssr`. Registration and sign-in use the Supabase client in the browser; the proxy (Next.js 16) refreshes the session and redirects unauthenticated users to `/login`.

## Key Files

- `src/lib/supabase/client.ts` — Browser Supabase client
- `src/lib/supabase/server.ts` — Server client and `getSession()` for API routes
- `src/lib/supabase/session.ts` — `useSupabaseSession()` hook for client components
- `src/proxy.ts` — Session refresh and route protection (redirect to `/login` when no user)
- `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx` — Auth UI

## Flow

1. **Registration:** Client calls `supabase.auth.signUp({ email, password, options: { data: { name } } })`. Supabase creates the user; a trigger in the DB creates a `profiles` row with the name.
2. **Sign-in:** User submits email/password on `/login`. Client calls `supabase.auth.signInWithPassword()`. On success, redirect to `/dashboard`.
3. **Session:** All protected API routes call `getSession()` and require `session?.user?.id`. The proxy runs on each request and refreshes the session; if no user and path is not `/login` or `/register`, it redirects to `/login`.
