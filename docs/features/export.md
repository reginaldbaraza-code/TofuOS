# Feature: Export

## Overview

Users can export one or more interviews for analysis. Supported formats: **Markdown**, **JSON**, and **CSV**. For multiple interviews, the API can return a **ZIP** containing one file per interview (md or json) plus a `summary.json`.

## Key Files

- `src/app/api/export/route.ts` — Single and bulk export logic

## API

**POST /api/export**

- **Body:** `{ interviewIds: string[], format?: "md" | "json" | "csv" }`. All `interviewIds` must belong to the current user.
- **Single interview + format md:** Response is Markdown with `Content-Disposition: attachment; filename="...md"`.
- **Single interview + format json:** Response is JSON (interview + transcript + insights).
- **Single interview + format csv**, or **multiple interviews + format csv:** Response is one CSV with one row per interview; headers include Interview ID, Title, Persona, Role, Company, Industry, Date, Status, Messages count, Summary, Pain Points, Themes.
- **Multiple interviews + format md or json:** Response is a ZIP. ZIP contains:
  - One file per interview: `{title_sanitized}.md` or `{title_sanitized}.json`
  - `summary.json`: `{ exportDate, totalInterviews, interviews: [...] }`.

## Implementation Notes

- **ZIP generation:** Use `zip.generateAsync({ type: "uint8array" })`. Do **not** use `nodebuffer`; the response is built with `new Response(zipBuffer as unknown as BodyInit, ...)` for Edge/browser compatibility.
- Helpers in the route: `interviewToMarkdown`, `interviewToJson`, `interviewsToCsv`. Insights are read from `interview.insights` (JSON string); if present, they are parsed and included in Markdown/JSON and in CSV columns (pain points, themes).
