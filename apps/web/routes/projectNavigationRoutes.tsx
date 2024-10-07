import { INavigationRoutes, PathName } from "./types";

import { Settings, ListTodo, Users } from "lucide-react";

export const getProjectNavigationRoutes = (
  projectId: string
): INavigationRoutes[] => [
  {
    icon: <ListTodo className="h-5 w-5" />,
    label: "Tasks",
    path: `/projects/${projectId}/tasks` as PathName,
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "Members",
    path: `/projects/${projectId}/members` as PathName,
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: "Settings",
    path: `/projects/${projectId}/settings` as PathName,
  },
];

