import React, { ReactNode } from "react";
import Link from "next/link";
import { PathName } from "../../../../routes/types";

export const NavItem: React.FC<IProps> = (props) => {
  return (
    <Link
      href={props.path}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${props.isActive ? "bg-muted text-primary" : "text-muted-foreground"} transition-all hover:text-primary`}
    >
      {props.icon}
      {props.label}
    </Link>
  );
};

export const NavItemMobile: React.FC<IProps> = (props) => {
  return (
    <Link
      href={props.path}
      className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${props.isActive ? "bg-muted px-3 py-2 text-foreground" : "text-muted-foreground"}`}
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
