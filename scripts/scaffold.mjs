#!/usr/bin/env node
/**
 * Entity scaffolder — generates all boilerplate files for a new entity.
 * Usage: node scripts/scaffold.mjs <EntityName>
 * Example: node scripts/scaffold.mjs Product
 *          node scripts/scaffold.mjs blog-post
 *          node scripts/scaffold.mjs BlogPost
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(fileURLToPath(import.meta.url), "../..");

// ─── Name helpers ────────────────────────────────────────────────────────────

/** "blog-post" | "BlogPost" | "blog_post" → "BlogPost" */
function toPascal(s) {
  return s
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

/** "BlogPost" → "blogPost" */
function toCamel(s) {
  const p = toPascal(s);
  return p[0].toLowerCase() + p.slice(1);
}

/** "BlogPost" → "blog_post" */
function toSnake(s) {
  return toPascal(s)
    .replace(/([A-Z])/g, (c, _match, offset) => (offset ? "_" : "") + c.toLowerCase())
    .replace(/^_/, "");
}

/** Pluralise a PascalCase or snake_case word */
function toPlural(s) {
  if (/[^aeiou]y$/i.test(s)) return s.slice(0, -1) + "ies";
  if (/(s|x|z|ch|sh)$/i.test(s)) return s + "es";
  return s + "s";
}

// ─── Templates ───────────────────────────────────────────────────────────────

function typeTemplate(Pascal) {
  return `import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface I${Pascal} extends IBaseAttributes, ISoftDeleteAttributes {
  // TODO: add domain fields here
}

export enum ${Pascal}StatusEnum {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}
`;
}

function modelTemplate(Pascal, snake, tablePlural) {
  return `import { DataTypes, Model, Optional } from "sequelize";
import { I${Pascal} } from "@repo/types/src/schema/${snake}";
import sequelize from "../config/database";

interface ${Pascal}CreationAttributes
  extends Optional<I${Pascal}, "id" | "created_at" | "updated_at"> {}

class ${Pascal}
  extends Model<I${Pascal}, ${Pascal}CreationAttributes>
  implements I${Pascal}
{
  public id!: number;
  // TODO: declare typed fields matching I${Pascal}
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
    // TODO: add column definitions matching I${Pascal} fields
    // Example for a status enum field:
    //   status: {
    //     type: DataTypes.ENUM(...Object.values(${Pascal}StatusEnum)),
    //     defaultValue: ${Pascal}StatusEnum.ACTIVE,
    //   },
    created_by: { type: DataTypes.BIGINT },
    updated_by: { type: DataTypes.BIGINT },
    deleted_at: { type: DataTypes.DATE },
    deleted_by: { type: DataTypes.BIGINT },
  },
  { sequelize, tableName: "${tablePlural}", underscored: true, paranoid: true }
);

export default ${Pascal};
`;
}

function repositoryTemplate(Pascal, camel, snake) {
  return `import { Op, WhereOptions } from "sequelize";
import { BaseRepository } from "@repo/backend/lib/repositories/BaseRepository.sequelize";
import { I${Pascal} } from "@repo/types/src/schema/${snake}";
import ${Pascal} from "../models/${snake}.model";

export class ${Pascal}Repository extends BaseRepository<I${Pascal}> {
  constructor() {
    super(${Pascal} as any);
  }

  getSearchQuery = (searchText: string): WhereOptions<I${Pascal}> => {
    return {
      // TODO: add searchable fields, e.g.:
      // [Op.or]: [{ name: { [Op.iLike]: \`%\${searchText}%\` } }],
    };
  };
}

export default new ${Pascal}Repository();
`;
}

function serviceTemplate(Pascal, camel, snake) {
  return `import { BaseServices } from "@repo/backend/lib/services/BaseServices";
import { I${Pascal} } from "@repo/types/src/schema/${snake}";
import ${camel}Repository from "../repositories/${snake}.repository";

export class ${Pascal}Service extends BaseServices<I${Pascal}> {
  constructor() {
    super(${camel}Repository);
  }
}

export default new ${Pascal}Service();
`;
}

function controllerTemplate(Pascal, camel, snake) {
  return `import { BaseController } from "@repo/backend/lib/controller/BaseController";
import { I${Pascal} } from "@repo/types/src/schema/${snake}";
import ${camel}Service from "../services/${snake}.service";

class ${Pascal}Controller extends BaseController<I${Pascal}> {
  constructor() {
    super(${camel}Service);
  }
}

export const ${camel}Controller = new ${Pascal}Controller();
`;
}

function routesTemplate(Pascal, camel, snake, routePlural) {
  return `import { Router } from "express";
import { ${camel}Controller } from "../controllers/${snake}.controller";

const router: Router = Router();

router.get("/${routePlural}", ${camel}Controller.getAll);
router.get("/${routePlural}/:id", ${camel}Controller.getById);
router.post("/${routePlural}", ${camel}Controller.create);
router.put("/${routePlural}/:id", ${camel}Controller.update);
router.delete("/${routePlural}/:id", ${camel}Controller.delete);

export { router as ${camel}Routes };
`;
}

function frontendServiceTemplate(Pascal, camel, snake, routePlural) {
  return `import { AbstractServices } from "@repo/frontend/lib/AbstractService";
import { I${Pascal} } from "@repo/types/src/schema/${snake}";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export class ${Pascal}Service extends AbstractServices<I${Pascal}> {
  constructor() {
    super(\`\${API_BASE_URL}/${routePlural}\`);
  }
}

export const ${camel}Service = new ${Pascal}Service();
`;
}

function queryHookTemplate(Pascal, camel, snake, pascalPlural) {
  const camelPlural = camelCase(pascalPlural);
  return `import { useMemo } from "react";
import { useQuery } from "@repo/frontend/hooks/useQuery";
import { ${Pascal}Service } from "../services/${snake}.service";

export const useGet${pascalPlural} = () => {
  const service = useMemo(() => new ${Pascal}Service(), []);
  return useQuery(service.getAll, [], { cacheKey: "${camelPlural}:all" });
};

export const useGet${Pascal}ById = (id: string) => {
  const service = useMemo(() => new ${Pascal}Service(), []);
  return useQuery(service.getById, [id], { cacheKey: \`${camelPlural}:\${id}\` });
};
`;
}

function camelCase(pascal) {
  return pascal[0].toLowerCase() + pascal.slice(1);
}

// ─── File writing ─────────────────────────────────────────────────────────────

function write(filePath, content) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (existsSync(filePath)) {
    console.log(`  SKIP    ${rel(filePath)} (already exists)`);
    return false;
  }
  writeFileSync(filePath, content, "utf8");
  console.log(`  CREATE  ${rel(filePath)}`);
  return true;
}

function rel(p) {
  return p.replace(ROOT + "/", "").replace(ROOT + "\\", "");
}

// ─── Route index injection ────────────────────────────────────────────────────

function injectRoute(snake, camel) {
  const indexPath = join(ROOT, "services/core/src/routes/index.ts");
  if (!existsSync(indexPath)) {
    console.warn("  WARN    routes/index.ts not found — register the route manually");
    return;
  }

  const importLine = `import { ${camel}Routes } from "./${snake}.routes";`;
  const useLine = `routes.use(${camel}Routes);`;

  let src = readFileSync(indexPath, "utf8");

  if (src.includes(importLine)) {
    console.log("  SKIP    services/core/src/routes/index.ts (already registered)");
    return;
  }

  const lines = src.split("\n");

  // Insert import after the last import line
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trimStart().startsWith("import ")) lastImportIdx = i;
  }
  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx + 1, 0, importLine);
  }

  // Insert routes.use() after the last existing routes.use/get/post/put/delete line
  let lastRouteCallIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*routes\.(use|get|post|put|delete|patch)\(/.test(lines[i])) {
      lastRouteCallIdx = i;
    }
  }
  if (lastRouteCallIdx >= 0) {
    lines.splice(lastRouteCallIdx + 1, 0, useLine);
  } else {
    // Fall back: insert before export line
    const exportIdx = lines.findIndex((l) => l.trimStart().startsWith("export {"));
    if (exportIdx >= 0) lines.splice(exportIdx, 0, useLine);
  }

  writeFileSync(indexPath, lines.join("\n"), "utf8");
  console.log("  UPDATE  services/core/src/routes/index.ts");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const input = process.argv[2];
if (!input) {
  console.error("Usage:   node scripts/scaffold.mjs <EntityName>");
  console.error("Example: node scripts/scaffold.mjs Product");
  console.error("         node scripts/scaffold.mjs BlogPost");
  console.error("         node scripts/scaffold.mjs blog-post");
  process.exit(1);
}

const Pascal = toPascal(input);
const camel = toCamel(input);
const snake = toSnake(input);
const pascalPlural = toPlural(Pascal);
const tablePlural = toPlural(snake);
const routePlural = tablePlural.replace(/_/g, "-");

console.log(`
Scaffolding: ${Pascal}
  table  → ${tablePlural}
  route  → /${routePlural}
`);

write(join(ROOT, `packages/types/src/schema/${snake}.ts`),       typeTemplate(Pascal));
write(join(ROOT, `services/core/src/models/${snake}.model.ts`),  modelTemplate(Pascal, snake, tablePlural));
write(join(ROOT, `services/core/src/repositories/${snake}.repository.ts`), repositoryTemplate(Pascal, camel, snake));
write(join(ROOT, `services/core/src/services/${snake}.service.ts`),        serviceTemplate(Pascal, camel, snake));
write(join(ROOT, `services/core/src/controllers/${snake}.controller.ts`),  controllerTemplate(Pascal, camel, snake));
write(join(ROOT, `services/core/src/routes/${snake}.routes.ts`),           routesTemplate(Pascal, camel, snake, routePlural));
write(join(ROOT, `frontend/web/services/${snake}.service.ts`),             frontendServiceTemplate(Pascal, camel, snake, routePlural));
write(join(ROOT, `frontend/web/queries/useGet${Pascal}.ts`),               queryHookTemplate(Pascal, camel, snake, pascalPlural));

injectRoute(snake, camel);

console.log(`
Done. Next steps:
  1. Define fields in  packages/types/src/schema/${snake}.ts
  2. Mirror fields in  services/core/src/models/${snake}.model.ts
  3. Create a DB migration for the ${tablePlural} table
  4. pnpm build
`);
