# CLAUDE.md — Agent Development Guide

## Stack
- **Monorepo**: Turborepo + pnpm workspaces
- **Backend**: Express 5, Sequelize 6 (PostgreSQL), TypeScript — `services/core`
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Radix UI — `frontend/web`
- **Shared packages**: `@repo/types` (schemas), `@repo/backend` (base classes), `@repo/frontend` (base classes + UI)

---

## Monorepo Layout

```
packages/
  types/        # @repo/types   — all TypeScript interfaces & enums
  backend/      # @repo/backend — BaseController, BaseServices, BaseRepository
  frontend/     # @repo/frontend — AbstractServices, useQuery hook, Radix UI components
services/
  core/         # Express API — models, controllers, services, repositories, routes
    src/
      config/       # DB, logger, swagger
      controllers/  # *.controller.ts
      services/     # *.service.ts
      repositories/ # *.repository.ts
      models/       # *.model.ts
      routes/       # *.routes.ts
      middlewares/
      app.ts
frontend/
  web/          # Next.js app
    app/            # Routes (App Router)
    components/     # Shared UI components
    services/       # *.service.ts (extends AbstractServices)
    queries/        # use*.ts hooks (read operations)
    mutations/      # use*.ts hooks (write operations)
```

---

## Adding a New Entity — Canonical Workflow

**Always scaffold first:**
```bash
pnpm scaffold <EntityName>
# Example:
pnpm scaffold Product
pnpm scaffold BlogPost
```

This generates all 8 files and registers the route automatically. Then fill in the fields — do not write these files from scratch.

If scaffolding is not available, follow this exact sequence. Use `user` → `IUser` as the reference implementation.

### 1. Type — `packages/types/src/schema/<entity>.ts`

```typescript
import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface IProduct extends IBaseAttributes, ISoftDeleteAttributes {
  name: string;
  price: number;
  description?: string;
  status?: ProductStatusEnum;
}

export enum ProductStatusEnum {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}
```

Export from `packages/types/src/index.ts` if a barrel exists.

### 2. Model — `services/core/src/models/<entity>.model.ts`

```typescript
import { DataTypes, Model, Optional } from "sequelize";
import { IProduct, ProductStatusEnum } from "@repo/types/lib/schema/product";
import sequelize from "../config/database";

interface ProductCreationAttributes extends Optional<IProduct, "id" | "created_at" | "updated_at"> {}

class Product extends Model<IProduct, ProductCreationAttributes> implements IProduct {
  public id!: number;
  public name!: string;
  public price!: number;
  public description?: string;
  public status?: ProductStatusEnum;
  public created_by?: number;
  public updated_by?: number;
  public deleted_at?: Date;
  public deleted_by?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Product.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    description: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM(...Object.values(ProductStatusEnum)),
      defaultValue: ProductStatusEnum.ACTIVE,
    },
    created_by: { type: DataTypes.BIGINT },
    updated_by: { type: DataTypes.BIGINT },
    deleted_at: { type: DataTypes.DATE },
    deleted_by: { type: DataTypes.BIGINT },
  },
  { sequelize, tableName: "products", underscored: true, paranoid: true }
);

export default Product;
```

### 3. Repository — `services/core/src/repositories/<entity>.repository.ts`

```typescript
import { BaseRepository } from "@repo/backend/lib/repositories/BaseRepository.sequelize";
import { IProduct } from "@repo/types/lib/schema/product";
import { WhereOptions } from "sequelize";
import Product from "../models/product.model";

class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(Product as any);
  }

  getSearchQuery = (searchText: string): WhereOptions<IProduct> => ({
    // define search fields, e.g.: name: { [Op.iLike]: `%${searchText}%` }
  });
}

export default new ProductRepository();
```

### 4. Service — `services/core/src/services/<entity>.service.ts`

```typescript
import { BaseServices } from "@repo/backend/lib/services/BaseServices";
import { IProduct } from "@repo/types/lib/schema/product";
import productRepository from "../repositories/product.repository";

class ProductService extends BaseServices<IProduct> {
  constructor() {
    super(productRepository);
  }
}

export default new ProductService();
```

### 5. Controller — `services/core/src/controllers/<entity>.controller.ts`

```typescript
import { BaseController } from "@repo/backend/lib/controller/BaseController";
import { IProduct } from "@repo/types/lib/schema/product";
import productService from "../services/product.service";

class ProductController extends BaseController<IProduct> {
  constructor() {
    super(productService);
  }
}

export const productController = new ProductController();
```

### 6. Routes — `services/core/src/routes/<entity>.routes.ts`

```typescript
import { Router } from "express";
import { productController } from "../controllers/product.controller";

const router: Router = Router();

router.get("/products", productController.getAll);
router.get("/products/:id", productController.getById);
router.post("/products", productController.create);
router.put("/products/:id", productController.update);
router.delete("/products/:id", productController.delete);

export { router as productRoutes };
```

Register in `services/core/src/app.ts` alongside existing routes.

### 7. Frontend Service — `frontend/web/services/<entity>.service.ts`

```typescript
import { AbstractServices } from "@repo/frontend/lib/AbstractService";
import { IProduct } from "@repo/types/src/schema/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export class ProductService extends AbstractServices<IProduct> {
  constructor() {
    super(`${API_BASE_URL}/products`);
  }
}

export const productService = new ProductService();
```

### 8. Query Hook — `frontend/web/queries/useGet<Entity>.ts`

```typescript
import { useMemo } from "react";
import { useQuery } from "@repo/frontend/hooks/useQuery";
import { ProductService } from "../services/product.service";

export const useGetProducts = () => {
  const service = useMemo(() => new ProductService(), []);
  return useQuery(service.getAll, [], { cacheKey: "products:all" });
};

export const useGetProductById = (id: string) => {
  const service = useMemo(() => new ProductService(), []);
  return useQuery(service.getById, [id], { cacheKey: `products:${id}` });
};
```

### 9. Page — `frontend/web/app/<entity>/`

```
app/
  products/
    page.tsx                  # minimal: exports metadata + renders ProductsPageContent
    ProductsPageContent.tsx   # actual UI, uses query hooks
    components/               # page-specific components only
```

```typescript
// page.tsx
import { Metadata } from "next";
import { ProductsPageContent } from "./ProductsPageContent";

export const metadata: Metadata = { title: "Turbo App | Products" };

const page: React.FC = () => <ProductsPageContent />;
export default page;
```

```typescript
// ProductsPageContent.tsx
"use client";
import { useGetProducts } from "../../queries/useGetProducts";

export const ProductsPageContent: React.FC = () => {
  const [products, isLoading, error] = useGetProducts();
  // render UI
};
```

---

## Invariants — Never Break These

- **Always extend base classes**: controllers → `BaseController<T>`, services → `BaseServices<T>`, repositories → `BaseRepository<T>`, frontend services → `AbstractServices<T>`
- **Types live only in `@repo/types`** — never define entity interfaces in services/core or frontend/web
- **Never query the DB from a controller or route** — always go through service → repository
- **Never call fetch/axios directly in a component** — always via a service + query hook
- **`useQuery` from `@repo/frontend/hooks/useQuery`** — never use `@tanstack/react-query` `useQuery` directly
- **Named exports only** — no `export default` for classes/components (except Next.js page.tsx/layout.tsx which require default exports)
- **Singleton service instances** — export `new ProductService()` from the service file, import that instance in the controller
- **File suffixes are mandatory**: `*.controller.ts`, `*.service.ts`, `*.repository.ts`, `*.model.ts`, `*.routes.ts`

---

## Custom Methods (extending base CRUD)

Add custom methods directly to the class — do not override base methods unless necessary:

```typescript
// Backend service
class ProductService extends BaseServices<IProduct> {
  constructor() { super(productRepository); }

  getByCategory = async (category: string) => {
    return this.repository.getAll({ filter: { category: { eq: category } } });
  };
}

// Frontend service
export class ProductService extends AbstractServices<IProduct> {
  constructor() { super(`${API_BASE_URL}/products`); }

  getByCategory = async (category: string) =>
    this.http.get(`?category=${category}`).then(r => r.data.data);
}
```

---

## Architectural Enforcement (ESLint)

Violations of these rules are **hard lint errors** — CI will fail:

| File location | Forbidden imports | Reason |
|---|---|---|
| `src/controllers/**` | `../models/*`, `../repositories/*`, `sequelize` | Skip-layer violation |
| `src/services/**` | `../models/*`, `sequelize` | Skip-layer violation |
| `src/routes/**` | `../models/*`, `../repositories/*`, `../services/*`, `sequelize` | Routes → controllers only |
| `app/**`, `components/**` | `@tanstack/react-query`, `axios`, `../services/*.service` | Must use hooks |
| `queries/**`, `mutations/**` | `@tanstack/react-query`, `axios` | Must use `@repo/frontend/hooks/useQuery` |

Run `pnpm lint` to check. These rules enforce the layer diagram:

```
routes → controllers → services → repositories → models
                                                    ↑
                                               (Sequelize)

components → query/mutation hooks → services (AbstractServices) → API
```

## Stop — Red Flags

If you are about to do any of the following, **stop and reconsider**:

- Defining a TypeScript interface or enum outside `packages/types/src/schema/` — types belong only in `@repo/types`
- Writing a controller without `extends BaseController<T>` — always extend
- Writing a service without `extends BaseServices<T>` — always extend
- Writing a repository without `extends BaseRepository<T>` — always extend
- Importing a Sequelize model in a controller or service — go through the repository
- Using `import { useQuery } from "@tanstack/react-query"` in a component or hook — use `@repo/frontend/hooks/useQuery`
- Calling `fetch()` or importing `axios` directly in a component — use a service class
- Writing more than ~5 lines in a route file (beyond the standard CRUD registrations) — routes are thin
- Exporting a default from any file other than `page.tsx` / `layout.tsx`

---

## Conventions

| Thing | Convention |
|---|---|
| Variables / functions | `camelCase` |
| Classes / components / interfaces | `PascalCase` |
| Enums | `PascalCase` + `Enum` suffix (e.g. `UserStatusEnum`) |
| Interfaces | `I` prefix (e.g. `IUser`) |
| Constants | `UPPER_SNAKE_CASE` |
| Route directories | `kebab-case` |
| Component files | `PascalCase.tsx` |
| Non-component TS files | `camelCase.ts` |

- Imports: library imports first, then local imports
- 2-space indentation, semicolons, trailing commas
- Comments explain *why*, not *what* — omit obvious comments
- Early returns to reduce nesting

---

## Response Contract

All API responses follow `IAPIV1Response<T>` from `@repo/types`:

```typescript
{ version: "v1", success: boolean, data?: T, message?: string, errors?: string[] }
```

`BaseController` handles wrapping via `v1Response()` — never construct this manually in a controller.

---

## Query Params

`IQueryStringParams` (from `@repo/types`) supports: `q`, `filter`, `orderBy`, `order`, `limit`, `skip`, `cursor`, `expand`, `deleted`. Pass via `req.query.query` on the backend; `useQuery` hook handles serialization on the frontend.
