# React Components

- Functional components only; typed with explicit props interface (`IFooProps` or `FooProps`)
- Named exports (except `page.tsx` / `layout.tsx`)
- Destructure props; no `any` types
- Extract complex logic to custom hooks — keep component body lean
- Self-closing tags when no children; fragments `<>` over unnecessary `<div>` wrappers
- UI primitives come from `@repo/frontend/components/ui/*` (Radix-based) — don't re-implement
