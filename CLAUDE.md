# Project: expense-app

## Overview
A personal expense tracking app — accounts/wallets, categories, transactions, budgets, and analytics/dashboard — with a web admin surface.

## Tech Stack
  - Frontend: React + Vite + TypeScript
  - Mobile: Expo + React Native + TypeScript
  - Backend: Spring Boot + Java + Gradle
  - Database: MySQL (+ Redis for refresh tokens / analytics cache)

## Structure
```
├── 03-web-reactjs/     → @03-web-reactjs/CLAUDE.md
├── 02-backend-java/     → @02-backend-java/CLAUDE.md
├── 04-mobile-expo/      → @04-mobile-expo/CLAUDE.md
├── 01-share-docs/       → Shared documentation
├── .claude/              → Local AI configuration
└── .git/                 → Git metadata
```

## Shared Docs
- @01-share-docs/API_SPEC.md
- @01-share-docs/DATABASE.md

## Per-App Docs
- Backend: @02-backend-java/docs/BE-ARCHITECTURE.md · @02-backend-java/docs/BE-PROJECT-RULES.md
- Web: @03-web-reactjs/docs/WEB-ARCHITECTURE.md · @03-web-reactjs/docs/WEB-PROJECT-RULES.md
- Mobile: @04-mobile-expo/docs/MOBILE-ARCHITECTURE.md · @04-mobile-expo/docs/MOBILE-PROJECT-RULES.md

## Available Skills

Skills are scoped per app — each lives in that app's own `.claude/skills/`, not in the root `.claude/`. Claude Code auto-picks the scoped version when working inside that app's folder.

### Project Setup
- `/init-base [backend|frontend|mobile]` - Setup project architecture & environment (root-level skill, applies to all three apps)
- `/explain [code|concept|flow|why] [target] [be|fe|mobile]` - Beginner-friendly explanation of code, concepts, data flow, or design decisions, sourced from the docs — not a raw source-code dump (root-level skill)

### Git
- `/commit` - Preview + confirm a Conventional Commits message (auto-detects type/scope from the staged diff). Author is always the user's own git identity — never adds AI co-authorship.
- `/resolve-conflict [file-path]` - Read conflicted files, propose a resolution plan per pattern (keep-both / ask-user / etc.), confirm, then stage — never commits automatically.

### Feature Development

| Skill | App | Generates |
|---|---|---|
| `/be-crud [feature]` | Backend | Spring Boot entity, controller, service, repository, DTOs, mapper, exception, Flyway migration |
| `/be-test [feature]` | Backend | JUnit 5 unit tests, MockMvc controller tests, Testcontainers integration tests |
| `/fe-crud [feature]` | Frontend | React pages, components, hooks, services, types |
| `/fe-test [feature]` | Frontend | Vitest + React Testing Library component/hook/page tests |
| `/mobile-crud [feature]` | Mobile | Expo Router routes, screens, components, hooks, services, types |
| `/mobile-test [feature]` | Mobile | Jest + React Native Testing Library component/hook/screen tests |
| `/seed-data [entity] [count]` | Backend | Fake/seed rows via a `@Profile("seed")` Spring runner + `net.datafaker` — `users`, `accounts`, `categories`, `transactions` only, never `budgets` version history or `refresh_tokens` |

### Skill Routing

When user asks to:
- "tạo feature", "add entity", "generate crud" → ask (or infer from context) which app, then use `/be-crud`, `/fe-crud`, or `/mobile-crud`
- "viết test", "add tests" → use `/be-test`, `/fe-test`, or `/mobile-test` matching the app of the feature just created/edited
- "init project", "setup structure" → use `/init-base`
- "fake data", "seed", "tạo dữ liệu mẫu" → use `/seed-data` (backend only — frontend/mobile consume seeded data through the real API, they don't seed the DB directly)

### Important
- Always read the skill's required docs BEFORE generating code.
- Follow existing patterns in the codebase — read at least one existing feature (e.g. Transaction or Budget) in the same app first.
- Do NOT create feature code when running `/init-base`.
- Any endpoint, DB field, or error code introduced while running a `*-crud` skill must also update `01-share-docs/API_SPEC.md` / `DATABASE.md` — these are the source of truth shared by all three apps.
- Money fields are `DECIMAL(14,2)` server-side and JSON **strings** over the wire (e.g. `"amount": "35000.00"`) — never emit or parse them as JS `Number`.
- `transactions.id` is client-generated (offline-first, idempotent upsert); most other entities use server-generated UUIDs — see `01-share-docs/DATABASE.md` §4.

## Brainstorming / Planning Doc Location
When using the `superpowers:brainstorming` or `superpowers:writing-plans` skills, save the spec/plan inside the docs of the app the work belongs to, not at the repo root:
- Frontend work → `03-web-reactjs/docs/superpowers/specs/` and `03-web-reactjs/docs/superpowers/plans/`
- Backend work → `02-backend-java/docs/superpowers/specs/` and `02-backend-java/docs/superpowers/plans/`
- Mobile work → `04-mobile-expo/docs/superpowers/specs/` and `04-mobile-expo/docs/superpowers/plans/`
- Work spanning multiple apps (rare) → keep at repo root `docs/superpowers/specs/` / `docs/superpowers/plans/`

This overrides the skills' own default (`docs/superpowers/...` at repo root) whenever the work is scoped to one app.
