import * as React from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { cn } from "../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchField = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        <span className="absolute left-3 text-muted-foreground">
          <MagnifyingGlassIcon />
        </span>

        <input
          type="text"
          className={cn(
            "!w-[342px] h-11 px-4 pl-10 pr-3.5  bg-gray-900 bg-opacity-5 rounded-[14px] justify-start items-center gap-3 inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-0 disabled:cursor-not-allowed disabled:opacity-50",            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
SearchField.displayName = "SearchField";

export { SearchField  };
