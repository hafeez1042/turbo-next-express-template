import React from "react";


import { MobileNav } from "./nav/MobileNav";
import { INavigationRoutes } from "../../../routes/types";

export const Header: React.FC<IProps> = (props) => {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <MobileNav navRoutes={props.navRoutes} />
      <div className="w-full flex-1">
        <h3>{props.header}</h3>
      </div>
    </header>
  );
};

interface IProps {
  header: string
  navRoutes: INavigationRoutes[]
}
