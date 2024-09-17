import React, { PropsWithChildren } from "react";
import { AuthProvider } from "../../providers/AuthProvider";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Layout;
