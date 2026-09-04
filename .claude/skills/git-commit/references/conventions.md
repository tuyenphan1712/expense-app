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

`credentials`, `documents`, `auth`, `profile`, and `admin` all exist as **separate features in all three apps** — a bare `(credentials)` scope would be ambiguous. Prefix the scope with the app:

| File path | Scope |
|-----------|-------|
| `backend-java-personal-vault/.../features/{name}/*` | `be-{name}` (e.g. `be-credentials`, `be-auth`) |
| `frontend-react-personal-vault/src/features/{name}/*` | `fe-{name}` (e.g. `fe-documents`) |
| `mobile-expo-personal-vault/src/features/{name}/*` | `mobile-{name}` (e.g. `mobile-credentials`) |
| `backend-java-personal-vault/src/main/java/.../shared/*` or `.../config/*` | `be-shared` |
| `frontend-react-personal-vault/src/shared/*` or `src/routes/*` | `fe-shared` |
| `mobile-expo-personal-vault/src/shared/*` or `app/*` | `mobile-shared` |
| `backend-java-personal-vault/src/main/resources/db/migration/*` | `be-{name}` of the feature the migration belongs to, not a generic `db` scope |
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
feat(be-auth): add mobile refresh token rotation
```

### Feature with body
```
feat(be-auth): add mobile refresh token rotation

- Accept refreshToken in the request body for clientType=mobile
- Revoke the old refresh_tokens row and issue a new one on each use
- Reject with AUTH_003 if the token is invalid, expired, or revoked
```

### Bug fix
```
fix(fe-credentials): reject empty password before encrypting

Empty string was passing client-side validation and getting
encrypted/submitted instead of showing a form error.
```

### Migration + feature together
```
feat(be-documents): add mime_type and file_size columns

- Add V4__add_document_metadata_columns.sql
- Validate and persist mimeType/fileSize on upload
- Set Content-Type from stored mimeType on download
```

### Breaking change
```
feat(be-credentials)!: require encryptedPassword as base64

BREAKING CHANGE: the API no longer accepts a raw string for
encryptedPassword — it must be base64-encoded ciphertext+IV.
```

### Docs-only, shared across apps
```
docs: add brute-force lockout fields to DATABASE.md and API_SPEC.md
```