import { ReactNode } from "react";
import { INavigationRoutes, PathName } from "./types";

import {
  Home,
  LineChart,
  Package,
  Settings,
} from "lucide-react";

export const navigationRoutes: INavigationRoutes[] = [
  {
    icon: <Home className="h-5 w-5" />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <Package className="h-5 w-5" />,
    label: "Projects",
    path: "/projects",
  },
  {
    icon: <LineChart className="h-5 w-5" />,
    label: "Reports",
    path: "/reports",
  },
];

export const settingsRoute: INavigationRoutes = {
  icon: <Settings className="h-5 w-5" />,
  label: "Settings",
  path: "/settings",
};