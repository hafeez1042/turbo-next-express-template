# Backend Folder Structure

## Organization

- **Do**: Organize by technical role (MVC-ish) or domain (Feature-based), but be consistent.
- **Do**: Keep related files together.

### Recommended Structure (Service-based)

```
src/
  config/         # Configuration files (DB, env, etc.)
  controllers/    # Request handlers
  middlewares/    # Express middlewares
  models/         # Database models (Sequelize/Mongoose)
  routes/         # Route definitions
  services/       # Business logic
  utils/          # Helper functions
  app.ts          # App entry point
```

## File Naming

- **Do**: Use suffixes to indicate file type.
  - `*.controller.ts`
  - `*.service.ts`
  - `*.routes.ts`
  - `*.model.ts`
  - `*.middleware.ts`

- **Don't**: Use generic names like `index.ts` everywhere, except for barrel exports.

```typescript
// Bad
controllers / user / index.ts;
services / user / index.ts;

// Good
controllers / user.controller.ts;
services / user.service.ts;
```
