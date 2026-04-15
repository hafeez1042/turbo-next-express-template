# Backend Folder Structure

```
services/core/src/
  config/           # DB, logger, swagger
  controllers/      # *.controller.ts — extend BaseController<T>
  services/         # *.service.ts    — extend BaseServices<T>
  repositories/     # *.repository.ts — extend BaseRepository<T>
  models/           # *.model.ts      — Sequelize Model classes
  routes/           # *.routes.ts     — Router instances, registered in app.ts
  middlewares/      # *.middleware.ts
  app.ts
```

File suffix naming is mandatory. Never use `index.ts` except for barrel re-exports.
