# Services

## Responsibility

- **Do**: Put all business logic in services.
- **Do**: Keep services pure and testable.
- **Don't**: Handle HTTP requests or responses in services (that's for controllers).

## Dependency Injection

- **Do**: Use dependency injection (or at least constructor injection) for dependencies like repositories.
- **Do**: Make services stateless (singleton scope usually works).

```typescript
// Bad
class UserService {
  async createUser(data) {
    // Direct dependency
    const repo = new UserRepository();
    ...
  }
}

// Good
class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(data) {
    ...
  }
}
```

## Error Handling

- **Do**: Throw custom application errors (e.g., `UserNotFoundException`) from services.
- **Don't**: Return `null` or `false` to indicate failure; throw an error instead.

```typescript
// Bad
if (!user) return null;

// Good
if (!user) throw new NotFoundError("User not found");
```
