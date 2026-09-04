# Web Admin Project Rules — Expense App

> Feature-based rules for the Web Admin (React + TypeScript + Tailwind).
> References: `docs/API_SPEC.md` · `IDEA.md` §17.

## Tech Stack
- Framework: React 18 + TypeScript (strict)
- Build tool: Vite
- State: TanStack Query (server) + Zustand (global UI/auth)
- Styling: Tailwind CSS
- HTTP client: Axios
- Router: React Router v6
- Forms/Validation: react-hook-form + zod

## 1. Feature Structure

```
src/
├── app/                          entry point · router · providers
├── shared/                       cross-cutting (2+ features)
│   ├── components/  DataTable · Toast · ConfirmDialog
│   ├── hooks/       useDebounce · usePagination
│   ├── services/    api.ts (axios client)
│   ├── stores/      authStore · uiStore
│   ├── types/       ApiResponse · PageResult
│   └── utils/       formatVnd · formatDate
├── features/
│   ├── auth/        login · profile
│   ├── dashboard/   admin stats cards
│   ├── users/       user management
│   ├── categories/  category management
│   ├── reports/     analytics charts
│   ├── settings/    system settings
│   └── audit/       audit logs
├── assets/
└── styles/
```

Feature list = Web Admin scope in `IDEA.md` §2 (dashboard, user mgmt, category mgmt, reports, system settings, audit logs).

## 2. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Feature folders | `kebab-case` | `features/categories/` |
| Component files | `PascalCase.tsx` | `CategoryTable.tsx` |
| Components | PascalCase | `<CategoryTable />` |
| Hooks | `usePascalCase.ts` | `useCategories.ts` |
| Services | `camelCaseService.ts` | `categoryService.ts` |
| Types / Interfaces | PascalCase | `Category`, `CategoryFormValues` |
| Stores | `camelCaseStore.ts` | `authStore.ts` |
| Utilities | `camelCase.ts` | `formatVnd.ts` |

DTO field names mirror `docs/API_SPEC.md` (camelCase): `transactionDate`, `categoryId`.

## 3. Feature Rules
- Feature must be self-contained — importable only through its `index.ts` barrel.
- No direct imports between features (never `features/dashboard/components/...` inside `features/reports`).
- Cross-feature communication via:
  - Global stores (`authStore`, `uiStore`) — minimal surface
  - Router params / query strings
  - Events (rare; use a small event bus only for decoupled admin actions)
- Shared components/hooks/services location: `src/shared/` — only when 2+ features use them.

## 4. Component Rules
- One component per file.
- Co-locate styles (Tailwind classes), tests (`Component.test.tsx`).
- Props typed via `interface Props`; no `any`.
- Max ~200 lines per component — extract sub-components / hooks beyond that.
- Presentation components are pure; data via hooks (`useCategories`) passed from parent.

## 5. Code Patterns (MUST follow)
- API calls only inside `*Service.ts`; components consume via TanStack Query hooks.
- Server state → React Query cache (stale-while-revalidate); UI state → `useState` local first; global only when shared.
- Error handling: React Error Boundary (route-level) + toast notifications from API error envelope (`error.code` per `docs/API_SPEC.md` §5).
- Loading: skeleton components for tables/cards; spinners for buttons.
- Forms: react-hook-form + zod schema; server errors mapped to field errors.
- Money: amounts arrive as JSON strings (`"35000.00"`, per `docs/API_SPEC.md` §3); format with `formatVnd` and compute with a decimal-safe lib — never `Number()` on money.
- Tables/dashboard: TanStack Table for data grids (sort/pagination), Recharts for reports; filters sync to URL query params.

## 6. Anti-patterns (MUST NOT do)
- ❌ Import another feature's internal files
- ❌ `axios`/`fetch` directly in components — always via service + query hook
- ❌ Business logic in components (validate/compute in hooks or utils)
- ❌ Deep prop drilling (pass >2 levels → context/store or composition)
- ❌ Untyped code — `any` banned (use `unknown` + narrowing)
- ❌ Inline `style={{...}}` unless dynamic animation

## 7. Git Workflow
- Branch: `feature/<name>` · `fix/<name>` · `chore/<name>` (same as backend).
- Commit (Conventional Commits): `feat: add users table`, `fix: show budget overspend warning`.
- PR: description = what/why/how + screenshot of admin screen; ≥1 reviewer; CI green.

## 8. Testing
- Location: co-located `Component.test.tsx`, `service.test.ts` next to source.
- Tools: Vitest + React Testing Library + MSW (mock API per `docs/API_SPEC.md`).
- What to test: services/hooks (API contract), auth guard, dashboard aggregation math, table filter/pagination.
- Coverage focus: API layer + auth + report calculations; UI covered by interaction tests.

## Format
- Concrete examples, DO vs DON'T, real feature names. Max 150 lines.

## Tech-Specific Additions (React / Vite)

### Admin auth guard
- Route wrapper `<RequireAdmin>` checks `authStore.user.role === 'ADMIN'`; unauthenticated → redirect `/login`; non-admin → 403 page. Admin accounts are seeded via backend migration — never self-registered (`docs/DATABASE.md` users).

### Axios client
- Single instance in `shared/services/api.ts`; request interceptor injects `Authorization: Bearer <token>`; response interceptor unwraps `ApiResponse<T>` and throws on `success: false` (→ toasts) or `401` (→ refresh flow via `POST /auth/refresh`, per `docs/API_SPEC.md` §2).

### Dashboard/reports caching
- TanStack Query with `staleTime` on `/analytics/*`; invalidate on transaction changes (admin context: after user/category CRUD).

### Code splitting
- `React.lazy` per route; charts chunk loaded on demand in `reports`.
