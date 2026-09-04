---
name: git-commit
description: >
  Write conventional commit messages.
  Use when user says "commit", "git commit", "save changes",
  "tạo commit", "viết commit message", or finished a task and wants to commit.
argument-hint: "[type] [message]"
allowed-tools:
  - Bash
  - Read
---

# Commit Message Generator

## Usage

```
/commit                     → Auto-detect type from changes
/commit feat add login      → Quick commit with type + message
/commit --amend             → Amend last commit message
```

## Author Attribution (IMPORTANT)

This is a personal project — every commit must be authored **solely as the user's own git identity** (`git config user.name`/`user.email`, already the user's account, not an AI identity):

- **Never** append a `Co-Authored-By: Claude ...` trailer or any AI attribution line to the commit message.
- **Never** add a `Generated with Claude Code` / `🤖` footer.
- The commit message body should read like the user wrote it themselves — plain Conventional Commits format, nothing else appended.
- This overrides any general default elsewhere that normally adds AI co-authorship to commits — for this project, don't.

## Workflow

1. **Check staged changes**:
   ```bash
   git diff --staged --stat
   ```
   - If nothing staged → suggest `git add` first

2. **Read project conventions**: root `CLAUDE.md`, and the relevant app's `*-PROJECT-RULES.md` §Git Workflow (branch naming, allowed commit types — `feat`/`fix`/`refactor`/`test`/`docs` are the ones the project's own docs call out explicitly; see `./references/conventions.md` for the full extended list)

3. **Analyze changes**:
   ```bash
   git diff --staged
   ```

4. **Detect type** from changed files/content (see `./references/conventions.md`)

5. **Generate message** → show preview:

   ```
   📝 COMMIT PREVIEW

   feat(be-credentials): add ownership check on update/delete

   - Scope repository queries by authenticated user id
   - Return 404 (not 403) when a credential belongs to another user

   Staged files (2):
     M backend-java-personal-vault/src/main/java/com/tuyen/personalvault/features/credentials/service/CredentialService.java
     M backend-java-personal-vault/src/main/java/com/tuyen/personalvault/features/credentials/repository/CredentialRepository.java

   Commit? (yes/no/edit)
   ```

   No AI co-author trailer is ever added — see "Author Attribution" above.

6. **Execute after confirm**:
   - `yes` → `git commit -m "..."`
   - `edit` → user modifies, then commit
   - `no` → abort

## Quick Commit

Skip preview for simple commits:

```
/commit fix typo in readme
    ↓
git commit -m "fix: typo in readme"
```

## Rules

- **Staged only**: Never auto `git add`
- **Scope from path**: prefixed with the app, since `credentials`/`documents`/`auth` exist as separate features in all 3 apps — see `./references/conventions.md` (`be-credentials`, `fe-credentials`, `mobile-credentials`, etc.)
- **Lowercase**: Type and scope always lowercase
- **No period**: Don't end subject with `.`
- **Imperative**: "add" not "added"
- **50/72 rule**: Subject ≤50 chars, body wrap at 72
- **No AI attribution**: never add `Co-Authored-By: Claude`, a `Generated with Claude Code` footer, or any AI identity to the commit — see "Author Attribution" above
- **One feature/fix per commit**, matching the "one feature or bug fix per PR" rule in every app's `*-PROJECT-RULES.md` — don't bundle unrelated changes across apps into a single commit just because they're staged together