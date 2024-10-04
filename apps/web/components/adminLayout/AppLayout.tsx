import React, { PropsWithChildren } from "react";
import { TooltipProvider } from "@repo/frontend/components/ui/tooltip";
import { Header } from "./partials/Header";
import { Nav } from "./partials/nav/Nav";

export const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Nav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <Header />
          {children}
        </div>
      </div>
    </TooltipProvider>
  );
};
