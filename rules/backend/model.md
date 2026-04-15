# Sequelize Model

- Extend `Model<IEntity, EntityCreationAttributes>` and implement the interface
- `CreationAttributes`: `Optional<IEntity, "id" | "created_at" | "updated_at">`
- Always set `underscored: true`, `paranoid: true` (soft delete) in `Model.init` options
- Explicit `tableName` (plural, snake_case)
- All `IBaseAttributes` fields (`id`, `created_by`, `updated_by`, `created_at`, `updated_at`) and `ISoftDeleteAttributes` fields (`deleted_at`, `deleted_by`) must be declared in the class body and in `init`
- Enum columns: `DataTypes.ENUM(...Object.values(FooEnum))`
- See `src/models/user.model.ts` as the canonical reference
