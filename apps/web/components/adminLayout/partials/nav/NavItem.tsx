import React, { ReactNode } from "react";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/frontend/components/ui/tooltip";
import { PathName } from "../../../../routes/types";

export const NavItem: React.FC<IProps> = (props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={props.path}
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${props.isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"} transition-colors hover:text-foreground md:h-8 md:w-8`}
        >
          {props.icon}
          <span className="sr-only">{props.label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{props.label}</TooltipContent>
    </Tooltip>
  );
};

export const NavItemMobile: React.FC<IProps> = (props) => {
  return (
    <Link
      href={props.path}
      className={`flex items-center gap-4 px-2.5 ${props.isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
    >
      {props.icon}
      {props.label}
    </Link>
  );
};

interface IProps {
  icon: ReactNode;
  label: string;
  path: PathName;
  isActive?: boolean;
}
