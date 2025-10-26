---
trigger: model_decision
description: Use this when implementing frontend API access (services + query hooks) in apps/web
---

# Frontend API and Query Rules (apps/web)

- **Purpose**: Standardize how the frontend calls APIs using a service + query-hook pattern.
- **Core building blocks**:
  - `useQuery` hook: packages/frontend/src/hooks/useQuery.ts
  - `AbstractServices` base class: packages/frontend/src/lib/AbstractService.ts

## Directory and naming
- **Services (required)**
  - Location: apps/web/src/service
  - File: <APIName>Services.ts
  - Class: `export class <APIName>Services extends AbstractServices { ... }`
- **Query hooks (required for GET)**
  - Location: apps/web/src/queries
  - File: useGet<ServiceName>.ts
  - Hook name: `useGet<ServiceName>`

## Service pattern (apps/web/src/service/<APIName>Services.ts)
- **Extend** `AbstractServices<T, TGetAll, TCreate, TGetByID, TUpdate>` from @repo/frontend/src/lib/AbstractService.ts
- **Constructor** must call `super(baseUrl, accessToken)` to initialize Axios instance.
- **Default methods available**: `getAll`, `getById`, `create`, `update`, `delete`.
- Add domain-specific helpers as needed (e.g., `getActive`, `search`, etc.) but funnel HTTP calls through the inherited client.

## Query hook pattern (apps/web/src/queries/useGet<ServiceName>.ts)
- Use the `useQuery` hook from packages/frontend/src/hooks/useQuery.ts.
- Initialize the appropriate `<APIName>Services` instance (memoize if needed).
- Pass the service method to `useQuery` (e.g., `service.getAll`, `service.getById`).
- Provide a stable `deps` array and a stable `cacheKey` that includes the service and inputs.
- Use `params` to pass method arguments to `useQuery`.
- Use `mutator` only for light shaping; avoid heavy business logic inside hooks.

## Minimal examples (illustrative)

Service (Users):
```ts
// apps/web/src/service/UsersServices.ts
import { AbstractServices } from "packages/frontend/src/lib/AbstractService";

export class UsersServices extends AbstractServices<IUser> {
  constructor(baseUrl: string) {
    super(`/users`);
  }
  // Optional domain helpers; base methods exist already
  // getActive = () => this.getAll({ filter: { active: true } });
}
```

Query hook (read list):
```ts
// apps/web/src/queries/useGetUsers.ts
import { useMemo } from "react";
import { useQuery } from "packages/frontend/src/hooks/useQuery";
import { UsersServices } from "../service/UsersServices";
import { getAccessToken } from "packages/frontend/src/lib/accessToken";

export function useGetUsers() {
  const service = useMemo(() => new UsersServices(), []);

  const [data, loading, error, refetch] = useQuery(
    service.getAll,
    [baseUrl, token],
    {
      cacheKey: `users:getAll`,
      ttl: 30 * 000,
    }
  );

  return { data, loading, error, refetch };
}
```

Query hook (read by id):
```ts
// apps/web/src/queries/useGetUser.ts
import { useMemo } from "react";
import { useQuery } from "packages/frontend/src/hooks/useQuery";
import { getAccessToken } from "packages/frontend/src/lib/accessToken";
import { UsersServices } from "../service/UsersServices";

export function useGetUser(id: string) {
  const service = useMemo(() => new UsersServices(), []);

  return useQuery(
    service.getById,
    [id],
    {
      params: [id],
      cacheKey: `users:getById:${id}`,
      ttl: 30 * 000,
      resetOnDepChange: true,
    }
  );
}
```

## Do and Don’t
- Do: Create one dedicated query hook file per GET operation under apps/web/src/queries named `useGet<ServiceName>`.
- Do: Keep service classes the single place for API endpoints and base URLs.
- Do: Use `cacheKey` + `ttl` for caching via `useQuery`.
- Don’t: Call `fetch`/axios directly from components.
- Don’t: Put business logic in components or query hooks; keep it in services.
- Don’t: Default-export query hooks or services; use named exports.

## Error handling
- `AbstractServices` throws `APIError` with response data.
- Provide `onError` to `useQuery` to handle toasts/logging in the UI.