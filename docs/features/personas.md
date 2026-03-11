# Feature: Personas

## Overview

Users create **PM personas** that can be used in interviews. A persona has profile fields (name, role, company, background, pain points, etc.) and a **systemPrompt** used by the chat API to drive the AI’s behavior. Personas can be created in three ways: from **templates**, **manually**, or via **AI generation**.

## Key Files

- `src/lib/persona-templates.ts` — `PersonaTemplate` interface and 21 built-in templates
- `src/lib/prompts.ts` — `buildPersonaSystemPrompt()`, `buildPersonaGenerationPrompt()`
- `src/app/api/personas/route.ts` — GET (list), POST (create)
- `src/app/api/personas/[id]/route.ts` — GET, PUT, DELETE
- `src/app/api/generate-persona/route.ts` — POST, returns generated persona JSON
- `src/app/(app)/personas/page.tsx` — Persona list
- `src/app/(app)/personas/new/page.tsx` — New persona (tabs: Templates, Manual, AI Generate)
- `src/app/(app)/personas/[id]/page.tsx` — Persona detail and “Start interview”

## Creation Modes

1. **Templates (default tab)** — User picks one of 21 pre-defined personas and clicks “Add”. Client sends the template object (with all fields) to `POST /api/personas`. Server builds `systemPrompt` via `buildPersonaSystemPrompt` if not provided (templates don’t send `systemPrompt`).
2. **Manual** — User fills the form; submit sends the form state to `POST /api/personas`. Server builds `systemPrompt` from the payload.
3. **AI Generate** — User fills role, company, industry, etc. (optional). Client calls `POST /api/generate-persona` with that payload; server uses `buildPersonaGenerationPrompt`, calls OpenAI, parses first JSON from the response, returns it. Client then sends that object to `POST /api/personas` to save.

## System Prompt

`buildPersonaSystemPrompt(persona)` in `src/lib/prompts.ts` builds the string used as the system prompt for the interview chat. It includes identity, background, tools, pain points (to be revealed naturally), communication style, personality, and behavioral guidelines. If the client sends `systemPrompt` (e.g. from a template that precomputes it), the server uses it as-is; otherwise it always builds from the other fields.

## Tab Order

On the new-persona page, the tab order is **Templates → Manual → AI Generate**, and the default selected tab is **Templates**.

## CRUD

- **List:** `GET /api/personas` — all personas for the current user, with `_count.interviews`.
- **Create:** `POST /api/personas` — body contains persona fields; `userId` set from session.
- **Read:** `GET /api/personas/[id]` — single persona with recent interviews and count.
- **Update:** `PUT /api/personas/[id]` — partial update; `systemPrompt` is recomputed from merged data.
- **Delete:** `DELETE /api/personas/[id]` — cascade deletes interviews and messages.
