# Backend: expense-app

## Tech Stack
- Language: Java 21
- Framework: Spring Boot 4.1.1 (Spring MVC, Spring Security)
- ORM: Spring Data JPA / Hibernate
- Database: MySQL (+ Redis for refresh tokens / analytics cache)
- Migration: Flyway
- Build Tool: Gradle

## Documentation

### Must Read
- @docs/BE-PROJECT-RULES.md - Conventions, patterns, MUST/MUST NOT
- @docs/BE-ARCHITECTURE.md - Folder structure, layers, feature anatomy

### Reference
- @../01-share-docs/API_SPEC.md - API contract
- @../01-share-docs/DATABASE.md - Schema

## Quick Reference

### Feature Location
`src/main/java/com/tuyenphan/expenseapp/feature/[name]/`

Each feature owns its controller, service, repository, DTOs, entities, and optional `context.md`. Features: `auth`, `account`, `category`, `transaction` (core), `budget`, `analytics`, `admin` — see `docs/BE-PROJECT-RULES.md` §1.

### Database Migration
`src/main/resources/db/migration/`

Use Flyway with naming format:

```text
V1__create_users.sql
```

A migration ships in the same commit as the feature that needs it — never split into its own commit.

### API
- Base path: `/api/v1`
- IDs: UUID (`BINARY(16)`) — server-generated for most entities; `transactions.id` is **client-generated** (idempotent upsert, offline writes)
- Request fields: camelCase
- Database fields: snake_case
- Money: `DECIMAL(14,2)`, serialized as a JSON **string** (`"35000.00"`), never a JSON number

### Error Code Prefix
`[FEATURE]_[NUMBER]`

Examples: `AUTH_1001`, `ACCOUNT_1001`, `CATEGORY_1001`, `TRANSACTION_1001`, `BUDGET_1001`, `ADMIN_1001`, `VALIDATION_1001`, `NOT_FOUND_1001`, `INTERNAL_1001` — full list in `../01-share-docs/API_SPEC.md` §5.

### Project Base Package
`com.tuyenphan.expenseapp`

### Common Rules
- Organize code by business feature; no direct imports between features — cross-feature access only via a feature's public Service interface or `ApplicationEventPublisher` events.
- Controllers must not contain business logic (validate + delegate only).
- Services handle business rules and `@Transactional` boundaries.
- Repositories handle database access only — no `EntityManager`/`repository` calls from service or controller.
- Return DTOs, never expose entities directly.
- Authorization must use the authenticated JWT user (`@CurrentUser`); never trust a client-supplied `userId`.
- `/admin/*` endpoints require `role = ADMIN` enforced server-side (`@PreAuthorize`) — never rely on the frontend guard.
- `budgets` use optimistic locking (`@Version`) — PATCH must send back the current `version`; mismatch → `409 BUDGET_1003`.
- Never log passwords, tokens, encryption keys, or full JWT payloads.
