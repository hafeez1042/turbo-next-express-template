import React from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "../lib/utils";

export const SaveButton: React.FC<IProps & ButtonProps> = ({
  isSaving,
  children,
  className,
  ...buttonProps
}) => {
  return (
    <div>
      <Button {...buttonProps} className={cn("w-full", className)} disabled={isSaving}>
        {isSaving && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    </div>
  );
};

interface IProps {
  isSaving?: boolean;
}
