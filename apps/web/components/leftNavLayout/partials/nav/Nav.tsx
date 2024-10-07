"use client";
import React from "react";

import { NavItem } from "./NavItem";
import { usePathname } from "next/navigation";
import { INavigationRoutes } from "../../../../routes/types";

export const Nav: React.FC<IProps> = (props) => {
  const pathName = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block pt-4">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {props.navRoutes.map((item) => (
              <NavItem
                icon={item.icon}
                label={item.label}
                path={item.path}
                key={item.label}
                isActive={pathName === item.path}
              />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

interface IProps {
  navRoutes: INavigationRoutes[]

}
