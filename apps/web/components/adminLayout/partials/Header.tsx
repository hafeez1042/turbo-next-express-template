import React from "react";

import { Search } from "lucide-react";

import { Input } from "@repo/frontend/components/ui/input";
import { MobileNav } from "./nav/MobileNav";
import { Nav } from "./nav/Nav";
import { UserMenu } from "./UserMenu";

export const Header: React.FC<IProps> = (props) => {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-[1]">
      <Nav />
      <MobileNav />
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto"></div>
        <UserMenu />
      </div>
    </header>
  );
};

interface IProps {}

const SearchField: React.FC = () => {
  return (
    <form className="ml-auto flex-1 sm:flex-initial">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
        />
      </div>
    </form>
  );
};
