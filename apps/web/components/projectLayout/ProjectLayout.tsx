import React, { PropsWithChildren } from "react";
import { Header } from "./partials/Header";
import { Nav } from "./partials/nav/Nav";

export const ProjectLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid min-h-[calc(100vh-64px)] w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Nav />
      <div className="flex flex-col">
        <Header />
        {children}
      </div>
    </div>
  );
};

export const description =
  "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action.";
