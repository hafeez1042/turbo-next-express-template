# React Components

## Definition

- **Do**: Use functional components with hooks.
- **Do**: Use named exports.
- **Don't**: Use class components (unless absolutely necessary for Error Boundaries).

```typescript
// Bad
const Button = (props) => <button>{props.label}</button>;
export default Button;

// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button = ({ label, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
};
```

## Hooks

- **Do**: Follow the Rules of Hooks (top level only).
- **Do**: Create custom hooks for complex logic.
- **Don't**: Put too much logic inside the component body; extract it.

## Props

- **Do**: Type props explicitly using interfaces or types.
- **Do**: Destructure props for better readability.
- **Don't**: Use `any` for props.

## JSX

- **Do**: Use self-closing tags when there are no children.
- **Do**: Use fragments `<>` instead of `div` wrappers where possible to avoid DOM bloat.
