Review the changed code in this project against the coding standards defined in CLAUDE.md and the rules/ directory. Produce a structured, actionable review.

## What to review

Determine scope in this order:
1. If $ARGUMENTS is a file path or glob — review only those files
2. If there are **staged changes** (`git diff --cached --name-only`) — review those
3. If there are **unstaged changes** (`git diff --name-only`) — review those
4. Otherwise — review all commits on this branch vs main (`git diff main...HEAD --name-only`)

If no changes are found, report: "Nothing to review — working tree is clean and branch is up to date with main."

## How to gather the code

1. Run `git diff --cached --name-only` and `git diff --name-only` to list changed files.
2. For each changed `.ts` / `.tsx` file:
   - Run `git diff HEAD -- <file>` (or `git diff --cached -- <file>` for staged) to see what changed
   - Read the **full file** with the Read tool — diff alone is not enough context to review correctly
3. Skip: `*.md`, `*.json`, `*.css`, lock files, `dist/`, `.next/`

## Checks to perform

For every changed file, check ALL of the following that apply. Be precise — reference the exact line number and the exact code.

---

### ARCH-1 — Layer violations (backend: `services/core/src/`)

| If file is in… | Must NOT import from… |
|---|---|
| `controllers/` | `../models/*` · `../repositories/*` · `sequelize` |
| `services/` | `../models/*` · `sequelize` |
| `routes/` | `../models/*` · `../repositories/*` · `../services/*` · `sequelize` |

Severity: **error**

---

### ARCH-2 — Missing base class extension

| File type | Must extend |
|---|---|
| `*.controller.ts` | `BaseController<T>` from `@repo/backend` |
| `*.service.ts` (backend) | `BaseServices<T>` from `@repo/backend` |
| `*.repository.ts` | `BaseRepository<T>` from `@repo/backend` |
| `*.service.ts` (frontend `services/`) | `AbstractServices<T>` from `@repo/frontend` |

Severity: **error**

---

### ARCH-3 — Types defined in the wrong package

Any `interface I*` or `enum *Enum` declared inside `services/core/` or `frontend/web/` (outside `packages/types/src/schema/`) is a violation. Types belong exclusively in `@repo/types`.

Severity: **error**

---

### ARCH-4 — Frontend data access violations

- `@tanstack/react-query` imported directly in `app/**` or `components/**` → must use `@repo/frontend/hooks/useQuery`
- `axios` imported directly in `app/**`, `components/**`, `queries/**`, or `mutations/**`
- A service (e.g. `userService.getAll()`) called directly inside a component body → must go through a hook in `queries/` or `mutations/`

Severity: **error**

---

### ARCH-5 — Wrong export style

- `export default` on a class or component **not** in `page.tsx` or `layout.tsx` → must be named export
- A class/component file with no export at all

Severity: **warning**

---

### ARCH-6 — File placement and suffix

- A controller not in `services/core/src/controllers/` or not named `*.controller.ts`
- A service not in the correct `services/` folder or not named `*.service.ts`
- A repository not named `*.repository.ts`
- A model not named `*.model.ts`
- A route file not named `*.routes.ts`
- A frontend query hook not in `queries/` or not named `use*.ts`
- A frontend mutation hook not in `mutations/` or not named `use*.ts`

Severity: **warning**

---

### ARCH-7 — Page structure (frontend `app/**`)

- `page.tsx` contains more than: `metadata` export + a single component render → should delegate to a `*PageContent.tsx`
- `*PageContent.tsx` missing when `page.tsx` has significant logic
- Query/mutation hooks called directly in `page.tsx` instead of in `*PageContent.tsx`

Severity: **warning**

---

### CONV-1 — Naming conventions

| Symbol | Required convention | Examples |
|---|---|---|
| Variables / functions | `camelCase` | `getUserById`, `isLoading` |
| Classes / components | `PascalCase` | `UserService`, `UserCard` |
| Interfaces | `I` prefix + PascalCase | `IUser`, `IProduct` |
| Enums | PascalCase + `Enum` suffix | `UserStatusEnum` |
| Constants (global) | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_BASE_URL` |
| Component files | `PascalCase.tsx` | `UserCard.tsx` |
| Non-component TS files | `camelCase.ts` | `user.service.ts`, `useGetUsers.ts` |
| Route directories | `kebab-case` | `app/user-profile/` |

Flag: wrong prefix/suffix/case on a symbol that is **defined** in the changed code (not just used).

Severity: **warning**

---

### CONV-2 — Import order

Library imports must come before local imports. Flag if local imports appear above library imports.

Severity: **info**

---

### CONV-3 — Comment quality

Flag comments that describe *what* the code does rather than *why*. Examples of bad comments:
- `// increment counter` above `count++`
- `// call userService.getAll` above `userService.getAll()`

Flag commented-out code blocks (`// const old = ...`).

Severity: **info**

---

### CONV-4 — Magic numbers / strings

Inline numeric or string literals used in logic (not in type definitions or Sequelize column definitions) without a named constant.

Severity: **info**

---

### CONV-5 — Function complexity

Functions longer than ~30 lines or with nesting deeper than 3 levels. Suggest extracting to helper functions.

Severity: **info**

---

### CONV-6 — Singleton pattern (backend)

Backend service and repository files must export a singleton instance:
```ts
export default new UserService();
```
If a file exports only the class without a singleton, flag it.

Severity: **warning**

---

## Output format

Use this exact structure:

```
## Code Review

**Scope**: <staged changes / unstaged changes / branch vs main / specific files>
**Files reviewed**: N

---

### Violations  🔴  (must fix before merge)

> **[ARCH-1]** `services/core/src/controllers/order.controller.ts:14`
> Controller imports Sequelize model directly: `import Order from "../models/order.model"`
> **Fix**: Remove the import. Access data via `orderService` which calls `orderRepository` internally.

> **[ARCH-3]** `services/core/src/services/order.service.ts:3`
> Interface `IOrderItem` defined inside services/core — types must live in `packages/types/src/schema/`
> **Fix**: Move `IOrderItem` to `packages/types/src/schema/order.ts` and import it here.

---

### Warnings  🟡  (should fix)

> **[ARCH-5]** `frontend/web/components/UserCard.tsx:1`
> `export default` used on a component that is not `page.tsx` or `layout.tsx`
> **Fix**: Change to `export const UserCard = ...`

---

### Info  🔵  (consider fixing)

> **[CONV-2]** `services/core/src/services/order.service.ts:2`
> Local import `../repositories/order.repository` appears before library import `sequelize`
> **Fix**: Move library imports to the top

---

### Passed ✅

List the checks that passed (one line each):
- ARCH-1: No layer violations found
- ARCH-2: All classes extend correct base class
- CONV-1: Naming conventions followed throughout
- ...

---

### Summary

| Severity | Count |
|---|---|
| 🔴 Violations (errors) | N |
| 🟡 Warnings | N |
| 🔵 Info | N |

**Verdict**: PASS / NEEDS WORK / BLOCKED
- PASS — no errors, warnings are minor
- NEEDS WORK — has warnings or info items worth addressing
- BLOCKED — has one or more errors that must be fixed before merging
```

## Important rules for the review

- **Only flag code that is in the diff** — do not report issues in unchanged lines
- **Read the full file** before flagging — a violation may be justified by context elsewhere in the file
- **Be specific** — always include file path, line number, the exact offending code, and a concrete fix
- **Do not flag TODO comments** left by the scaffolder (`// TODO: add fields`) — these are intentional stubs
- **Do not invent violations** — if you are not certain something is wrong, do not flag it
- If a file is new (scaffolded), only flag issues in lines the developer actually filled in, not the generated skeleton
