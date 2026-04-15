# Data Fetching

Use `useQuery` from `@repo/frontend/hooks/useQuery` — never `@tanstack/react-query`'s `useQuery` directly.

**Pattern**: create a dedicated hook in `queries/` or `mutations/`:

```typescript
// queries/useGetProducts.ts
import { useMemo } from "react";
import { useQuery } from "@repo/frontend/hooks/useQuery";
import { ProductService } from "../services/product.service";

export const useGetProducts = () => {
  const service = useMemo(() => new ProductService(), []);
  return useQuery(service.getAll, [], { cacheKey: "products:all" });
};
```

`useQuery` returns `[data, isLoading, error, refetch]`.

- `cacheKey`: string — enables localStorage cache with TTL
- `ttl`: number (ms) — optional, defaults to no expiry
- Memoize service instances with `useMemo` to avoid recreation on re-renders
- Handle `isLoading` and `error` states in the consuming component
