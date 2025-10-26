---
trigger: model_decision
description: General monorepo rules, task routing, and coding practices for this repo
---

# Windsurf General Rules

- **Follow existing specialized rules**
  - For React components: .windsurf/rules/react-components.md
  - For React contexts: .windsurf/rules/react-context.md
  - For frontend APIs and queries (apps/web): .windsurf/rules/frontend-api.md

## Monorepo layout and responsibilities
- **apps/server**: Express API app. Wire HTTP (routes, middleware, swagger). Delegate domain logic to packages.
- **apps/web**: Frontend web app using Vite. Consumes UI from @repo/frontend; no backend logic.
- **packages/frontend (@repo/frontend)**: Reusable UI library (Tailwind/shadcn). Presentational-only. No data fetching or business logic.
- **packages/backend (@repo/backend)**: Reusable backend domain code (errors, middleware, services, repositories, utils). No Express app wiring here.
- **packages/shared (@repo/shared)**: Cross-cutting utilities that are runtime-agnostic.
- **packages/types (@repo/types)**: Shared TS types and JSON schema generation.
- **packages/typescript-config & eslint-config**: Centralized configs to extend in packages/apps.

## Where to put new code
- **New API endpoint**: apps/server/src/routes → call services in @repo/backend.
- **Domain/service/repository logic**: packages/backend/src/**.
- **Shared types**: packages/types/src/** (and regenerate schema if needed).
- **UI component**: packages/frontend/src/components/** (named export, presentational).
- **UI hook/state**: packages/frontend/src/hooks/** (logic lives in hooks, not components).
- **Shared util**: packages/shared/src/**.

## Import/Export rules
- **Import order**: external libs → @repo/* packages → local files.
- **No default exports**. Use named exports only (aligns with component rules).
- **Do not deep-import internals**. Import from package entrypoints or declared export paths in package.json.

## TypeScript conventions
- **Strict types**: no any; prefer specific types; enable readonly where applicable.
- **Configs**: extend from @repo/typescript-config.
  - React libs: react-library.json
  - Node libs: nodejs.json
  - Root/others: base.json
- **Project setup**: ensure parserOptions.project points to the correct tsconfig.lint.json where used.

## Linting and formatting
- **ESLint**: extend @repo/eslint-config; fix all errors; packages often run with --max-warnings 0.
- **Prettier**: use root script: pnpm format.
- **CI/local**: run pnpm turbo lint before commits.

## Build and dev
- **Turbo**: use pnpm build/dev/lint at root (turbo orchestrates).
- **Server dev**: apps/server scripts handle watch (tsc + nodemon).
- **Outputs**: respect turbo.json outputs config for caching.

## React + Tailwind practices (frontend)
- **Presentational components** only; stateful logic in hooks.
- **Class merging**: use cn from src/lib/utils.
- **Styling**: Tailwind classes; avoid inline styles.

## Server patterns (apps/server)
- **Middleware**: reuse @repo/backend middlewares (morgan, timezone, errors).
- **Errors**: throw typed errors from @repo/backend/errors; let errorHandler handle responses.
- **Swagger**: update swagger spec when adding/changing endpoints.
- **Security**: keep helmet, CORS, and IP allowlist behavior consistent.

## Environment and secrets
- **.env**: never commit; turbo watches **/.env.*local. Keep app-specific vars in apps/server.

## Commit scope (guidance)
- **Scope by package/app**. Cross-cutting changes should be split per package when feasible.