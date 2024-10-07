import React, { PropsWithChildren } from "react";
import { Header } from "./partials/Header";
import { Nav } from "./partials/nav/Nav";
import { INavigationRoutes } from "../../routes/types";

export const LeftNavLayout: React.FC<PropsWithChildren<IProps>> = ({
  children,
  navRoutes,
  header,
}) => {
  return (
    <div className="grid min-h-[calc(100vh-64px)] w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Nav navRoutes={navRoutes} />
      <div className="flex flex-col">
        <Header header={header} navRoutes={navRoutes} />
        {children}
      </div>
    </div>
  );
};

interface IProps {
  header: string;
  navRoutes: INavigationRoutes[];
}
