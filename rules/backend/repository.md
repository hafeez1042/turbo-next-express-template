# Repository Pattern

## Purpose

- **Do**: Use repositories to abstract database operations.
- **Do**: Keep all SQL/ORM queries within repositories.
- **Don't**: Leak database implementation details (like Sequelize instances) to the service layer.

## Implementation

- **Do**: Create a repository for each aggregate root or major entity.
- **Do**: Return plain objects or domain entities, not ORM instances, if possible (to decouple).

```typescript
// Bad
// In Service
const user = await User.findOne({ where: { id } });

// Good
// In Repository
async findById(id: string): Promise<User | null> {
  return User.findByPk(id);
}

// In Service
const user = await userRepository.findById(id);
```

## Naming

- **Do**: Suffix class names with `Repository` (e.g., `UserRepository`).
- **Do**: Use method names like `find`, `create`, `update`, `delete`.
