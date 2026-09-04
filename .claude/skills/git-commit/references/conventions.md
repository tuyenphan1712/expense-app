# Commit Conventions

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

| Type | When to use | Example changes |
|------|-------------|-----------------|
| `feat` | New feature | Add endpoint, new component, new entity |
| `fix` | Bug fix | Fix crash, correct logic, handle edge case |
| `refactor` | Code restructure (no behavior change) | Rename, extract function, reorganize |
| `docs` | Documentation | README, comments, CONTEXT.md |
| `style` | Formatting (no code change) | Prettier, eslint fixes, whitespace |
| `test` | Add/update tests | spec files, e2e tests |
| `chore` | Maintenance | Dependencies, configs, scripts |
| `perf` | Performance | Optimize query, reduce bundle |
| `ci` | CI/CD | GitHub Actions, Docker |
| `build` | Build system | Webpack, tsconfig |
| `revert` | Revert commit | Undo previous commit |

## Auto-detect Type

| Changed files/content | Detected type |
|-----------------------|---------------|
| `*Test.java`, `*IT.java`, `*.test.ts`, `*.test.tsx`, `__tests__/*` only | `test` |
| `README.md`, `CONTEXT.md`, `*Context.md`, `01-share-docs/*.md`, `docs/*.md` only | `docs` |
| `build.gradle`, `package.json`, `tsconfig*.json`, `.oxlintrc*`, `eslint.config.*`, `app.json`, `.env.example` only | `chore` |
| `.github/workflows/*` | `ci` |
| `Dockerfile`, `docker-compose.yml` | `build` |
| `src/main/resources/db/migration/V*.sql` only | `feat` (a schema change almost always ships with the feature that needs it — see "Migrations" note below) |
| New files + new public exports (new controller/service/entity, new component/hook) | `feat` |
| Fix in existing logic, error handling, validation | `fix` |
| Rename, move files, extract method, no behavior change | `refactor` |

> This project's own `*-PROJECT-RULES.md` docs (§Git Workflow, all three apps) only call out `feat`/`fix`/`refactor`/`test`/`docs` explicitly. The extra types here (`chore`/`ci`/`build`/`revert`/`perf`/`style`) are a superset for infra-only changes that don't fit those five — use them, but never invent a type outside this table.

## Scope Detection

`auth`, `account`, `category`, `transaction`, `budget`, `analytics`, and `admin` all exist as **separate features in backend + mobile** (web admin has its own feature set: `users`, `categories`, `reports`, `settings`, `audit`, plus `auth`/`admin`) — a bare `(auth)` scope would be ambiguous. Prefix the scope with the app:

| File path | Scope |
|-----------|-------|
| `02-backend-java/.../feature/{name}/*` | `be-{name}` (e.g. `be-transaction`, `be-auth`) |
| `03-web-reactjs/src/features/{name}/*` | `web-{name}` (e.g. `web-reports`) |
| `04-mobile-expo/src/features/{name}/*` | `mobile-{name}` (e.g. `mobile-transaction`) |
| `02-backend-java/src/main/java/.../shared/*` or `.../config/*` | `be-shared` |
| `03-web-reactjs/src/shared/*` or `src/app/*` | `web-shared` |
| `04-mobile-expo/src/shared/*` or `app/*` | `mobile-shared` |
| `02-backend-java/src/main/resources/db/migration/*` | `be-{name}` of the feature the migration belongs to, not a generic `db` scope |
| `01-share-docs/API_SPEC.md`, `01-share-docs/DATABASE.md` | `docs` (omit app prefix — these are shared across all three) |
| Any `.claude/skills/**` | `skills` |
| Touches more than one app in one commit | Prefer splitting into separate commits (see Rules); if genuinely one atomic change, omit scope rather than guess |

## Migrations

A Flyway migration (`V{n}__....sql`) almost never lands alone — it belongs to the same commit as the entity/feature change that needs it (per `BE-PROJECT-RULES.md` §7: *"Database migrations must be included in the same PR as the related code"*). Don't split a migration into its own `chore` commit separate from the feature that requires it.

## Subject Rules

- Imperative mood: "add" not "adds" or "added"
- Lowercase first letter
- No period at end
- Max 50 characters
- Complete the sentence: "This commit will..."

## Body Rules

- Separate from subject by blank line
- Wrap at 72 characters
- Explain WHAT and WHY, not HOW
- Use bullet points for multiple changes

## Examples

### Simple feature
```
feat(be-transaction): add duplicate transaction endpoint
```

### Feature with body
```
feat(be-auth): add refresh token rotation

- Accept refreshToken in the request body
- Revoke the old Redis-backed refresh token and issue a new one on each use
- Reject with AUTH_1004 if the token is invalid, expired, or revoked
```

### Bug fix
```
fix(web-reports): show budget overspend badge for the correct category

Category id from the previous month's response was leaking into this
month's donut chart after a fast month switch.
```

### Migration + feature together
```
feat(be-budget): add version column for optimistic locking

- Add V5__add_budgets_version_column.sql
- Send back the current version on PATCH, reject with BUDGET_1003 on mismatch
```

### Breaking change
```
feat(be-transaction)!: require client-generated id on create

BREAKING CHANGE: POST /transactions no longer accepts a server-generated
id — the client must send a UUID, required for offline sync idempotency.
```

### Docs-only, shared across apps
```
docs: add brute-force lockout fields to DATABASE.md and API_SPEC.md
```