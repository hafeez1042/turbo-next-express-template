#!/usr/bin/env node
/**
 * Entity scaffolder — generates all boilerplate files for a new entity.
 * Usage: node scripts/scaffold.mjs <EntityName>
 * Example: node scripts/scaffold.mjs Product
 *          node scripts/scaffold.mjs blog-post
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(fileURLToPath(import.meta.url), "../..");

// ─── Name helpers ────────────────────────────────────────────────────────────

function toPascal(s) {
  return s.replace(/[-_](.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (_, c) => c.toUpperCase());
}
function toCamel(s) {
  const p = toPascal(s);
  return p[0].toLowerCase() + p.slice(1);
}
function toSnake(s) {
  return toPascal(s).replace(/([A-Z])/g, (_, c, i) => (i ? "_" : "") + c.toLowerCase());
}
function toPlural(s) {
  if (s.endsWith("y")) return s.slice(0, -1) + "ies";
  if (/[sxz]$/.test(s) || /[sc]h$/.test(s)) return s + "es";
  return s + "s";
}

// ─── Templates ───────────────────────────────────────────────────────────────

function typeTemplate(Pascal, snake) {
  return `import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface I${Pascal} extends IBaseAttributes, ISoftDeleteAttributes {
  // TODO: add fields
}

export enum ${Pascal}StatusEnum {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}
`;
}

function modelTemplate(Pascal, camel, snake, plural) {
  return `import { DataTypes, Model, Optional } from "sequelize";
import { I${Pascal}, ${Pascal}StatusEnum } from "@repo/types/lib/schema/${snake}";
import sequelize from "../config/database";

interface ${Pascal}CreationAttributes extends Optional<I${Pascal}, "id" | "created_at" | "updated_at"> {}

class ${Pascal} extends Model<I${Pascal}, ${Pascal}CreationAttributes> implements I${Pascal} {
  public id!: number;
  // TODO: declare typed fields here
  public created_by?: number;
  public updated_by?: number;
  public deleted_at?: Date;
  public deleted_by?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

${Pascal}.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    // TODO: define columns matching I${Pascal} fields
    created_by: { type: DataTypes.BIGINT },
    updated_by: { type: DataTypes.BIGINT },
    deleted_at: { type: DataTypes.DATE },
    deleted_by: { type: DataTypes.BIGINT },
  },
  { sequelize, tableName: "${plural}", underscored: true, paranoid: true }
);

export default ${Pascal};
`;
}

function repositoryTemplate(Pascal, camel, snake) {
  return `import { WhereOptions } from "sequelize";
import { BaseRepository } from "@repo/backend/lib/repositories/BaseRepository.sequelize";
import { I${Pascal} } from "@repo/types/lib/schema/${snake}";
import ${Pascal} from "../models/${snake}.model";

class ${Pascal}Repository extends BaseRepository<I${Pascal}> {
  constructor() {
    super(${Pascal} as any);
  }

  getSearchQuery = (searchText: string): WhereOptions<I${Pascal}> => ({
    // TODO: add searchable fields, e.g. { name: { [Op.iLike]: \`%\${searchText}%\` } }
  });
}

export default new ${Pascal}Repository();
`;
}

function serviceTemplate(Pascal, camel, snake) {
  return `import { BaseServices } from "@repo/backend/lib/services/BaseServices";
import { I${Pascal} } from "@repo/types/lib/schema/${snake}";
import ${camel}Repository from "../repositories/${snake}.repository";

class ${Pascal}Service extends BaseServices<I${Pascal}> {
  constructor() {
    super(${camel}Repository);
  }
}

export default new ${Pascal}Service();
`;
}

function controllerTemplate(Pascal, camel, snake) {
  return `import { BaseController } from "@repo/backend/lib/controller/BaseController";
import { I${Pascal} } from "@repo/types/lib/schema/${snake}";
import ${camel}Service from "../services/${snake}.service";

class ${Pascal}Controller extends BaseController<I${Pascal}> {
  constructor() {
    super(${camel}Service);
  }
}

export const ${camel}Controller = new ${Pascal}Controller();
`;
}

function routesTemplate(Pascal, camel, snake, plural) {
  return `import { Router } from "express";
import { ${camel}Controller } from "../controllers/${snake}.controller";

const router: Router = Router();

router.get("/${plural}", ${camel}Controller.getAll);
router.get("/${plural}/:id", ${camel}Controller.getById);
router.post("/${plural}", ${camel}Controller.create);
router.put("/${plural}/:id", ${camel}Controller.update);
router.delete("/${plural}/:id", ${camel}Controller.delete);

export { router as ${camel}Routes };
`;
}

function frontendServiceTemplate(Pascal, camel, snake, plural) {
  return `import { AbstractServices } from "@repo/frontend/lib/AbstractService";
import { I${Pascal} } from "@repo/types/src/schema/${snake}";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export class ${Pascal}Service extends AbstractServices<I${Pascal}> {
  constructor() {
    super(\`\${API_BASE_URL}/${plural}\`);
  }
}

export const ${camel}Service = new ${Pascal}Service();
`;
}

function queryHookTemplate(Pascal, camel, snake) {
  return `import { useMemo } from "react";
import { useQuery } from "@repo/frontend/hooks/useQuery";
import { ${Pascal}Service } from "../services/${snake}.service";

export const useGet${Pascal}s = () => {
  const service = useMemo(() => new ${Pascal}Service(), []);
  return useQuery(service.getAll, [], { cacheKey: "${camel}s:all" });
};

export const useGet${Pascal}ById = (id: string) => {
  const service = useMemo(() => new ${Pascal}Service(), []);
  return useQuery(service.getById, [id], { cacheKey: \`${camel}s:\${id}\` });
};
`;
}

// ─── File writing ─────────────────────────────────────────────────────────────

function write(filePath, content) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (existsSync(filePath)) {
    console.error(`  SKIP  ${filePath.replace(ROOT, "")} (already exists)`);
    return false;
  }
  writeFileSync(filePath, content, "utf8");
  console.log(`  CREATE  ${filePath.replace(ROOT + "/", "")}`);
  return true;
}

// ─── Route index injection ────────────────────────────────────────────────────

function injectRoute(snake, camel) {
  const indexPath = join(ROOT, "services/core/src/routes/index.ts");
  if (!existsSync(indexPath)) {
    console.warn("  WARN  routes/index.ts not found — add the route manually");
    return;
  }

  let src = readFileSync(indexPath, "utf8");

  const importLine = `import { ${camel}Routes } from "./${snake}.routes";`;
  const useLine = `routes.use(${camel}Routes);`;

  if (src.includes(importLine)) {
    console.log("  SKIP  routes/index.ts (route already registered)");
    return;
  }

  // Insert import after the last import statement
  src = src.replace(
    /(import[^;]+;)\s*(\n(?!import))/,
    (_, lastImport, after) => `${lastImport}\n${importLine}${after}`
  );

  // Insert routes.use() before the export line
  src = src.replace(
    /(\nexport\s*\{)/,
    `\n${useLine}$1`
  );

  writeFileSync(indexPath, src, "utf8");
  console.log("  UPDATE  services/core/src/routes/index.ts");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/scaffold.mjs <EntityName>");
  console.error("Example: node scripts/scaffold.mjs Product");
  process.exit(1);
}

const Pascal = toPascal(input);
const camel = toCamel(input);
const snake = toSnake(input);
const plural = toPlural(snake.replace(/_/g, "-")).replace(/-/g, "_").replace(/_/g, "-");

// Use kebab-case for route paths and snake_case table names
const routePlural = toPlural(snake).replace(/_/g, "-");
const tablePlural = toPlural(snake);

console.log(`\nScaffolding entity: ${Pascal} (table: ${tablePlural}, route: /${routePlural})\n`);

write(join(ROOT, `packages/types/src/schema/${snake}.ts`), typeTemplate(Pascal, snake));
write(join(ROOT, `services/core/src/models/${snake}.model.ts`), modelTemplate(Pascal, camel, snake, tablePlural));
write(join(ROOT, `services/core/src/repositories/${snake}.repository.ts`), repositoryTemplate(Pascal, camel, snake));
write(join(ROOT, `services/core/src/services/${snake}.service.ts`), serviceTemplate(Pascal, camel, snake));
write(join(ROOT, `services/core/src/controllers/${snake}.controller.ts`), controllerTemplate(Pascal, camel, snake));
write(join(ROOT, `services/core/src/routes/${snake}.routes.ts`), routesTemplate(Pascal, camel, snake, routePlural));
write(join(ROOT, `frontend/web/services/${snake}.service.ts`), frontendServiceTemplate(Pascal, camel, snake, routePlural));
write(join(ROOT, `frontend/web/queries/useGet${Pascal}.ts`), queryHookTemplate(Pascal, camel, snake));

injectRoute(snake, camel);

console.log(`
Done! Next steps:
  1. Add fields to  packages/types/src/schema/${snake}.ts
  2. Mirror fields in services/core/src/models/${snake}.model.ts
  3. Run migrations or sync the DB
  4. Build: pnpm build
`);
