---
trigger: model_decision
description: use this when creating a react context and provider
---

# React Context Provider Rules

## Structure and Order (Mandatory)
1. Import statements
2. Context type definitions (interfaces, enums, etc.)
3. createContext call
4. Provider component definition
5. Custom hook (useXContext) definition
6. Export statements for Provider and Hook only

## File Naming and Organization
- File name must match Provider component name (Example: ExampleProvider.tsx).
- Separate context files must exist per domain.
- Place the context file inside a folder named after the feature it serves.
- Custom hook stays in the same file or in a separate hooks folder if reused across modules.

## createContext Usage
- Do not hardcode placeholder defaults for every property.
- Use undefined as default so runtime detection is possible.
- Context type must always be explicit.

Correct default:
createContext<ContextType | undefined>(undefined)

## Custom Hook Requirements
- Use a custom hook for access: useExampleContext.
- Throw descriptive error if used without a Provider.
- Provide clean passthrough of values.

Error guard example:
if (!ctx) throw new Error("useExampleContext must be used within ExampleProvider")

## Types and Interfaces
- Strongly type all fields.
- Optional only when runtime can allow undefined.
- Use readonly when state is not meant to be mutated by consumers.

## State and Behavior Management
- Store state using useState or useReducer.
- Fetching or async actions must be wrapped in custom hooks if needed.
- Functions that update state must be stable or memoized.

## useMemo and Performance Rules
- Provider value must be wrapped in useMemo.
- Dependency array must include all referenced values.
- Avoid inline objects or functions in JSX return.

## Error Handling Guidelines
- Expose loading and error values for async operations.
- No silent failures.

## Commenting and Documentation
- JSDoc is required for Provider, context type, and custom hook.
- Document the purpose and expectations for context consumers.

## Linting and Code Quality
- Disallow any.
- Enforce exhaustive-deps rule for useMemo and useCallback.
- Do not allow direct mutation of context state by consumers.

## Export Rules
- Only export the Provider, custom hook, and types if necessary.
- Do not export raw context unless required for advanced usage.

---

# Simple Sample Code

```tsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  PropsWithChildren
} from "react";

interface ExampleContextType {
  count: number;
  increment: () => void;
}

const ExampleContext = createContext<ExampleContextType | undefined>(undefined);

export const ExampleProvider: React.FC<PropsWithChildren<IProps>> = ({ children }) => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);

  const value = useMemo(
    () => ({ count, increment }),
    [count, increment]
  );

  return (
    <ExampleContext.Provider value={value}>
      {children}
    </ExampleContext.Provider>
  );
}

interface IProps {}

export function useExampleContext() {
  const ctx = useContext(ExampleContext);
  if (!ctx) {
    throw new Error("useExampleContext must be used within ExampleProvider");
  }
  return ctx;
}