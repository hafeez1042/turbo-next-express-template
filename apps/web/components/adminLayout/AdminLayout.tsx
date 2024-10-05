import React, { PropsWithChildren } from "react";
import { Header } from "./partials/Header";

export const AdminLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      {children}
    </div>
  );
};
