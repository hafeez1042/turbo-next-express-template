Run the entity scaffolder for this project and guide the user through completing the generated files.

## Steps

1. **Parse the entity name** from $ARGUMENTS. If empty, stop and tell the user: `Usage: /scaffold <EntityName>  e.g. /scaffold Product`

2. **Run the scaffold script**:
   ```
   pnpm scaffold <EntityName>
   ```
   Show the output. If it fails, diagnose and fix before continuing.

3. **Read the generated type file** at `packages/types/src/schema/<snake_case>.ts`.

4. **Ask the user** (single question): "What fields does `<EntityName>` need? List them with their types, e.g.: `name: string, price: number, description?: string, status?: <EntityName>StatusEnum`"

5. **Update the type file** — replace the `// TODO: add domain fields here` comment with the actual fields the user described. Keep the `StatusEnum` at the bottom of the file; update its values if the user specified custom ones.

6. **Update the model file** at `services/core/src/models/<snake_case>.model.ts`:
   - Add public field declarations to the class body (between `public id!: number;` and `public created_by?`)
   - Add the matching `DataTypes` column definitions in `Model.init()` (between the `id` column and `created_by`)
   - Use the correct `DataTypes` mapping:
     - `string` → `DataTypes.TEXT` (or `DataTypes.STRING(n)` if length matters)
     - `number` (integer) → `DataTypes.INTEGER` or `DataTypes.BIGINT`
     - `number` (decimal) → `DataTypes.DECIMAL(10, 2)`
     - `boolean` → `DataTypes.BOOLEAN`
     - `Date` → `DataTypes.DATE`
     - `FooEnum` → `DataTypes.ENUM(...Object.values(FooEnum))` — also add the enum import at the top
   - If there is a status field using the `StatusEnum`, import it and add `defaultValue: <EntityName>StatusEnum.ACTIVE`

7. **Print a completion summary** showing:
   - All 8 created files (with clickable relative paths)
   - The route that was registered: `GET|POST|PUT|DELETE /api/v1/<plural>`
   - Reminder: "Create a DB migration for the `<table>` table before running"
