import { INavigationRoutes, PathName } from "./types";

import { Settings, ListTodo } from "lucide-react";

export const getClientNavigationRoutes = (
  clientId: string
): INavigationRoutes[] => [
  {
    icon: <ListTodo className="h-5 w-5" />,
    label: "About",
    path: `/clients/${clientId}/about` as PathName,
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: "Settings",
    path: `/clients/${clientId}/settings` as PathName,
  },
];

