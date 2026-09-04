# Mobile App Project Rules — Expense App

> Feature-based rules for the Mobile app (React Native + Expo + TypeScript) — **primary product**.
> References: `docs/API_SPEC.md` · `IDEA.md` §6.6 (offline).

## Tech Stack
- Framework: React Native (Expo SDK) + TypeScript (strict)
- Navigation: expo-router (file-based)
- State: TanStack Query (server) + Zustand (global/auth)
- Styling: NativeWind (Tailwind for RN)
- HTTP client: Axios
- Local storage: expo-sqlite (offline queue + local cache) · AsyncStorage (tokens/settings)
- Testing: Jest + React Native Testing Library

## 1. Feature Structure

```
src/
├── app/                          expo-router file routes (thin, re-export feature screens)
├── shared/                       cross-cutting (2+ features)
│   ├── components/  Button · MoneyInput · CategoryPicker · EmptyState
│   ├── hooks/       useSyncStatus · useDebounce
│   ├── services/    api.ts · syncEngine.ts
│   ├── stores/      authStore · uiStore
│   ├── types/       ApiResponse · PageResult
│   └── utils/       formatVnd · formatDate · uuid
├── features/
│   ├── auth/        login · register · profile
│   ├── dashboard/   balance · income · expense · budget ring
│   ├── transaction/ add · history · duplicate · AI parse (v0.3)
│   ├── category/    list · custom category
│   ├── budget/      list · set · warn/overspend
│   ├── analytics/   monthly · category distribution
│   ├── account/     wallet (model in MVP, UI hidden)
│   └── settings/
├── db/                            local SQLite schema + queue tables
├── assets/
└── styles/
```

Feature list = Mobile scope in `IDEA.md` §2 (dashboard, add transaction, history, budget, analytics, categories, profile, settings).

## 2. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Feature folders | `kebab-case` | `features/transaction/` |
| Screens | `PascalCaseScreen.tsx` | `TransactionNewScreen.tsx` |
| Components | `PascalCase.tsx` | `MoneyInput.tsx` |
| Hooks | `usePascalCase.ts` | `useTransactions.ts` |
| Services | `camelCaseService.ts` | `transactionService.ts` |
| Types / Interfaces | PascalCase | `Transaction`, `SyncStatus` |
| Stores | `camelCaseStore.ts` | `authStore.ts` |
| Utilities | `camelCase.ts` | `formatVnd.ts` |

DTO fields mirror `docs/API_SPEC.md` (camelCase). **Client generates UUID ids** (matches `BINARY(16)` UUID PK in `docs/DATABASE.md`) — required for offline writes.

## 3. Feature Rules
- Feature self-contained; importable only through its `index.ts` barrel.
- No direct imports between features (never `features/budget/...` inside `features/transaction`).
- Cross-feature communication via:
  - Global stores (`authStore`, `uiStore`) — minimal surface
  - Navigation params (expo-router)
  - Events (rare — sync status broadcast)
- Shared components/hooks/services location: `src/shared/` — only when 2+ features use them.

## 4. Component Rules
- One component per file; co-locate NativeWind styles + tests.
- Props typed via `interface Props`; no `any`.
- Max ~200 lines — extract sub-components/hooks beyond that.
- Presentation components are pure; data via hooks.

## 5. Code Patterns (MUST follow)
- **Offline-first write (core):** user action → service writes to **local queue (SQLite)** immediately → `syncEngine` pushes to API when online. Never block the UI on network.
- API calls only in `*Service.ts`; components consume via TanStack Query hooks.
- Server state → React Query cache; UI state → `useState` local first; global only when shared.
- Sync strategy: **single-direction** (user creates → server), client UUID idempotency, retry with backoff. No 2-way conflict resolution in MVP (`IDEA.md` §6.6).
- Error handling: ErrorBoundary + toasts; show "pending sync" badge for unsynced items.
- Loading: skeletons/spinners; optimistic updates for transaction create.
- Forms: controlled components (or react-hook-form); validation mirrors `docs/API_SPEC.md` error codes.
- Money: amounts are JSON strings (`"35000.00"`, per `docs/API_SPEC.md` §3); format via `formatVnd`, compute with a decimal-safe lib — never `Number()` on money.

## 6. Anti-patterns (MUST NOT do)
- ❌ Import another feature's internal files
- ❌ API calls directly in components (bypasses offline queue)
- ❌ Business logic in components
- ❌ Deep prop drilling (>2 levels)
- ❌ Untyped code — `any` banned
- ❌ **Blocking UI on network** (blocking spinner when offline) — kills the core "ghi tiền nhanh" value
- ❌ Generating server-style auto-increment ids client-side (breaks UUID sync)

## 7. Git Workflow
- Branch: `feature/<name>` · `fix/<name>` · `chore/<name>`.
- Commit (Conventional Commits): `feat: add offline transaction queue`, `fix: sync retry backoff`.
- PR: description = what/why/how + screenshot from simulator/device; ≥1 reviewer; CI green (type-check + tests).

## 8. Testing
- Location: co-located `Component.test.tsx`, `service.test.ts`.
- Tools: Jest + React Native Testing Library + MSW.
- What to test: **sync engine** (queue → API → mark synced; failure → retry), transaction create path, hooks, auth guard.
- Coverage focus: sync engine + transaction flow (100% critical paths); UI via interaction tests.

## Format
- Concrete examples, DO vs DON'T, real feature names. Max 150 lines.

## Tech-Specific Additions (React Native / Expo)

### Offline queue + sync engine
```
write → SQLite queue (uuid, payload, status, retries) → [online] → POST /api/v1/transactions
                                                     → success: mark synced + invalidate cache
                                                     → failure: keep, retry w/ exponential backoff
```
- Queue table mirrors pending fields of `transactions` in `docs/DATABASE.md`.
- `syncEngine` triggers on app start + connectivity change (`@react-native-community/netinfo`).

### Platform folders
- Native modules in `ios/` / `android/` (expo prebuild) — business code stays platform-agnostic in `src/`.

### Push notifications (v0.2)
- Expo Notifications + `/notifications/stream` (SSE) — budget warnings (`IDEA.md` §4.2).

### AI input (v0.3)
- `transaction` feature includes AI-parse flow: natural language → `POST /api/v1/transactions/parse` → confirm screen → create.
