# Vite (React) Folder Structure

## Organization

- **Do**: Group by feature or type.
- **Do**: Keep the root `src` clean.

### Recommended Structure

```
src/
  assets/         # Static assets
  components/     # Shared components
    ui/           # UI library components (buttons, inputs)
    layout/       # Layout components
  hooks/          # Custom hooks
  pages/          # Page components (routed)
    dashboard/
      components/
        # all other components should be here that are specific to DashboardPageContent
      layout.tsx
      page.tsx    # Page component, only render DashboardPageContent
      DashboardPageContent.tsx # Page content component
  services/       # API services
  utils/          # Helper functions
  App.tsx         # Main app component
  main.tsx        # Entry point
```

## File Naming

- **Do**: Use `PascalCase` for component files (e.g., `Button.tsx`).
- **Do**: Use `camelCase` for non-component files (e.g., `useAuth.ts`, `api.ts`).
