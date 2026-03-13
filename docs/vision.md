# Product Vision

## Mission

Conduct **realistic synthetic interviews** with professional personas at scale to deeply understand their pain points, workflows, and frustrations — across any industry. The tool enables teams to run many such interviews quickly, export and analyze the data, and use those insights to inform product decisions.

## Context: Why This Exists

Tofu started as an internal PM-research tool ("PM-Synthetic") focused on understanding Product Managers. As we validated the approach, we discovered the same method — synthetic interviews with realistic personas — applies to **any industry**: healthcare, immigration, education, finance, and more.

The platform pivoted from PM-only to **industry-agnostic** to serve external customers. First three customers:
- **Hebammen-App** — midwives, expecting mothers, clinical researchers
- **Perioden-App** — PCOS patients, athletes, teens
- **Ausländer-Bürokratie-App** — immigration caseworkers, Blue Card holders, digital services directors

## Target Users

- **Internal team members** conducting research across industries.
- **External customers** (B2B) who need synthetic interviews with personas relevant to their domain. Customers receive a curated persona library and can run interviews and studies independently.

## Design Philosophy

- **Apple-like**: Clean, minimal, generous whitespace. Subtle animations and transitions. The tool should feel **premium** even though it's a research tool.
- **Quality over quantity**: Fewer, well-executed features over a crowded UI. Every flow should feel intentional.
- **Frictionless**: From picking a template to being in a conversation should be as few steps as possible. One click from template to interview is the bar.
- **Research-question-first**: The home screen should ask "What do you want to learn?" — not show a passive dashboard. The tool should guide users toward insights, not just enable interviews.

## Product Principles

1. **Personas must feel like real humans** — Deep backstories, specific tools and companies, nuanced pain points, distinct communication styles and personalities. No generic filler. The AI should stay in character and reveal pain points naturally through conversation, not lists.

2. **Interviews should be frictionless** — Template → Add → Start interview → Chat. Suggested questions, clear end/review flow, and export so nothing is lost.

3. **Insights must be exportable and analyzable at scale** — Single and bulk export (Markdown, JSON, CSV, ZIP). The output should support further analysis and synthesis across many interviews.

4. **Everything must be extensible** — The codebase should anticipate new ways to create or enrich personas (LinkedIn upload, deep web research, company URL, data-driven generation). Avoid one-off hacks; keep persona creation and interview flows modular.

5. **Provider-agnostic AI** — The platform should work with any major AI provider (OpenAI, Google Gemini, Anthropic Claude). Switching providers is a configuration change, not a code change.

## Future Roadmap Ideas (Context, Not Commitment)

- **Organizations + Multi-Tenancy** — Teams, roles, shared persona libraries, org-level insights.
- **Data-driven personas** — Generate personas from real survey data, app reviews, forum posts, and research papers.
- **Study system** — Panels, surveys, focus groups, and bias detection on top of interviews.
- **Cross-interview insight synthesis** — Aggregate pain points and themes across many interviews for reports or strategy docs.
- **Interview guides / scripts** — Optional question sets or flows for specific research goals.

These are direction signals for design and architecture, not a fixed backlog. When adding features, prefer options that align with the mission and principles above.
