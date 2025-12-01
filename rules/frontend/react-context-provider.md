# React Context Providers

## Usage

- **Do**: Use Context for global state that changes infrequently (theme, auth user).
- **Don't**: Use Context for high-frequency updates (use a state management library like Zustand or Redux instead).

## Implementation

- **Do**: Create a custom provider component.
- **Do**: Create a custom hook to consume the context.
- **Don't**: Export the Context object directly; export the hook.

```typescript
// Bad
export const UserContext = createContext();

// Good
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  ...
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
```
