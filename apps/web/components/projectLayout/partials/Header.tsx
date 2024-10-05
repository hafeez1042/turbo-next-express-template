import React from "react";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/frontend/components/ui/breadcrumb";
import { Button } from "@repo/frontend/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/frontend/components/ui/dropdown-menu";
import { Input } from "@repo/frontend/components/ui/input";
import { MobileNav } from "./nav/MobileNav";

export const Header: React.FC<IProps> = (props) => {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <MobileNav />
      <div className="w-full flex-1">
        <h3>Project Name</h3>
      </div>
    </header>
  );
};

interface IProps {}
