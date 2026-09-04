---
name: init-base
description: >
  Setup project architecture and environment for an existing project.
  Creates the feature-based foundation for backend, frontend, or mobile apps,
  installs missing dependencies, and configures base shared setup.
  Use when user says "init backend", "init frontend", "init mobile",
  "setup structure", "scaffold project", or "setup environment".
argument-hint: "[frontend|backend|mobile]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
---

# Setup Project Architecture & Environment

> Resolve all project and documentation paths relative to the workspace root.

**Scope:** Structure + Dependencies + Configs only. NO feature code.

This skill sets up:
- ✅ Folder structure (feature-based architecture)
- ✅ Dependencies installation
- ✅ Config files (.env, tsconfig, linting, etc.)
- ✅ Core/Shared modules (empty or minimal setup)
- ❌ NOT feature code (use specific feature skills later)

## Environment Configuration (All Stacks)

Apply these rules to every project, regardless of language or framework:

- Never commit a local `.env` file containing real secrets.
- Keep a safe `.env.example` template with placeholder values only.
- Never hardcode passwords, tokens, API keys, or private connection strings.
- Detect the project's language and framework before choosing how environment
  variables are loaded. Do not apply a framework-specific `.env` mechanism to
  an unrelated stack.
- Preserve the existing environment-loading convention when one is already
  configured; do not add duplicate dotenv libraries without a reason.

### Spring Boot

- For local development, add
  `spring.config.import=optional:file:.env[.properties]` to
  `src/main/resources/application.properties` when the project uses a local
  `.env` file.
- Keep production secrets in real environment variables or the deployment
  platform's secret manager.

### Python

- First detect the framework and existing configuration approach:
  Django, FastAPI, Flask, or a custom application may already have one.
- Prefer the project's existing settings/config module and environment
  convention.
- For a plain Python project that needs local `.env` loading, use the existing
  `python-dotenv` setup if present; otherwise propose adding it before changing
  dependencies.
- Do not put real secrets in settings files or `.env.example`.

### Node.js

- Check whether the framework already loads environment files before adding
  `dotenv`.
- For plain Node.js applications, use the existing `dotenv` convention or
  propose the dependency if no loader exists.

### Vite/React and Expo/React Native

- Vite loads `.env` files natively; client-exposed variables must use the
  `VITE_` prefix.
- Expo loads public variables through its environment support; variables used
  by the client must use the `EXPO_PUBLIC_` prefix.
- Do not treat frontend/mobile `.env` values as secrets: anything bundled into
  a client application can be inspected by users.
- Do not add another dotenv library unless the project has a specific server-
  side need.

## Pre-flight Checks

1. **Argument provided?** Must be `frontend`, `backend`, or `mobile`
2. **Target directory exists?**
   - Backend: `backend-java-personal-vault/`
   - Frontend: `frontend-react-personal-vault/`
   - Mobile: `mobile-expo-personal-vault/`
3. **Project already initialized?** Check for `package.json` for frontend/mobile or build files for backend.
   - If not exists → Error: "Project not found. Create project first."

---

## Task: Backend Scaffolding

### Required Reading (READ FIRST)

| Doc | Purpose |
|-----|---------|
| `01-share-docs/DATABASE.md` | Database schema, naming conventions, entity design |
| `01-share-docs/API_SPEC.md` | API endpoints, request/response contract |
| `backend-java-personal-vault/docs/BE-PROJECT-RULES.md` | Coding conventions, patterns, anti-patterns |
| `backend-java-personal-vault/docs/BE-ARCHITECTURE.md` | Folder structure and feature anatomy |

### Workflow

1. Read all docs above to understand project conventions
2. Scan current project to see what already exists
3. **Install missing dependencies** (see below)
4. **Create folder structure** as defined in `BE-ARCHITECTURE.md`:
   - Create empty feature folders under `src/main/java/com/tuyen/personalvault/features/`
   - Create shared folders under `src/main/java/com/tuyen/personalvault/shared/`
   - Create config folders as needed in the project
5. **Setup config files**:
   - `.env.example` or profile-specific `application-example.properties`
   - Spring Boot-compatible database configuration references
   - JWT/security config placeholders
   - logging config if needed
6. **Setup core modules** (minimal, ready-to-use):
   - application config
   - shared response / exception structure
   - security utilities
   - generic helper modules
7. **Keep existing files intact - DO NOT overwrite**

**NOT included:**
- Entity definitions
- Controllers, Services, Repositories
- Feature-specific business logic

### Install Missing Dependencies

Check project files first, then install only what's missing.

**Backend baseline (Spring Boot):**
- Already present in project by default: Spring Boot, JPA, Flyway, Security, Validation
- Add only missing operational dependencies if required by design

**General guidance:**
- Keep the project aligned with the current Gradle/Spring Boot stack already in use
- Avoid installing unrelated NestJS/TypeORM packages in this repo

### Validation

- [ ] Folder structure matches `BE-ARCHITECTURE.md`
- [ ] Project still builds with the current Gradle setup
- [ ] `.env.example` or Spring Boot config placeholders are present where needed
- [ ] Security/DB config is not hardcoded
- [ ] Run `./gradlew test`
- [ ] Run `./gradlew build`
- [ ] Run `./gradlew bootRun` only when local database configuration is available
- [ ] Project is ready for feature development

---

## Task: Frontend Scaffolding

### Required Reading (READ FIRST)

| Doc | Purpose |
|-----|---------|
| `01-share-docs/API_SPEC.md` | API endpoints to consume |
| `frontend-react-personal-vault/docs/FE-PROJECT-RULES.md` | Coding conventions, state management rules |
| `frontend-react-personal-vault/docs/FE-ARCHITECTURE.md` | Folder structure, component organization |

### Workflow

1. Read all docs above to understand project conventions
2. Scan current project to see what already exists
3. **Install missing dependencies** (see below)
4. **Create folder structure** as defined in `FE-ARCHITECTURE.md`:
   - Create empty feature folders under `src/features/`
   - Create shared folders under `src/shared/`, including `src/shared/layouts/`
   - Create routes and config folders if absent
5. **Setup config files**:
   - `.env.example` with API base URL if needed
   - path alias config if needed
   - light global config files only
6. **Setup shared modules** (minimal, ready-to-use):
   - Axios instance with interceptors
   - TanStack Query client
   - common types
7. **Setup routing base**:
   - Create route constants and a minimal router structure when routing is not already configured
   - Add protected/admin route wrappers only when required by the existing app structure
8. **Keep existing files intact - DO NOT overwrite**

**NOT included:**
- Feature components
- Feature pages
- Feature hooks/services

### Install Missing Dependencies

Check `package.json` first and install only what is missing.

**Current frontend baseline in this workspace:**
- React 19
- Vite
- TypeScript
- no Tailwind/Axios/Zustand/React Router in package.json yet

**Example install set (only if missing):**
```bash
npm install @tanstack/react-query axios zustand
npm install react-router react-hook-form zod @hookform/resolvers
npm install -D tailwindcss postcss autoprefixer @types/node
```

Configure Tailwind according to the installed version. Do not force a version-specific initialization command.

**Before installing:**
- Read `package.json` first
- Only install what's missing
- List what will be installed and ask user to confirm

### Validation

- [ ] Folder structure matches `FE-ARCHITECTURE.md`
- [ ] All required dependencies installed
- [ ] `.env.example` has API base URL if needed
- [ ] Axios instance configured with interceptors
- [ ] TanStack Query client configured
- [ ] Router setup with route constants, when routing is part of the current setup
- [ ] Run `npm run dev` → app starts without errors
- [ ] Project is ready for feature development

---

## Task: Mobile Scaffolding

### Required Reading (READ FIRST)

| Doc | Purpose |
|-----|---------|
| `01-share-docs/API_SPEC.md` | API contract and mobile auth expectations |
| `01-share-docs/DATABASE.md` | Schema understanding for mobile data modeling |
| `mobile-expo-personal-vault/docs/MOBILE-PROJECT-RULES.md` | Conventions, patterns, anti-patterns |
| `mobile-expo-personal-vault/docs/MOBILE-ARCHITECTURE.md` | Folder structure, navigation, app architecture |

### Workflow

1. Read all docs above to understand project conventions
2. Scan current project to see what already exists
3. **Install missing dependencies** (see below)
4. **Create folder structure** as defined in `MOBILE-ARCHITECTURE.md`:
   - Create empty feature folders under `src/features/`
   - Create `src/shared/` modules as needed
   - Keep `app/` route folders light and framework-driven
5. **Setup config files**:
   - environment config placeholders
   - secure storage / auth config structure
   - typed app configuration if needed
6. **Setup shared modules** (minimal, ready-to-use):
   - Axios API client
   - secure storage adapter
   - auth/session utilities
   - query client and app providers
7. **Keep existing files intact - DO NOT overwrite**

**NOT included:**
- Feature screens
- Business logic
- Specific auth/credential/document flows

### Install Missing Dependencies

Check `package.json` first and install only what is missing.

**Current mobile baseline in this workspace:**
- Expo, React Native, Expo Router, TypeScript, React Navigation packages
- Additional libraries may be needed for secure storage, query client, forms, or validation

**Example install set (only if missing):**
```bash
npm install @tanstack/react-query axios zustand
npm install react-hook-form zod @hookform/resolvers expo-secure-store
```

### Validation

- [ ] Folder structure matches `MOBILE-ARCHITECTURE.md`
- [ ] App remains compatible with Expo Router
- [ ] Shared API clients and storage adapters are in place
- [ ] No plaintext secrets stored in AsyncStorage
- [ ] Run `npx expo start --web` or project-appropriate validation command
- [ ] Project is ready for feature development

---

## Output

After completion, provide:

```
✅ {Backend|Frontend|Mobile} architecture setup complete!

📁 Location: ./{backend-java-personal-vault|frontend-react-personal-vault|mobile-expo-personal-vault}/

📦 Dependencies installed:
- [list newly installed packages]

📂 Folder structure created:
- src/features/ (empty, ready for features)
- src/shared/ (types, utils ready)
- [other folders...]

⚙️  Configs created:
- .env.example or project-specific config placeholder
- [other config files...]

⚠️  Skipped (already exists):
- [list skipped items]

🚀 Next steps:
1. Copy or activate the project-specific config placeholder
2. Update environment/config values with your settings
3. Run the relevant project command to verify setup
4. Use the appropriate feature-generation workflow next
```

---

## Important Rules

1. **DO NOT delete or overwrite existing files**
2. **Before modifying existing application/config files, inspect them and ask for confirmation**
3. **New files and missing folders may be created directly when within the requested setup scope**
4. **Report what was skipped** so user knows what already existed
5. **Keep the existing project working**
6. **Match the real workspace structure, not generic examples**
7. **For mobile, do not assume browser APIs or web-only patterns**

## Error Handling

| Error | Action |
|-------|--------|
| Missing argument | Ask: "Which project? `/init-base backend`, `/init-base frontend`, or `/init-base mobile`" |
| Doc file not found | List missing docs and ask user to create them first |
| Project not found | Error: "No matching project directory or config found. Is this the correct workspace?" |
