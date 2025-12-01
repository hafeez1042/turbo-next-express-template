# Express.js Coding Standards

## Routing

- **Do**: Use `express.Router()` to modularize routes.
- **Do**: Group routes by resource (e.g., `/users`, `/posts`).
- **Don't**: Define all routes in the main application file.

```typescript
// Bad
app.get('/users', ...);
app.get('/users/:id', ...);

// Good
// routes/user.routes.ts
const router = Router();
router.get('/', ...);
router.get('/:id', ...);
export default router;
```

## Middleware

- **Do**: Use middleware for cross-cutting concerns (auth, logging, validation).
- **Do**: Keep middleware functions small and focused.
- **Don't**: Put business logic inside middleware.

```typescript
// Bad
const authMiddleware = (req, res, next) => {
  // Complex user validation logic here
  // Database calls, etc.
};

// Good
const authMiddleware = (req, res, next) => {
  // Check token validity
  next();
};
```

## Controllers

- **Do**: Keep controllers thin. They should only handle HTTP requests and responses.
- **Do**: Delegate business logic to Services.
- **Don't**: Perform database operations directly in controllers.

```typescript
// Bad
const getUser = async (req, res) => {
  const user = await UserModel.findOne({ where: { id: req.params.id } });
  res.json(user);
};

// Good
const getUser = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json(user);
};
```

## Error Handling

- **Do**: Use a global error handling middleware.
- **Do**: Pass errors to `next(err)` in async handlers.
- **Don't**: Swallow errors or just `console.error` them without responding to the client.

```typescript
// Bad
try {
  ...
} catch (err) {
  console.log(err);
}

// Good
try {
  ...
} catch (err) {
  next(err);
}
```
