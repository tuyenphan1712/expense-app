# Mobile: expense-app

## Tech Stack
- React Native + Expo
- TypeScript (strict)
- Expo Router (file-based)
- TanStack Query (server state)
- Zustand (global/auth state)
- NativeWind (Tailwind for RN)
- Axios
- Local storage: expo-sqlite (offline queue + local cache) · AsyncStorage (tokens/settings)
- Testing: Jest + React Native Testing Library

## Documentation

### Must Read
- @docs/MOBILE-PROJECT-RULES.md - Conventions, patterns, MUST/MUST NOT
- @docs/MOBILE-ARCHITECTURE.md - Folder structure, navigation, app architecture

### Reference
- @../01-share-docs/API_SPEC.md - API contract to consume
- @../01-share-docs/DATABASE.md - Schema understanding for mobile data modeling

## Quick Reference

### Feature Location
`src/features/[name]/` - each feature owns screens, hooks, services, types, and optional `CONTEXT.md`. Features: `auth`, `dashboard`, `transaction` (core), `category`, `budget`, `analytics`, `account`, `settings`.

### App Routing
`app/` is for Expo Router pages; keep route files lightweight and push business logic into `src/features`.

### API
- Base path: `/api/v1`
- IDs: UUID — **client generates the id for `transactions`** (required for offline writes; server upserts idempotently)
- Request fields: camelCase
- Money: amounts are JSON strings (`"35000.00"`) — format via `formatVnd`, compute with a decimal-safe lib, never `Number()`

### Error Code Prefix
`[FEATURE]_[NUMBER]` - e.g., `AUTH_1001`, `ACCOUNT_1001`, `CATEGORY_1001`, `TRANSACTION_1001`, `BUDGET_1001` — full list in `../01-share-docs/API_SPEC.md` §5.

### Common Rules
- **Offline-first write is the core flow:** user action → write to local SQLite queue immediately → `syncEngine` pushes to the API when online. Never block the UI on network.
- Keep screens thin and compose logic from hooks/services; API calls only in `*Service.ts` (bypassing the service breaks the offline queue).
- Use TanStack Query for API state and Zustand only for light session/app-lock state.
- Sync is single-direction (client → server) with client-generated UUID idempotency and retry/backoff — no 2-way conflict resolution in MVP.
- Never generate server-style auto-increment ids client-side — breaks UUID sync.
- Do not use browser cookies or `localStorage` for authentication on mobile.
- Do not store plaintext secrets or document content unencrypted in AsyncStorage.
- Authentication and ownership decisions must remain server-side.
