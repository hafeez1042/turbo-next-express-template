import React from "react";
import { Metadata } from "next";
import { TooltipProvider } from "@repo/frontend/components/ui/tooltip";
import { Toaster as Sonner } from "@repo/frontend/components/ui/sonner";
import { Toaster } from "@repo/frontend/components/ui/toaster";
import "./globals.css";
import "./app.css";

export const metadata: Metadata = {
  title: 'Turbo App',
};

const layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
};

export default layout;
