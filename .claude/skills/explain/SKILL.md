---
name: explain
description: >
  Explain code, concepts, flow, or decisions for beginners.
  Use when user says "explain", "giải thích", "how does this work",
  "what is", "tại sao", "why", or wants to understand code/concepts.
argument-hint: "[code|concept|flow|why] [target] [be|web|mobile]"
allowed-tools:
  - Read
---

# Explain for Beginners

## Usage

```
/explain code [feature-name] [be|web|mobile]     → What the code does
/explain concept [concept-name] [be|web|mobile]  → Pattern/concept explanation
/explain flow [feature-name] [be|web|mobile]     → Request/data flow
/explain why [decision]                           → Reasoning behind decisions (usually cross-app)
```

## Workflow

1. **Ask language**: "English or Vietnamese? (en/vi)"

2. **Resolve which app**: `auth`, `account`, `category`, `transaction`, `budget`, and `analytics` all exist as **separate features in backend + mobile** (web admin instead has `users`, `categories`, `reports`, `settings`, `audit`; `admin` bridges both). If the user didn't say `be`/`web`/`mobile` and it isn't obvious from an open/selected file, **ask** which app before reading anything — reading the wrong app's `context.md`/architecture doc gives a confidently wrong explanation.

3. **Read docs FIRST (no source scanning):**

| Mode | Read in order |
|------|---------------|
| `code` | Feature's context file (see naming below) → that app's `*-ARCHITECTURE.md` |
| `concept` | That app's `*-PROJECT-RULES.md` → `*-ARCHITECTURE.md` |
| `flow` | `01-share-docs/API_SPEC.md` → feature's context file |
| `why` | The relevant `*-PROJECT-RULES.md` → `01-share-docs/DATABASE.md` (if data-model related) → `01-share-docs/API_SPEC.md` (if contract related) → `01-share-docs/IDEA.md` (if a product decision) |

4. **Only read specific source file** if user points to exact file

5. **Use template**: `./templates/{en|vi}.md`

## Doc Locations

```
01-share-docs/
├── IDEA.md
├── DATABASE.md
└── API_SPEC.md

02-backend-java/docs/
├── BE-PROJECT-RULES.md
└── BE-ARCHITECTURE.md

03-web-reactjs/docs/
├── WEB-PROJECT-RULES.md
└── WEB-ARCHITECTURE.md

04-mobile-expo/docs/
├── MOBILE-PROJECT-RULES.md
└── MOBILE-ARCHITECTURE.md
```

**Feature context file — naming differs per app, don't assume `context.md` everywhere:**

```
Backend: 02-backend-java/src/main/java/com/tuyenphan/expenseapp/feature/{feature}/{Feature}Context.md
         e.g. feature/transaction/TransactionContext.md, feature/budget/BudgetContext.md

Web:     03-web-reactjs/src/features/{feature}/context.md

Mobile:  04-mobile-expo/src/features/{feature}/context.md
```

## Rules

- **NEVER Glob/scan source code**
- Docs contain all architectural decisions
- The feature's context file has feature-specific details — check the naming convention above for the resolved app before looking for it
- Only read source when user gives exact file path
- If the same concept has a different design per app (e.g. mobile's offline sync queue vs web admin having no offline support at all), say so explicitly rather than explaining only one side — don't let the resolved app silently hide the other app's different behavior when the user's question is really about the whole system (common for `why`/`concept` mode).

## Error Handling

| Error | Action |
|-------|--------|
| Missing mode | Ask: code, concept, flow, or why? |
| App not specified and ambiguous | Ask: backend, web, or mobile? |
| No feature context file found | Read that app's `*-ARCHITECTURE.md` instead |
| Need source detail | Ask user for specific file path |
