"use client"
import React from "react";

import {
  Home,
  LineChart,
  Package,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";

import { Logo } from "./Logo";
import { NavItem } from "./NavItem";
import {
  navigationRoutes,
  settingsRoute,
} from "../../../../routes/navigationRoutes";
import { usePathname } from "next/navigation";

export const Nav: React.FC<IProps> = (props) => {
  const pathName = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Logo />
        {navigationRoutes.map((item) => (
          <NavItem
            icon={item.icon}
            label={item.label}
            path={item.path}
            key={item.label}
            isActive={pathName === item.path}
          />
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavItem
          icon={settingsRoute.icon}
          label={settingsRoute.label}
          path={settingsRoute.path}
          isActive={pathName === settingsRoute.path}
        />
      </nav>
    </aside>
  );
};

interface IProps {}
