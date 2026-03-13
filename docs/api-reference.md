# API Reference

All routes under `/api` (except `/api/auth/*` and `/api/register`) require an authenticated session. Unauthenticated requests receive `401 Unauthorized`. Session is established via Supabase Auth; see `docs/features/authentication.md`.

---

## Auth

### Auth

Auth is handled by Supabase Auth (email/password). See `src/lib/supabase/` for client and server helpers.

---

## Registration

### `POST /api/register`

**Auth:** None (public).

**Body:** `{ name: string, email: string, password: string }`

**Validation:** `name`, `email`, `password` required; password length ≥ 6. Email must be unique.

**Responses:**

- `201`: `{ id, name, email }` (user created; client must then sign in via Supabase Auth).
- `400`: `{ error }` — validation or "An account with this email already exists".
- `500`: `{ error }` — server error.

---

## Personas

### `GET /api/personas`

**Auth:** Required.

**Responses:**

- `200`: Array of personas for the current user (newest first), each with `_count: { interviews }`.
- `401`: Unauthorized.

### `POST /api/personas`

**Auth:** Required.

**Body:** Persona fields. At minimum: `name`, `role`. Optional: `avatarEmoji`, `age`, `company`, `companySize`, `industry`, `experienceYears`, `background`, `toolsUsed`, `painPoints`, `communicationStyle`, `personality`, `systemPrompt`. If `systemPrompt` is omitted, it is built from other fields via `buildPersonaSystemPrompt`.

**Responses:**

- `201`: Created persona object.
- `401`: Unauthorized.
- `500`: `{ error }` — e.g. validation, DB, or prompt build failure.

### `GET /api/personas/[id]`

**Auth:** Required. Persona must belong to current user.

**Responses:**

- `200`: Persona with nested `interviews` (last 10) and `_count.interviews`.
- `401`: Unauthorized.
- `404`: Persona not found.

### `PUT /api/personas/[id]`

**Auth:** Required. Persona must belong to current user.

**Body:** Partial persona fields. `systemPrompt` is recomputed from merged existing + body via `buildPersonaSystemPrompt`.

**Responses:**

- `200`: Updated persona.
- `401`: Unauthorized.
- `404`: Persona not found.

### `DELETE /api/personas/[id]`

**Auth:** Required. Persona must belong to current user.

**Responses:**

- `200`: `{ success: true }`.
- `401`: Unauthorized.
- `404`: Persona not found.

---

## Interviews

### `GET /api/interviews`

**Auth:** Required.

**Responses:**

- `200`: Array of interviews for the current user (most recently updated first), with `persona` (selected fields) and `_count.messages`.
- `401`: Unauthorized.

### `POST /api/interviews`

**Auth:** Required.

**Body:** `{ personaId: string, title?: string }`. If `title` is omitted, defaults to `Interview with <persona.name>`.

**Responses:**

- `201`: Created interview with `persona`.
- `400`: `{ error: "Persona ID is required" }`.
- `401`: Unauthorized.
- `404`: Persona not found.
- `500`: `{ error }`.

### `GET /api/interviews/[id]`

**Auth:** Required. Interview must belong to current user.

**Responses:**

- `200`: Interview with `persona` and `messages` (ordered by `createdAt`).
- `401`: Unauthorized.
- `404`: Interview not found.

### `PATCH /api/interviews/[id]`

**Auth:** Required. Interview must belong to current user.

**Body:** `{ status?, summary?, insights? }` (all optional).

**Responses:**

- `200`: Updated interview.
- `401`: Unauthorized.
- `404`: Interview not found.

---

## Chat (streaming)

### `POST /api/chat`

**Auth:** Required.

**Body:** `{ interviewId: string, messages: UIMessage[] }`. `messages` are in AI SDK UIMessage form (may have `parts`). Server converts them to `{ role, content }` for the AI provider.

**Behavior:** Loads interview (and persona) for current user; persists the last user message; streams assistant reply via AI provider using `persona.systemPrompt`; persists assistant message in `onFinish`; updates interview `updatedAt`.

**Responses:**

- `200`: Streaming response (UIMessage stream).
- `401`: Unauthorized.
- `404`: Interview not found.

---

## Insights

### `POST /api/insights`

**Auth:** Required.

**Body:** `{ interviewId: string }`.

**Behavior:** Loads interview and messages for current user; builds transcript; calls AI provider to extract JSON (summary, painPoints, themes, keyQuotes, recommendations); updates interview with `status: "completed"`, `summary`, and stringified `insights`; returns parsed insights object.

**Responses:**

- `200`: Insights object (summary, painPoints, themes, keyQuotes, recommendations).
- `401`: Unauthorized.
- `404`: Interview not found.
- `500`: `{ error }` — e.g. parse or API failure.

---

## Export

### `POST /api/export`

**Auth:** Required.

**Body:** `{ interviewIds: string[], format?: "md" | "json" | "csv" }`. `interviewIds` must have at least one id. All must belong to current user.

**Behavior:**

- Single interview + `format` "md" or "json": returns that interview as Markdown download or JSON response.
- Single interview + "csv" or multiple ids + "csv": returns one CSV with all selected interviews.
- Multiple ids + "md" or "json": returns a ZIP containing one file per interview (`.md` or `.json`) plus `summary.json`.

**Responses:**

- `200`: Body is either JSON, plain text (md/csv), or binary ZIP. Appropriate `Content-Type` and `Content-Disposition` headers set.
- `400`: `{ error: "No interviews selected" }`.
- `401`: Unauthorized.
- `500`: `{ error: "Failed to export" }`.

---

## Generate Persona (AI)

### `POST /api/generate-persona`

**Auth:** Required.

**Body:** `{ role?, company?, companySize?, industry?, experienceYears?, additionalContext? }`. Used to build the generation prompt; all optional.

**Behavior:** Builds prompt via `buildPersonaGenerationPrompt`; calls AI provider; parses first JSON object from response; returns it. Client typically then sends this object to `POST /api/personas` to save.

**Responses:**

- `200`: Generated persona object (name, avatarEmoji, age, role, company, etc.).
- `401`: Unauthorized.
- `500`: `{ error }` — e.g. "Failed to parse generated persona" or API error.
