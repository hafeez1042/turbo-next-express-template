---
trigger: model_decision
description: use this when creating a react component
---

# React Component Structure Rules (Simple UI Components)

This guideline defines the structure and standards for simple presentational React components.

## Component Structure

1. Imports
   - Order:
     1. Third-party libraries (react, next/image, etc.)
     2. Shared/internal components (from monorepo packages, common folders)
     3. Local imports (styles, helpers)
   - No unused imports allowed.

2. Component Definition
   - Must use:
     ```tsx
     export const ComponentName: React.FC<IProps> = (props) => {
     ```
   - Keep logic minimal. No data fetching or business logic here.

3. Props Interface
   - Must be placed after the component
   - Strict typing only
   - Example:
     ```tsx
     interface IProps {
       onClick: () => void;
     }
     ```

4. JSX Structure
   - One root container element
   - Clear layout using Tailwind CSS classes
   - Accessibility attributes included where required (example: alt text for images)

5. Typography and Styling
   - Reuse standard text styles consistently (Tailwind based)
   - Avoid inline styles unless unavoidable

6. Export Rules
   - Only named export allowed
   - No default exports

## Anti-patterns (Do Not Do)

| Issue | Incorrect Practice |
|------|------------------|
| Export method | `export default Component` |
| Unstructured imports | Random ordering or grouped incorrectly |
| Anonymous components | Untyped or default functional declarations |
| Logic-heavy UI components | Fetching, transformations inside component |

## Template Example

```tsx
import Image from "next/image";
import React from "react";

import { CreateButton } from "@repo/frontend/components/CreateButton";

export const SampleComponent: React.FC<IProps> = (props) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src="/images/sample.svg"
        alt="Sample placeholder"
        width={200}
        height={150}
      />
      <h3 className="text-2xl font-semibold mb-3">Title</h3>
      <p className="text-neutral-600">Small descriptive text goes here.</p>
      <CreateButton type="button" onClick={props.onClick} className="mt-6">
        Action
      </CreateButton>
    </div>
  );
};

interface IProps {
  onClick: () => void;
}
