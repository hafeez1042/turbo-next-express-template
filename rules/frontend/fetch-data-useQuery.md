# Data Fetching

## Usage

- **Do**: Use custom hooks for all queries and mutations.
- **Do**: Use query keys factories or constants to avoid key collisions.
- **Don't**: Call `useQuery` directly in components with inline fetch functions.

```typescript
// Bad
// Don't use standard useQuery directly or inline fetch
const { data } = useQuery(["users"], () =>
  fetch("/api/users").then((res) => res.json())
);

// Good
// queries/useGetUsers.ts
import { UserService } from "@/services/user.service";
import { useQuery } from "@repo/frontend/hooks/useQuery";
import { useMemo } from "react";

export const useGetUsers = () => {
  // Memoize service to avoid recreation
  const userService = useMemo(() => new UserService(), []);

  // Use the custom wrapper from @repo/frontend
  return useQuery(userService.getAll, [], {
    cacheKey: "users:all",
    ttl: 10 * 1000, // Custom TTL option
  });
};
```

## Error Handling

- **Do**: Handle errors in the UI (e.g., using `isError` or Error Boundaries).
- **Do**: Configure global error handling for generic errors (like 401 Unauthorized).

## Stale Time and Caching

- **Do**: Set appropriate `staleTime` to avoid unnecessary refetches.
- **Do**: Use `invalidateQueries` for mutations to refresh data.
