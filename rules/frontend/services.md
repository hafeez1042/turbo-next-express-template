# Frontend Services

## Purpose

- **Do**: Use services to encapsulate API calls.
- **Do**: Return typed responses.
- **Don't**: Mix UI logic with API calls.

## Implementation

- **Do**: Use a shared HTTP client (like Axios instance) with interceptors.
- **Do**: Define return types for all methods.

```typescript
// Bad
const getUsers = async () => {
  const res = await fetch("/api/users");
  return res.json();
};

// Good
import { AbstractServices } from "@repo/frontend/lib/AbstractService";
import { IUser } from "@repo/types/src/schema/user";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export class UserService extends AbstractServices<IUser> {
  constructor() {
    super(`${API_BASE_URL}/users`);
  }

  // Custom methods extending the base CRUD
  getUsersByRole = async (role: string) => {
    const response = await this.http.get(`?role=${role}`);
    return response.data.data;
  };
}

export const userService = new UserService();
```

## Organization

- **Do**: Group services by domain (e.g., `auth.service.ts`, `user.service.ts`).
- **Do**: Keep them in a `services/` directory.
