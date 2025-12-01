# General Coding Standards

## Naming Conventions

### Variables and Functions

- **Do**: Use `camelCase` for variables and function names.
- **Do**: Use descriptive names that reveal intent.
- **Don't**: Use single-letter names (except for loop counters like `i`).
- **Don't**: Use abbreviations that are not universally understood.

```typescript
// Bad
const d = new Date();
const fn = (n: string) => console.log(n);

// Good
const currentDate = new Date();
const logName = (name: string) => console.log(name);
```

### Constants

- **Do**: Use `UPPER_SNAKE_CASE` for global constants and configuration values.
- **Do**: Use `camelCase` for constants that are objects or instances.

```typescript
// Bad
const max_retries = 3;

// Good
const MAX_RETRIES = 3;
const defaultConfiguration = { ... };
```

### Classes and Components

- **Do**: Use `PascalCase` for class names and React components.

```typescript
// Bad
class userService {}
const userProfile = () => <div />;

// Good
class UserService {}
const UserProfile = () => <div />;
```

### Interfaces, Types and Enums

- **Do**: Use `interface` for object shapes.
- **Do**: Use `type` for unions and intersections.
- **Do**: Use `enum` for sets of related constants.

```typescript
// Bad
interface User {
  name: string;
  age: number;
}

type User = {
  name: string;
  age: number;
};

enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

// Good
interface IUser {
  name: string;
  age: number;
}

type UserType = {
  name: string;
  age: number;
};

enum UserRoleEnum {
  ADMIN = "admin",
  USER = "user",
}
```

## Code Structure and Order

- **Do**: import from libraries first.
- **Do**: Then import from local files.
- **Do**: Only use named exports.
- **Do**: After import write the code that should be the main part of the files, and that should be the exported part.
- **Do**: All non exported code should be written after the exported code.

## Code Formatting

- **Do**: Use Prettier for automatic formatting.
- **Do**: Use 2 spaces for indentation.
- **Do**: Add a trailing comma in objects and arrays (ES5 compatible).
- **Do**: Use semicolons.

## Comments

- **Do**: Write comments that explain _why_, not _what_.
- **Don't**: Leave commented-out code. Delete it; version control will save it.
- **Don't**: Write comments that duplicate the code.

```typescript
// Bad
// Increment count by 1
count++;

// Good
// Adjust for 0-based indexing
const index = position - 1;
```

## Clean Code

- **Do**: Keep functions small and focused on a single task.
- **Do**: Use early returns to reduce nesting.
- **Don't**: Use magic numbers. Extract them to constants.

```typescript
// Bad
if (user.role === 1) { ... }

// Good
const ADMIN_ROLE_ID = 1;
if (user.role === ADMIN_ROLE_ID) { ... }
```
