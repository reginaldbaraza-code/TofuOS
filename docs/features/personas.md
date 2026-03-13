# Feature: Personas

## Overview

Users create **professional personas** from any industry that can be used in interviews. A persona has profile fields (name, role, company, background, pain points, etc.) and a **systemPrompt** used by the chat API to drive the AI's behavior. Personas can be created in multiple ways: from **templates**, **manually**, via **AI generation**, **deep web research**, **company URL**, or **LinkedIn PDF upload**.

## Key Files

- `src/lib/persona-templates.ts` — `PersonaTemplate` interface, `TEMPLATE_CATEGORIES` constant, and 38 built-in templates across 9 categories
- `src/lib/prompts.ts` — `buildPersonaSystemPrompt()`, `buildPersonaGenerationPrompt()`, `buildQuickPersonaPrompt()`
- `src/app/api/personas/route.ts` — GET (list), POST (create)
- `src/app/api/personas/[id]/route.ts` — GET, PUT, DELETE
- `src/app/api/generate-persona/route.ts` — POST, returns generated persona JSON
- `src/app/api/deep-research/route.ts` — POST, Tavily-powered deep web research for persona generation
- `src/app/api/personas/import-from-resume/route.ts` — POST, LinkedIn PDF to persona
- `src/app/(app)/personas/page.tsx` — Persona list
- `src/app/(app)/personas/new/page.tsx` — New persona (tabs: Templates, Manual, AI Generate, Deep Search)
- `src/app/(app)/personas/[id]/page.tsx` — Persona detail and "Start interview"

## Template Categories

Templates are organized into 9 categories via the `category` field on `PersonaTemplate` and the `TEMPLATE_CATEGORIES` constant:

| Category | Count | Examples |
|----------|-------|---------|
| Product Management | 21 | SaaS PM, Growth PM, Enterprise PM |
| Healthcare | 6 | Midwife, ER Nurse, GP, PCOS Patient |
| Engineering | 2 | Frontend Dev, Data Scientist |
| Design | 1 | UX Designer |
| Marketing | 1 | Growth Marketing Manager |
| Finance | 1 | Financial Controller |
| Education | 1 | Teacher |
| Government | 3 | Immigration Caseworker, Digital Services Director |
| Consumer | 2 | Community Manager, Personal Trainer |

**Total: 38 templates.**

## Creation Modes

1. **Templates (default tab)** — User picks one of 38 pre-defined personas (filterable by category) and clicks "Add". Client sends the template object to `POST /api/personas`. Server builds `systemPrompt` via `buildPersonaSystemPrompt` if not provided.
2. **Quick Prompt** — User types a one-liner (e.g. "ER nurse at Charite Berlin"). Client calls `POST /api/generate-persona` with `quickPrompt`; server uses `buildQuickPersonaPrompt`, calls AI, parses JSON, returns it. Client then saves via `POST /api/personas`.
3. **Manual** — User fills the full form; submit sends the form state to `POST /api/personas`. Server builds `systemPrompt` from the payload.
4. **AI Generate** — User fills role, company, industry, etc. Client calls `POST /api/generate-persona` with that payload; server uses `buildPersonaGenerationPrompt`, calls AI, parses JSON. Client then saves.
5. **Deep Search** — User enters a role description or company URL. Client calls `POST /api/deep-research` which uses Tavily to gather web data, then AI to synthesize a persona from real-world context.
6. **LinkedIn PDF** — User uploads a LinkedIn PDF. Client calls `POST /api/personas/import-from-resume` which extracts text and generates a persona from the resume content.

## System Prompt

`buildPersonaSystemPrompt(persona)` in `src/lib/prompts.ts` builds the string used as the system prompt for the interview chat. It includes identity, background, tools, pain points (to be revealed naturally), communication style, personality, and behavioral guidelines. If the client sends `systemPrompt` (e.g. from a template that precomputes it), the server uses it as-is; otherwise it always builds from the other fields.

## CRUD

- **List:** `GET /api/personas` — all personas for the current user, with `interviews` count.
- **Create:** `POST /api/personas` — body contains persona fields; `user_id` set from session.
- **Read:** `GET /api/personas/[id]` — single persona with recent interviews and count.
- **Update:** `PUT /api/personas/[id]` — partial update; `systemPrompt` is recomputed from merged data.
- **Delete:** `DELETE /api/personas/[id]` — cascade deletes interviews and messages.
