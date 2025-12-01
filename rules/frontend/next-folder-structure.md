# Next.js Folder Structure (App Router)

## Organization

- **Do**: Use the `app` directory for routes and pages.
- **Do**: Colocate components, styles, and tests with their features if possible.

### Recommended Structure

```
src/
  app/
    (auth)/       # Route groups
      login/
        page.tsx
    dashboard/
      components/
        # all other components should be here that are specific to DashboardPageContent
      layout.tsx
      page.tsx    # Page component, only render DashboardPageContent
      DashboardPageContent.tsx # Page content component
    layout.tsx    # Root layout
    page.tsx      # Home page
  components/     # Shared components
  lib/            # Utility functions and libraries
  services/       # API services
  styles/         # Global styles
  queries/        # Data fetching query hooks using useQuery
  mutations/      # Data mutation mutation hooks using useMutation
```

## File Naming

- **Do**: Follow Next.js conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- **Do**: Use `kebab-case` for route directories.
