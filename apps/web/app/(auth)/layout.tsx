import React, { PropsWithChildren } from "react";
import { AuthProvider } from "../../providers/AuthProvider";
import "@repo/frontend/globals.css";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Layout;
