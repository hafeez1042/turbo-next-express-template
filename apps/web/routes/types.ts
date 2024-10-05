import type { Route as NextRouter } from "next";
import { ReactNode } from "react";

export type Route = NextRouter;
export type PathName = Route;

export interface INavigationRoutes {
  icon: ReactNode;
  label: string;
  path: PathName;
}