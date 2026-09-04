# Backend Project Rules — Expense App

> Feature-based backend rules for the Expense App.
> Product decisions: `IDEA.md`. Schema & JPA conventions: `docs/DATABASE.md`. Context base: `docs/master-prompt.md`.

## Tech Stack
- Language: Java 17
- Framework: Spring Boot 3 (Spring MVC, Spring Security)
- ORM: Spring Data JPA (Hibernate 6)
- Migration: Flyway
- Cache: Redis 7 (refresh tokens, analytics cache — outside relational schema)

## 1. Feature Structure

```
com.expenseapp/
├── feature/                            ← one package per feature
│   ├── auth/                           (register, login, refresh, profile)
│   │   ├── AuthController.java
│   │   ├── AuthService.java
│   │   ├── AuthRepository.java
│   │   ├── dto/   RegisterRequest.java · LoginRequest.java · TokenResponse.java
│   │   ├── entity/User.java
│   │   └── AuthContext.md
│   ├── account/                        (Wallet — model in MVP, UI hidden)
│   ├── category/
│   ├── transaction/                    (core feature)
│   ├── budget/
│   ├── analytics/                      (dashboard + reports)
│   ├── admin/                          (web admin: /admin/users · /admin/stats · /admin/categories — delegates to feature services)
│   └── future (v0.2/v0.3): recurring/ · notification/ · attachment/ · audit/ · ai/
├── shared/                             ← cross-feature code only
│   ├── config/     SecurityConfig · RedisConfig · OpenApiConfig
│   ├── security/   JwtService · JwtAuthFilter · CurrentUser
│   ├── common/     ApiResponse · GlobalExceptionHandler · PageResult
│   └── util/       MoneyUtils · DateUtils
└── ExpenseAppApplication.java
```

- Every feature owns its `controller`, `service`, `repository`, `dto`, `entity`.
- Feature list maps the MVP in `IDEA.md` §20: auth → transaction → category → dashboard → budget → analytics (dashboard lives in `analytics`).
- Empty `XxxContext.md` per feature (2–5 lines: purpose, main flows, cross-feature touches).

## 2. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Feature package | lowerCamel, under `feature.` | `com.expenseapp.feature.transaction` |
| Classes | PascalCase | `TransactionService` |
| Controller / Service / Repository | `<X>Controller` / `<X>Service` / `<X>Repository` | `TransactionRepository` |
| Entity | singular PascalCase (maps 1:1 to table) | `Transaction` ↔ `transactions` |
| DTO | `<Action><X>Request` / `<X>Response` | `CreateTransactionRequest` / `TransactionResponse` |
| Methods / variables | camelCase | `getMonthlyReport()` |
| Constants / enums | UPPER_SNAKE_CASE | `MAX_NOTE_LENGTH` / `EXPENSE`, `CREDIT_CARD` |
| Migrations | `V{n}__{description}.sql` | `V3__create_transactions.sql` |

DB columns are `snake_case` (`transaction_date`) → DTO fields mirror as `camelCase` (`transactionDate`). Keep API field names identical to DB columns (see `docs/master-prompt.md` consistency rules).

## 3. Feature Rules
- Feature must be self-contained: owns its entities, repositories, services, DTOs.
- No direct imports between features — never `import com.expenseapp.feature.budget.*` inside `transaction`.
- Cross-feature communication only via:
  - Shared code in `com.expenseapp.shared` (e.g. `common.ApiResponse`)
  - A feature's **public Service interface** (import the interface, never its internals)
  - Events — `ApplicationEventPublisher` for decoupled flows (e.g. `TransactionCreatedEvent`/`TransactionUpdatedEvent`/`TransactionDeletedEvent` → budget/analytics recompute + `AccountBalanceUpdateListener`)
- Shared code location: `com.expenseapp.shared` — add here only when 2+ features use it.

## 4. Code Patterns (MUST follow)

### Error handling
- Service throws domain exceptions (`TransactionNotFoundException`); `GlobalExceptionHandler` (`@RestControllerAdvice`) maps them to HTTP codes.
- Client sees only `ApiResponse` errors — never stack traces, never Hibernate/`SQLException` leaks.

### Validation
- Jakarta Bean Validation on DTOs, `@Valid` in controller: `@NotBlank`, `@Size`, `@DecimalMin("0.01")` for amount, custom `@EnumValue` for enums.
- Service validates **business rules only** (e.g. budget period uniqueness) — not syntax.

### Logging
- SLF4J via `@Slf4j` (Lombok); log at service boundary: `log.info("Transaction created id={}", id)`.
- Never log passwords, tokens, or full JWT payloads. Payload details → `debug`/`trace`.

### Response format
- Success: `200/201` + `ApiResponse<T>` `{ success, message, data, errors, timestamp }`.
- Errors: `4xx/5xx` + `ApiResponse` with stable `code` + human-readable `message`.
- Pagination: `PageResult<T>` `{ items, page, size, totalElements, totalPages }`.

## 5. Anti-patterns (MUST NOT do)
- ❌ Import another feature's internal files: `import ...feature.budget.BudgetServiceImpl;`
- ❌ Circular dependencies between features
- ❌ Business logic in controllers (controller = validate + delegate, nothing else)
- ❌ Queries outside the repository layer (`EntityManager`/`repository` in service or controller)
- ❌ Hardcoded configuration (DB URL, secrets in code → `application.yml` + env vars)
- ❌ Cross-feature entities as JPA relations (e.g. `Transaction.budget`); cross-feature reads go through the owning feature's service by ID

## 6. Git Workflow
- Branch: `feature/<name>` · `fix/<name>` · `hotfix/<name>` · `chore/<name>`
- Commit (Conventional Commits):
  - `feat: add create transaction endpoint`
  - `fix: validate budget period uniqueness`
  - `refactor: extract shared ApiResponse`
- PR: title in conventional-commit style; description = context (what / why / how) + test evidence; ≥1 reviewer; CI green; never push directly to `main`.

## 7. Testing
- Location: `src/test/java/com/expenseapp/feature/<name>/`
- Naming: `<Class>Test.java` → `TransactionServiceTest`, `TransactionControllerTest`
- Structure: Given / When / Then (Arrange / Act / Assert) with clear comment blocks.
- Layers:
  - Unit (Mockito): service layer
  - `@WebMvcTest`: controller (validation + mapping)
  - `@SpringBootTest` + Testcontainers (MySQL + Flyway): integration incl. repository
- Coverage: ≥80% service layer; 100% on critical paths (transaction create/update/delete, budget warning/overspend logic).

## Format
- DO vs DON'T for every rule, with concrete examples using real feature names. Max 150 lines.

## Tech-Specific Additions (Spring Boot / JPA)

### Layering inside a feature
```
Controller (@Valid) → Service (@Service @Transactional) → Repository (JpaRepository)
```
- `@Transactional` on service write methods; `@Transactional(readOnly = true)` for reads.
- Controller never touches repository or entity directly.

### JPA / Hibernate (align with docs/DATABASE.md)
- PK — two cases (see `docs/DATABASE.md` §4):
  - Most entities (users, accounts, categories, budgets…): server-generated UUID → `@Id @UuidGenerator @Column(columnDefinition = "BINARY(16)")`.
  - `transactions`: client-assigned UUID → `@Id @Column(columnDefinition = "BINARY(16)")` (id set by the client, no `@GeneratedValue`); service upserts by id so retried creates are idempotent.
- Enums: `@Enumerated(EnumType.STRING)` (VARCHAR column).
- Optimistic lock: `@Version private Long version;` on `Budget`.
- Timestamps: `@CreationTimestamp` / `@UpdateTimestamp` on `created_at` / `updated_at`.
- JSON columns (`audit_logs.payload`, `ai_insights.meta`): `@JdbcTypeCode(SqlTypes.JSON)`.
- No bidirectional relations across features — store `user_id`/`category_id` as scalar IDs.
- Money → JSON string: register a global Jackson `BigDecimalSerializer` (or `@JsonFormat(shape = Shape.STRING)` on amount fields) so DECIMAL fields emit `"35000.00"`, never a JSON number (per `docs/API_SPEC.md` §3).

### Security
- JWT access token + refresh token (Redis-backed); `JwtAuthFilter` in `shared/security`.
- Public (no auth): `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`. Everything else requires a valid token.
- Resolve current user via `@CurrentUser` (UUID); never trust a client-supplied `user_id` in request bodies — always read from the authenticated principal.
- **Admin enforcement (server-side):** the JWT encodes a `role` claim; every `/admin/*` endpoint is protected with `@PreAuthorize("hasRole('ADMIN')")` (or an admin path matcher in `SecurityConfig`). Never rely on the frontend guard — hiding the button is UX, security lives here (per `docs/API_SPEC.md` §2).

### Flyway
- Migrations in `src/main/resources/db/migration/`, ordered per `docs/DATABASE.md`:
  `V1__create_users.sql` → `V2__create_accounts.sql` → `V3__create_categories.sql` → `V4__create_transactions.sql` → `V5__create_budgets.sql` → ...
- Never edit an applied migration — add a new one (`V{n}__...`).
