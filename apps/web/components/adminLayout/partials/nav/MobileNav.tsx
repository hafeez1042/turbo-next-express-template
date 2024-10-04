"use client"
import React from "react";
import Link from "next/link";
import {
  Home,
  LineChart,
  Package,
  Settings,
  PanelLeft,
  ShoppingCart,
  Users2,
} from "lucide-react";

import { Button } from "@repo/frontend/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@repo/frontend/components/ui/sheet";
import { Logo } from "./Logo";
import { NavItemMobile } from "./NavItem";
import {
  navigationRoutes,
  settingsRoute,
} from "../../../../routes/navigationRoutes";
import { usePathname } from "next/navigation";

export const MobileNav: React.FC = () => {
  const pathName = usePathname()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Logo isMobile />
          {navigationRoutes.map((item) => (
            <NavItemMobile
              icon={item.icon}
              label={item.label}
              path={item.path}
              key={item.label}
              isActive={pathName === item.path}
            />
          ))}

          <NavItemMobile
            icon={settingsRoute.icon}
            label={settingsRoute.label}
            path={settingsRoute.path}
            isActive={pathName === settingsRoute.path}
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
};
