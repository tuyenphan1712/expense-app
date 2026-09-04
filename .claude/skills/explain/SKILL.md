---
name: explain
description: >
  Explain code, concepts, flow, or decisions for beginners.
  Use when user says "explain", "giải thích", "how does this work",
  "what is", "tại sao", "why", or wants to understand code/concepts.
argument-hint: "[code|concept|flow|why] [target] [be|fe|mobile]"
allowed-tools:
  - Read
---

# Explain for Beginners

## Usage

```
/explain code [feature-name] [be|fe|mobile]     → What the code does
/explain concept [concept-name] [be|fe|mobile]  → Pattern/concept explanation
/explain flow [feature-name] [be|fe|mobile]     → Request/data flow
/explain why [decision]                          → Reasoning behind decisions (usually cross-app)
```

## Workflow

1. **Ask language**: "English or Vietnamese? (en/vi)"

2. **Resolve which app**: `credentials`, `documents`, `auth`, `profile`, and `admin` all exist as **separate features in all three apps** (backend, frontend, mobile). If the user didn't say `be`/`fe`/`mobile` and it isn't obvious from an open/selected file, **ask** which app before reading anything — reading the wrong app's `CONTEXT.md`/architecture doc gives a confidently wrong explanation.

3. **Read docs FIRST (no source scanning):**

| Mode | Read in order |
|------|---------------|
| `code` | Feature's `Context.md` (see naming below) → that app's `*-ARCHITECTURE.md` |
| `concept` | That app's `*-PROJECT-RULES.md` → `*-ARCHITECTURE.md` |
| `flow` | `01-share-docs/API_SPEC.md` → feature's `Context.md` |
| `why` | The relevant `*-PROJECT-RULES.md` → `01-share-docs/DATABASE.md` (if data-model related) → `01-share-docs/API_SPEC.md` (if contract related) |

4. **Only read specific source file** if user points to exact file

5. **Use template**: `./templates/{en|vi}.md`

## Doc Locations

```
01-share-docs/
├── DATABASE.md
└── API_SPEC.md

backend-java-personal-vault/docs/
├── BE-PROJECT-RULES.md
└── BE-ARCHITECTURE.md

frontend-react-personal-vault/docs/
├── FE-PROJECT-RULES.md
└── FE-ARCHITECTURE.md

mobile-expo-personal-vault/docs/
├── MOBILE-PROJECT-RULES.md
└── MOBILE-ARCHITECTURE.md
```

**Feature context file — naming differs per app, don't assume `CONTEXT.md` everywhere:**

```
Backend:  backend-java-personal-vault/src/main/java/com/tuyen/personalvault/features/{feature}/{Feature}Context.md
          e.g. features/credentials/CredentialContext.md, features/documents/DocumentContext.md

Frontend: frontend-react-personal-vault/src/features/{feature}/CONTEXT.md

Mobile:   mobile-expo-personal-vault/src/features/{feature}/CONTEXT.md
```

## Rules

- **NEVER Glob/scan source code**
- Docs contain all architectural decisions
- The feature's context file has feature-specific details — check the naming convention above for the resolved app before looking for it
- Only read source when user gives exact file path
- If the same concept has a different design per app (e.g. web refresh token in an HttpOnly cookie vs mobile's SecureStore token), say so explicitly rather than explaining only one side — don't let the resolved app silently hide the other app's different behavior when the user's question is really about the whole system (common for `why`/`concept` mode).

## Error Handling

| Error | Action |
|-------|--------|
| Missing mode | Ask: code, concept, flow, or why? |
| App not specified and ambiguous | Ask: backend, frontend, or mobile? |
| No feature context file found | Read that app's `*-ARCHITECTURE.md` instead |
| Need source detail | Ask user for specific file path |
