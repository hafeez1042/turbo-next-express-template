# Database Models (Sequelize)

## Definition

- **Do**: Define models using `sequelize-typescript` decorators or standard `sequelize.define`.
- **Do**: Use singular names for models (e.g., `User`, `Post`).
- **Do**: Define table names explicitly if they don't follow the default pluralization.

```typescript
// Bad
@Table({ tableName: "user_table" })
class Users extends Model {}

// Good
@Table({ tableName: "users" })
class User extends Model {}
```

## Associations

- **Do**: Define associations clearly in the model.
- **Do**: Use foreign keys with consistent naming (e.g., `userId`, `postId`).
- **Don't**: Rely on implicit foreign key names if they are ambiguous.

## Validation

- **Do**: Use Sequelize validators for data integrity.
- **Don't**: Rely solely on database constraints; validate at the application level too.

```typescript
// Good
@Column({
  validate: {
    isEmail: true
  }
})
email: string;
```
