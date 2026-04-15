# /implement — Feature Implementation Skill

Implements a feature from a Jira ticket ID or a plain description.
Orchestrates a review-gated workflow: analyse → approve → implement →
local review → commit → PR. Never commits without explicit user approval.

> **Why this is a skill, not an agent**: This workflow has three user
> approval gates that require multi-turn conversation with persistent state.
> An agent is single-shot and cannot resume between gates. The skill runs
> in the current session and naturally pauses for your input at each gate.
> Heavy codebase analysis is delegated to a subagent to keep your context clean.

---

## Step 0 — Parse input

$ARGUMENTS is either:
- A Jira ticket key (`PROJ-123`) → **Scenario A**
- A plain feature description → **Scenario B**
- The phrase "check stories" or "check existing" + description → **Scenario C**

Detect ticket key: matches `^[A-Z][A-Z0-9]+-\d+$`

---

## SCENARIO A — Implement by Jira ticket ID

### A1 — Fetch and sync

1. Call `getJiraIssue` with the ticket key.
2. Read `.ai/stories.md`.
3. If a row with this ID exists → update the row (status, synced date).
   If no row → append a new row.
4. Write the updated `.ai/stories.md`.
5. Print: `📋 {TICKET-ID}: {Title} [{Status}]`

### A2 — Analyse

Delegate codebase exploration to a subagent to keep the main context clean:

> Subagent prompt: "Read CLAUDE.md, then search the codebase to understand
> what files would need to be created or modified to implement: {ticket title
> and description}. Return: list of entities to create, files to modify,
> and any risks you spot. Be specific about file paths."

Using the subagent findings plus the full Jira ticket, produce this plan:

```
## Implementation Plan — {TICKET-ID}: {Title}

### What this delivers
[2–3 sentences]

### Entities / data changes
| Entity | Action | Fields |
|--------|--------|--------|
| Product | Create | name, price, category_id |
| Category | Modify | add slug field |

### Backend checklist
- [ ] pnpm scaffold Product
- [ ] Add category_id to Product model + migration note
- [ ] ProductService.getByCategory() custom method

### Frontend checklist
- [ ] frontend/web/services/product.service.ts
- [ ] frontend/web/queries/useGetProduct.ts
- [ ] frontend/web/app/products/page.tsx + ProductsPageContent.tsx

### Existing files to modify
- services/core/src/routes/index.ts (route registration auto-handled by scaffold)

### Risks
- ⚠ MEDIUM — [specific risk with why]
- ℹ LOW — [minor risk]

### Assumptions
- [anything inferred, not stated in ticket]
```

### A3 — Plan approval gate ⛔ STOP

Ask:
> **Approve this plan?**
> - `approve` → proceed
> - `change: [what]` → revise plan
> - `cancel` → stop

**On `change:`** — revise the plan. Before showing the revision, check if
the requested change causes any cascading impact and flag it:
> ⚠ Changing X will also affect Y — [reason]. Still want this?

Show the revised plan and return to A3.

### A4 — Worktree check

Look for explicit phrases in the conversation: "use worktree", "new branch",
"separate branch", "in a worktree".

**Found** → `git worktree add ../{ticket-slug} -b feat/{ticket-slug}`
and work in that path. Print: `🌿 feat/{ticket-slug}`

**Not found** → work in current directory. No branch yet.
Print: `📁 Working in current directory`

### A5 — Implement

Order of operations:
1. **Scaffold** — `pnpm scaffold {Entity}` for each new entity. Immediately
   fill in all fields (type interface + model columns) — never leave TODO stubs.
2. **Associations** — Sequelize associations if entities relate.
3. **Custom logic** — service/repository methods beyond CRUD.
4. **Frontend** — services, query/mutation hooks, page + PageContent.
5. **Existing file edits** — modify files that already exist.

While implementing, silently apply `/review` checks to everything written.
Fix any violations before reporting — do not expose internal correction cycles.

❌ Do not run `git add`, `git commit`, or `git push`.

### A6 — Local review gate ⛔ STOP

Print:
```
## Changes Ready for Review

**Ticket**: {TICKET-ID} — {Title}

### Created
- packages/types/src/schema/product.ts
- [all new files...]

### Modified
- services/core/src/routes/index.ts

### API routes
  GET|POST         /api/v1/products
  GET|PUT|DELETE   /api/v1/products/:id

### ⚠ Still needed (manual)
  - DB migration for: products table
  - pnpm build to verify TypeScript

---
Nothing has been committed. Review locally and let me know:
- `approved` → I'll commit and create the PR
- `change: [what]` → I'll make the change and ask you to review again
```

**On `change:`** → make the changes, reprint the report, return to A6.
Never commit between cycles.

### A7 — Commit and PR

1. Internally run `/review` on all changed files. Fix silently. Report count.
2. `git add` each file by name (never `git add .`).
3. Commit:
   ```
   feat({scope}): {description}

   {body}

   Implements: {TICKET-ID}
   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
   ```
4. Push + `gh pr create`. PR body includes ticket link + test checklist.
5. Print PR URL in `<pr-created>` tags.

---

## SCENARIO B — Implement by plain description (no ticket ID)

No story search. No Jira lookup. Just implement and track it.

### B1 — Create a local tracking entry

Generate a local placeholder ID: `LOCAL-{YYYY-MM-DD}-{slug}` (e.g. `LOCAL-2024-01-15-product-catalog`).

Append a row to `.ai/stories.md`:
```
| LOCAL-2024-01-15-product-catalog | {short title from description} | In Progress | Story | — | {today} |
```

Print: `📋 Tracking as LOCAL-2024-01-15-product-catalog`

### B2 — Analyse

Using only the description in $ARGUMENTS (no Jira fetch), produce the same
plan format as A2. Use the subagent for codebase exploration.

Then continue from **A3** (plan approval gate) through **A7** (commit + PR).

At A7, if a real Jira ticket gets created later, the user can run
`/implement {REAL-TICKET-ID}` which will sync and replace the LOCAL entry.

---

## SCENARIO C — Check existing stories (explicit request only)

Triggered when $ARGUMENTS contains "check stories", "check existing",
"is there a story for", or similar explicit search intent.

1. Read `.ai/stories.md` — show the full table.
2. If a description is also given, highlight rows whose title is similar.
3. Ask: "Is any of these what you're looking for?"
   - `yes, {ID}` → fetch from Jira, continue as Scenario A from A2
   - `no` → ask "Would you like to create a new story or just implement directly?"
     - "create story" → draft story using `.ai/helpers/user-story-strcuture.md`,
       review cycles, create in Jira via `createJiraIssue`, sync to `stories.md`,
       continue from A2
     - "implement directly" → continue as Scenario B

---

## Hard rules

- Never commit without the user typing `approved` (or equivalent clear approval)
- Never create a worktree/branch unless the user explicitly asks
- Always read existing files before modifying — never overwrite blindly
- Always use `pnpm scaffold` for new entities — never write scaffold files from scratch
- Always fill in scaffold TODOs before reporting implementation complete
- If the ticket is a Bug type — skip scaffold, focus on the targeted fix
- Delegate heavy file exploration to a subagent to avoid bloating main context
