import React, { PropsWithChildren } from "react";
import { TooltipProvider } from "@repo/frontend/components/ui/tooltip";

export const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <TooltipProvider>{children}</TooltipProvider>;
};
