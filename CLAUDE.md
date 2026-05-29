# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**笔锋 (Bifeng)** — AI-powered writing improvement system for high school Chinese and English essays. Students get instant AI feedback on writing, personalized training, and iterative revision workflows.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + custom design tokens (Airtable-inspired theme)
- **Database**: SQLite via Prisma ORM
- **AI**: Anthropic Claude API (supports OpenAI-compatible providers via `AI_PROVIDER` env var)
- **Language**: TypeScript

## Development Commands

```bash
# Development server (port 3004 — ports 3000-3003 are reserved)
npm run dev

# Build
npm run build

# Database
npx prisma generate
npx prisma db push
npx prisma db seed
npx prisma studio
```

## Architecture

### App Routes (src/app/)

- `(main)/` — Student-facing pages (route group, no layout change)
  - `page.tsx` — Landing/home
  - `grade-select/` — Grade selection
  - `diagnostic/[subject]/` — Diagnostic assessment
  - `training/[subject]/[level]/` — Training sessions
  - `result/` — Review results
  - `history/[subject]/` — Training history
  - `model-essays/` — Model essay browser
  - `materials/` — Student materials
  - `errors/` — Error archive
  - `thinking/` — Thinking exercises
- `admin/` — Admin panel (separate layout)
  - `dashboard/`, `topics/`, `users/`, `materials/`, `essays/`, `essay-types/`, `material-types/`

### API Routes (src/app/api/)

- `ai/` — AI endpoints: review, compare, assistant, essay-analysis, argument-chain, multi-angle, genre-check, simulation-review
- `training/` — Training records, sprint mode
- `materials/` — CRUD + collect, search, categories, usage tracking
- `admin/` — Admin CRUD for topics, users, materials, essays, categories
- `progress/` — Progress updates, weekly reports
- `topics/` — Topic management + AI generation

### Key Libraries (src/lib/)

- `ai/client.ts` — AI provider abstraction (Anthropic or OpenAI-compatible via `AI_PROVIDER` env)
- `ai/prompts/` — Prompt templates for Chinese/English essay review, assistant
- `training/` — Training config, rubrics, diagnostics, scoring, error cases, genre validation, sprint mode
- `db.ts` — Prisma client singleton
- `model-essays.ts` — Model essay data
- `topics.ts` — Topic definitions
- `achievements.ts` — Achievement system
- `stage.ts` — Student stage progression

### Component Organization (src/components/)

- `training/` — Training UI: timers, progress cards, radar charts, error archives, weekly/monthly reports
- `editor/` — Paragraph editor, sentence rewrite, L2 paragraph cards
- `ai/` — Assistant chat interface
- `views/` — View components for model essays, error cases
- `theme/` — Theme provider and toggle (light/dark)
- `ui/` — Shared UI components (Card)

### Data Model (Prisma)

Key entities: `User`, `Topic`, `TrainingRecord`, `Assessment`, `AbilityProfile`, `Material`, `Achievement`, `WeakPoint`, `ErrorRecord`, `ReviewSchedule`, `EssayAnalysis`, `SampleEssay`

Users have roles (`admin`/`student`), stages (`sprout`/`growing`/`thriving`), and track Chinese/English levels separately.

### Scripts (scripts/)

Python scripts for essay data processing: `fetch-essays.py`, `process-essays.py`, `build-essay-data.py`, `generate_english_essays.py`. TypeScript migration: `migrate-essays.ts`.

## Key Patterns

- CSS is inlined at build time via `readFileSync` in `src/app/layout.tsx` (not standard Next.js CSS import)
- AI provider is selected at runtime via `AI_PROVIDER` env var (`anthropic` or `mimo`)
- Database uses SQLite (`prisma/dev.db`) — no external DB needed for development
- Admin panel is a separate route group with its own layout
- JSON fields stored as strings in SQLite (e.g., `tags`, `feedback`, `dimensionScores`)
