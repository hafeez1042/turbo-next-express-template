# /implement — Feature Implementation Agent

Implements a feature from a Jira ticket ID or a plain-language description.
Follows a strict review-gate workflow: plan → user approval → implement →
user review → commit → PR. Never commits without explicit approval.

---

## Step 0 — Parse input and choose scenario

$ARGUMENTS contains either:
- A Jira ticket key like `PROJ-123` → **Scenario A**
- A plain feature description → **Scenario B**

Detect with: does $ARGUMENTS match the pattern `^[A-Z][A-Z0-9]+-\d+$`?
- Yes → Scenario A
- No → Scenario B

---

## SCENARIO A — Implement by Jira ticket ID

### A1 — Fetch ticket and sync local replica

1. Call `getJiraIssue` with the ticket key from $ARGUMENTS.
2. Check if `.ai/stories/{TICKET-ID}.md` exists (use Glob or Read).
3. **If file does not exist** → create it using the format from `.ai/README.md`,
   populating all fields from the Jira response. Print: `📋 Added to local replica.`
4. **If file exists** → update `synced_at` and any changed fields (status, title).
   Print: `🔄 Replica refreshed.`

### A2 — Analyse the ticket

Read the following before producing the analysis:
- The full Jira ticket (already fetched)
- The local replica file
- `CLAUDE.md` (architecture and patterns)
- Any existing files that the implementation will touch (search by entity name,
  route path, or component name mentioned in the ticket)

Then produce this structured analysis:

```
## Implementation Plan — {TICKET-ID}: {Title}

### What this ticket requires
[2–4 sentences describing the feature in plain terms]

### Entities / data changes
| Entity | Action | Notes |
|--------|--------|-------|
| Product | Create | New entity, needs scaffold |
| Category | Create | Referenced by Product |
| User | Modify | Add `role` field |

### Backend changes
- [ ] scaffold Product (pnpm scaffold Product)
- [ ] scaffold Category
- [ ] Add `category_id` FK to Product model + migration
- [ ] Custom method: ProductService.getByCategory()

### Frontend changes
- [ ] frontend/web/services/product.service.ts (new)
- [ ] frontend/web/queries/useGetProduct.ts (new)
- [ ] frontend/web/app/products/page.tsx (new)
- [ ] frontend/web/app/products/ProductsPageContent.tsx (new)

### Files that will be modified (existing)
- services/core/src/routes/index.ts (route registration)

### Risks
- ⚠ MEDIUM — Adding category_id to products requires a DB migration with
  a default value or nullable constraint — data loss risk if existing rows
  exist without a category
- ℹ LOW — No breaking changes to existing API endpoints

### Assumptions
- [List anything inferred that the ticket did not explicitly state]

### Out of scope
- [Anything mentioned but deferred]
```

### A3 — User approval gate (STOP — wait for response)

After printing the plan, ask exactly:

> **Ready to implement?**
> - Type **approve** (or just press enter) to proceed
> - Type **change:** followed by what you want adjusted
> - Type **cancel** to stop

Do not proceed until the user responds. Read their response:

**If "approve"** → go to A4.

**If "change: …"** → revise the plan based on their feedback.
Before showing the revised plan, check if their requested change introduces
any new risk or cascading impact. If it does, flag it clearly:
```
⚠ Note: Changing X will also affect Y because Z.
Do you still want to proceed with this change?
```
Then show the updated plan and return to A3.

**If "cancel"** → stop and say "Implementation cancelled."

### A4 — Worktree check

Read the conversation history for any of these phrases:
- "use worktree", "create worktree", "in a worktree", "new branch", "separate branch"

**If found** → create a new worktree and branch:
```bash
git worktree add ../{ticket-id-slug} -b feat/{ticket-id-slug}
```
Work in that worktree path for all file operations.
Print: `🌿 Working in worktree: feat/{ticket-id-slug}`

**If not found** → work in the current directory. No branch created yet.
Print: `📁 Working in main directory.`

### A5 — Implement

Execute the implementation plan approved in A3. Follow this order:

1. **New entities first** — run `pnpm scaffold {EntityName}` for each new entity.
   After scaffolding, immediately fill in the fields (type interface + model columns)
   based on what the ticket specifies — do not leave them as TODO stubs.

2. **Associations** — add Sequelize associations to models if entities relate to each other.

3. **Custom logic** — add any custom methods to services or repositories.

4. **Frontend** — create service, query hooks, and page files.

5. **Existing file modifications** — make changes to files that already exist.

As you work, internally run the `/review` logic on each file you write to
catch violations before reporting. If you find a violation in your own output,
fix it silently — do not report internal correction cycles to the user.

Do NOT run `git add`, `git commit`, or `git push` at any point.

### A6 — Local review gate (STOP — wait for response)

After all changes are complete, produce this report:

```
## Implementation Complete ✅

**Ticket**: {TICKET-ID} — {Title}

### Files created
- packages/types/src/schema/product.ts
- services/core/src/models/product.model.ts
- ... (list every file)

### Files modified
- services/core/src/routes/index.ts — added productRoutes registration

### API routes added
  GET    /api/v1/products
  POST   /api/v1/products
  GET    /api/v1/products/:id
  PUT    /api/v1/products/:id
  DELETE /api/v1/products/:id

### Before you review, remember
  ⚠ DB migrations still needed for: products, categories
  ⚠ Run `pnpm build` to check for TypeScript errors

---
👉 Please review the changes locally. I have not committed anything.
   Let me know when you're done, or tell me what to change.
```

Do not commit. Wait for the user's response.

**If user asks for changes** → make the requested changes, then reprint the
report above (updated file list) and wait again. Do NOT commit between cycles.

**If user says "approved"** or "looks good" or "commit" → go to A7.

### A7 — Final review + commit + PR

1. Run the `/review` checks internally against all changed files.
   - If violations found → fix them silently, then report:
     `🔧 Fixed N issue(s) found during pre-commit review.`
   - If clean → `✅ Pre-commit review passed.`

2. Stage and commit:
```bash
git add {all changed files by name — never git add .}
git commit -m "feat({scope}): {short description}

{body — what was implemented and why}

Implements: {TICKET-ID}
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

3. Push and create PR:
```bash
git push -u origin {branch}
gh pr create --title "feat: {title}" --body "..."
```
PR body must include: what was built, ticket link, test plan checklist.

4. Update the local replica: set `status` to match the Jira ticket's current status.

5. Print the PR URL wrapped in `<pr-created>` tags.

---

## SCENARIO B — Implement by feature description

### B1 — Search local replica

Search `.ai/stories/` for any file whose title or summary is semantically
close to the description in $ARGUMENTS.

Use Grep to search for key nouns/verbs from the description across all
`.ai/stories/*.md` files.

**If a match is found:**
```
🔍 Found a matching ticket in the local replica:

  {TICKET-ID}: {Title}
  Status: {status}
  Summary: {first 2 lines of summary}

Is this the ticket you're referring to?
- Type **yes** to proceed with this ticket (I'll fetch the latest from Jira)
- Type **no** to create a new story instead
```
Wait for response.
- "yes" → fetch the ticket from Jira, sync the replica, then continue from **A2**
- "no" → go to B2

**If no match found** → go to B2.

### B2 — Draft a new user story

Read `.ai/helpers/user-story-strcuture.md` to get the story template.

Draft a full user story for the feature described in $ARGUMENTS. Use the
template structure exactly:
- User Story statement
- Acceptance Criteria (Given/When/Then scenarios)
- Edge Cases (5–8)
- Business Rules
- UI/UX Notes

Also include at the top:
```
**Draft Title**: {concise title}
**Type**: Story
**Priority**: Medium  (adjust if urgency is clear from description)
**Labels**: (leave blank — user to fill)
```

Print the full draft and ask:

> **Review this story draft.**
> - Type **approve** to create it in Jira and proceed
> - Type **change:** followed by what needs adjusting
> - Type **cancel** to stop

### B3 — Story review cycles

**If "change: …"** → revise the story draft. If the requested change has
implications (e.g. changes scope significantly, adds risk), flag it:
```
⚠ Note: {implication}. Still want to include this?
```
Show the revised draft and return to B3.

**If "approve"** → go to B4.

**If "cancel"** → stop.

### B4 — Create in Jira and save replica

1. Call `createJiraIssue` with the approved story content.
   Use the project key from existing tickets in `.ai/stories/` or ask the
   user if no existing tickets are found.

2. On success, Jira returns a ticket key (e.g. `PROJ-124`).

3. Save the story to `.ai/stories/{TICKET-ID}.md` using the replica format
   from `.ai/README.md`.

4. Print:
   ```
   ✅ Story created in Jira: {TICKET-ID}
   📋 Saved to .ai/stories/{TICKET-ID}.md
   ```

5. Continue from **A2** using the newly created ticket.

---

## General rules (apply to both scenarios)

- **Never** run `git add`, `git commit`, or `git push` without explicit user approval
- **Never** create a worktree or branch unless the user explicitly requests it
- **Always** read existing files before modifying them — never overwrite blindly
- **Always** use `pnpm scaffold` for new entities — never write scaffold files from scratch
- **Always** follow CLAUDE.md patterns — run internal `/review` checks on your own output
- **Never** leave TODO stubs from the scaffolder unfilled after implementation
- If the ticket is a **Bug** type (not Story/Task), skip the scaffold step and focus on the fix
- If you are uncertain about a requirement, add it to **Assumptions** in the plan and flag it rather than guessing silently
