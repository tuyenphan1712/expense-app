# Web Admin: expense-app

## Tech Stack
- React 18/19 + Vite
- TypeScript (strict)
- TanStack Query (server state)
- Zustand (global UI/auth state)
- Tailwind CSS
- Axios
- React Router v6
- React Hook Form + Zod

## Documentation

### Must Read
- @docs/WEB-PROJECT-RULES.md - Conventions, patterns, MUST/MUST NOT
- @docs/WEB-ARCHITECTURE.md - Folder structure, components, state

### Reference
- @../01-share-docs/API_SPEC.md - API contract to consume
- @../01-share-docs/DATABASE.md - Schema understanding for client-side data modeling

## Quick Reference

### Feature Location
`src/features/[name]/` - each feature owns its own pages, components, hooks, services, types, and optional `CONTEXT.md`. Features: `auth`, `dashboard`, `users`, `categories`, `reports`, `settings`, `audit`.

### Public Exports
Always via the feature `index.ts` barrel export.

### API
- Base path: `/api/v1`
- IDs: UUID
- Request fields: camelCase
- Database fields: snake_case
- Money: amounts arrive as JSON strings (`"35000.00"`) — format with `formatVnd`, compute with a decimal-safe lib, never `Number()`

### Error Code Prefix
`[FEATURE]_[NUMBER]` - e.g., `AUTH_1001`, `ACCOUNT_1001`, `CATEGORY_1001`, `TRANSACTION_1001`, `BUDGET_1001`, `ADMIN_1001` — full list in `../01-share-docs/API_SPEC.md` §5.

### Common Rules
- Keep business logic out of components — validate/compute in hooks or utils.
- API calls should live in feature services (`*Service.ts`); never `axios`/`fetch` directly in components.
- Use TanStack Query for server state and Zustand only for light global state (`authStore`, `uiStore`).
- Admin routes are guarded by `<RequireAdmin>` (checks `authStore.user.role === 'ADMIN'`) — server still re-checks via `@PreAuthorize`, the frontend guard is UX only.
- Admin accounts are seeded via backend migration — never self-registered.
- Never trust a client-supplied `userId` for ownership logic; the backend decides authorization.
- No `any` — use `unknown` + narrowing.
- Never log passwords, tokens, or API payload contents containing secrets.
