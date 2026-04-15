# Next.js Folder Structure (App Router)

```
frontend/web/
  app/
    (group)/          # Route groups — no URL segment
      feature/
        page.tsx              # Minimal: metadata export + render FeaturePageContent
        FeaturePageContent.tsx # Actual UI — "use client" if interactive
        components/           # Components used only by this page
    layout.tsx
    page.tsx
  components/         # Shared components across pages
  services/           # *.service.ts — one per API resource
  queries/            # useGet*.ts — read hooks
  mutations/          # use*.ts — write hooks (create/update/delete)
  lib/                # Utility functions
```

- Route directories: `kebab-case`
- `page.tsx` only exports `metadata` and renders one `*PageContent` component — no logic
- `*PageContent.tsx` contains the actual page UI and data-fetching hooks
- `"use client"` only where needed (interactivity, hooks) — prefer server components for layout/static
