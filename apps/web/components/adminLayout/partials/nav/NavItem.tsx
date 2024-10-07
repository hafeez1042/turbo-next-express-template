import React, { ReactNode } from "react";
import Link from "next/link";

import { PathName } from "../../../../routes/types";

export const NavItem: React.FC<IProps> = (props) => {
  return (
    <Link
      href={props.path}
      className={`${props.isActive ? "text-foreground" : "text-muted-foreground"} transition-colors hover:text-foreground`}
    >
      {props.label}
    </Link>
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
