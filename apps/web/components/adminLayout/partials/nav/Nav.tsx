"use client";
import React from "react";

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
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      <Logo />
      {navigationRoutes.map((item) => (
        <NavItem
          icon={item.icon}
          label={item.label}
          path={item.path}
          key={item.label}
          isActive={pathName.startsWith(item.path)}
        />
      ))}

      <NavItem
        icon={settingsRoute.icon}
        label={settingsRoute.label}
        path={settingsRoute.path}
        isActive={pathName === settingsRoute.path}
      />
    </nav>
  );
};

interface IProps {}
