# Feature: Interviews

## Overview

An **interview** is a conversation between the logged-in user and one persona. The user starts an interview from a persona’s detail page; the chat UI streams replies from OpenAI using that persona’s `systemPrompt`. Messages are persisted. The interview can be ended and reviewed; the review page can trigger AI-powered insight extraction.

## Key Files

- `src/app/api/interviews/route.ts` — GET (list), POST (create)
- `src/app/api/interviews/[id]/route.ts` — GET (with messages), PATCH (status/summary/insights)
- `src/app/api/chat/route.ts` — POST, streaming chat
- `src/lib/prompts.ts` — `SUGGESTED_QUESTIONS` for the chat UI
- `src/app/(app)/interviews/page.tsx` — Interview list
- `src/app/(app)/interviews/[id]/page.tsx` — Chat UI
- `src/app/(app)/interviews/[id]/review/page.tsx` — Review and insights

## Interview Lifecycle

1. **Create** — `POST /api/interviews` with `personaId` and optional `title`. Interview is created with `status: "active"`.
2. **Chat** — User sends messages via the chat page. Each request is `POST /api/chat` with `interviewId` and full `messages` array. Server persists the latest user message, streams the assistant reply, then persists the assistant message in `onFinish`.
3. **End / Review** — User can “End interview” (e.g. PATCH status to `"completed"`) and go to the review page. Review page can call `POST /api/insights` to extract summary, pain points, themes, quotes, and store them on the interview.

## Streaming Chat (AI SDK v6)

- **Client:** Uses `useChat` from `@ai-sdk/react` with `DefaultChatTransport` pointing at `/api/chat` and `body: { interviewId }`. Input and send are handled locally (e.g. `useState` for input, `sendMessage({ text })`).
- **Server:** Receives `messages` in **UIMessage** format (items may have `parts` instead of a single `content` string). OpenAI’s `streamText` expects standard `{ role, content }` messages. So the chat route defines:
  - `extractText(msg)` — reads text from `msg.parts` (text parts) or `msg.content`.
  - `toStandardMessages(msgs)` — maps to `{ role: "user" | "assistant", content: string }[]`.
  The route saves the last user message, calls `streamText` with `system: interview.persona.systemPrompt` and `messages: standardMessages`, and returns `result.toUIMessageStreamResponse()`.
- **Persistence:** User message is written before streaming; assistant message is written in `onFinish`. Interview `updatedAt` is updated in `onFinish`.

## Suggested Questions

`SUGGESTED_QUESTIONS` in `src/lib/prompts.ts` is an array of question strings (or categorized questions) shown on the chat page so the user can insert them with one click.
