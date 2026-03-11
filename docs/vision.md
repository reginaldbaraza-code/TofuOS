# Product Vision

## Mission

Conduct **realistic synthetic interviews** with Product Manager personas at scale to deeply understand their pain points, workflows, and frustrations. The tool exists so the team can run many such interviews quickly, export and analyze the data, and use those insights to inform product decisions — especially in the direction of a "Cursor for product management."

## Context: Why This Exists

The broader opportunity (e.g. YC's "Cursor for Product Managers") is about helping teams **figure out what to build**, not just how to build it. Before building that product, we need to **understand PMs**: how they work, where they struggle, what they need. PM-Synthetic is the **research and discovery layer** — synthetic interviews on scale with realistic PM personas so we can learn their world first, then build the right thing.

## Target Users

- **Internal team members** conducting PM research. Not public-facing; the app is built for speed, clarity, and shareability within the team (e.g. via ngrok link).

## Design Philosophy

- **Apple-like**: Clean, minimal, generous whitespace. Subtle animations and transitions. The tool should feel **premium** even though it's internal.
- **Quality over quantity**: Fewer, well-executed features over a crowded UI. Every flow should feel intentional.
- **Frictionless**: From picking a template to being in a conversation should be as few steps as possible. One click from template to interview is the bar.

## Product Principles

1. **Personas must feel like real humans** — Deep backstories, specific tools and companies, nuanced pain points, distinct communication styles and personalities. No generic filler. The AI should stay in character and reveal pain points naturally through conversation, not lists.

2. **Interviews should be frictionless** — Template → Add → Start interview → Chat. Suggested questions, clear end/review flow, and export so nothing is lost.

3. **Insights must be exportable and analyzable at scale** — Single and bulk export (Markdown, JSON, CSV, ZIP). The output should support further analysis and synthesis across many interviews.

4. **Everything must be extensible** — The codebase should anticipate new ways to create or enrich personas (e.g. LinkedIn profile upload, "PM at [Company]" quick-create). Avoid one-off hacks; keep persona creation and interview flows modular.

## Future Roadmap Ideas (Context, Not Commitment)

- **LinkedIn profile upload** — Parse a profile (or paste) to seed or generate a persona.
- **"PM at [Company]" quick-create** — Shortcut: e.g. "PM at Mercedes" → generate a plausible PM persona for that context.
- **Cross-interview insight synthesis** — Aggregate pain points and themes across many interviews (e.g. for reports or strategy docs).
- **Interview guides / scripts** — Optional question sets or flows for specific research goals.
- **Team collaboration** — Shared personas, shared interview libraries, or team-level export/insights (if the team grows and needs it).

These are direction signals for design and architecture, not a fixed backlog. When adding features, prefer options that align with the mission and principles above.
