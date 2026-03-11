# Feature: Authentication

## Overview

Authentication is handled by **NextAuth 5 (beta)** with a credentials provider (email + password). Sessions are JWT-based and stored in signed cookies. Registration is a separate API that creates a user; the client then signs in via NextAuth.

## Key Files

- `src/lib/auth.ts` — NextAuth config, credentials provider, JWT/session callbacks
- `src/middleware.ts` — Route protection via cookie check (no `auth()` import)
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth route handler (uses `handlers` from auth)
- `src/app/api/register/route.ts` — User registration (POST)
- `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx` — Auth UI

## Flow

1. **Registration:** Client POSTs `{ name, email, password }` to `/api/register`. Server hashes password (bcrypt, 12 rounds), creates `User`, returns `{ id, name, email }`. Client then redirects to login or triggers sign-in.
2. **Sign-in:** User submits email/password on `/login`. NextAuth credentials provider runs: lookup user by email, `compare()` password with `hashedPassword`, return user object. JWT callback stores `user.id` in token; session callback exposes `session.user.id`.
3. **Session:** Cookie name is `authjs.session-token` (dev) or `__Secure-authjs.session-token` (HTTPS). All protected API routes call `auth()` to get session and require `session?.user?.id`.

## Middleware Constraint (Edge Runtime)

Middleware runs in the Edge Runtime. It **must not** import `auth()` from `src/lib/auth`, because that file imports Prisma, which is Node-only. So middleware does **not** verify the JWT contents; it only checks for the presence of the session cookie. Logic:

- If path is `/api/auth/*` → allow.
- If path is `/login` or `/register` and cookie exists → redirect to `/dashboard`.
- If path is `/login` or `/register` and no cookie → allow.
- If path is not auth and no cookie → redirect to `/login`.
- Otherwise → allow.

Protected API routes still call `auth()` and return 401 when there is no valid session.

## Type Extension

`src/types/next-auth.d.ts` extends the session user type to include `id: string` so that `session.user.id` is available after the session callback.
