# /commit-pr — Commit and Create PR

Runs a pre-commit review, stages changed files, commits, pushes, and opens
a PR. Works standalone (after any manual changes) or when called by /implement.

$ARGUMENTS (optional): extra context for the commit message, e.g. a ticket ID
like `PROJ-123` or a short description override.

---

## Step 1 — Pre-commit review

Invoke the /review skill on all currently changed files (staged + unstaged).

- If /review finds **errors (🔴)** → fix them silently, then report:
  `🔧 Fixed {N} violation(s) before committing.`
- If /review finds only **warnings or info** → report count, proceed.
- If clean → `✅ Review passed.`

Do not proceed to commit if errors remain unfixed after one fix attempt.
In that case, report the remaining errors and stop — ask the user to resolve them.

---

## Step 2 — Determine branch

Run `git branch --show-current`.

- If already on a feature branch (not `main` or `master`) → use it.
- If on `main`/`master` → create a branch:
  - If $ARGUMENTS contains a ticket key → `feat/{ticket-key-slug}`
  - Otherwise → `feat/{short-description-slug}` derived from changed file names
  - Run: `git checkout -b {branch-name}`

---

## Step 3 — Stage files

Run `git status --porcelain` to get the list of changed files.
Stage each changed file **by name** — never use `git add .` or `git add -A`.

```bash
git add path/to/file1 path/to/file2 ...
```

Print the list of staged files.

---

## Step 4 — Commit

Run `git log --oneline -5` to understand the repo's commit message style.

Build the commit message:
- **Scope**: infer from the changed files (e.g. `product`, `auth`, `frontend`)
- **Type**: `feat` for new code, `fix` for bug fixes, `refactor` for restructuring
- **Body**: what was implemented and why (2–4 lines)
- **Ticket**: if $ARGUMENTS contains a ticket key, add `Implements: {KEY}`

```bash
git commit -m "feat({scope}): {short description}

{body}

{Implements: TICKET-ID if provided}
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Step 5 — Push and PR

```bash
git push -u origin {branch}
```

Then create the PR:
```bash
gh pr create \
  --title "feat: {title}" \
  --base main \
  --body "..."
```

PR body must include:
- **Summary**: what was built (3–5 bullet points)
- **Ticket**: link to Jira ticket if $ARGUMENTS contains a key
- **Test plan**: checklist of what to verify manually
- Generator credit

---

## Step 6 — Report

Print the PR URL wrapped in `<pr-created>` tags.

If called by /implement → return the PR URL to the orchestrator.
