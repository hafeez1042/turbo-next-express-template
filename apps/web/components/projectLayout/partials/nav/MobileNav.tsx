"use client";
import React from "react";
import { Menu } from "lucide-react";

import { Button } from "@repo/frontend/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@repo/frontend/components/ui/sheet";
import { NavItemMobile } from "./NavItem";
import { useParams, usePathname } from "next/navigation";
import { getProjectNavigationRoutes } from "../../../../routes/projectNavigationRoutes";

export const MobileNav: React.FC = () => {
  const pathName = usePathname();
  const { projectId } = useParams();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          {getProjectNavigationRoutes(projectId as string).map((item) => (
            <NavItemMobile
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={pathName === item.path}
            />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
