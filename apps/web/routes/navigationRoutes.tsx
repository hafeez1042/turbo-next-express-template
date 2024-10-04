import { ReactNode } from "react";
import { PathName } from "./types";

import {
  Home,
  LineChart,
  Package,
  ShoppingCart,
  Users2,
  Settings
} from "lucide-react";

export const navigationRoutes: INavigationRoutes[] = [
  {
    icon: <Home className="h-5 w-5" />,
    label: "Dashboard",
    path: "/",
  },
  {
    icon: <ShoppingCart className="h-5 w-5" />,
    label: "Orders",
    path: "/",
  },
  {
    icon: <Package className="h-5 w-5" />,
    label: "Products",
    path: "/",
  },
  {
    icon: <Users2 className="h-5 w-5" />,
    label: "Customers",
    path: "/",
  },
  {
    icon: <LineChart className="h-5 w-5" />,
    label: "Analytics",
    path: "/",
  },
];

export const settingsRoute: INavigationRoutes = {
  icon: <Settings className="h-5 w-5" />,
  label: "Settings",
  path: "/",
};

export interface INavigationRoutes {
  icon: ReactNode;
  label: string;
  path: PathName;
}

