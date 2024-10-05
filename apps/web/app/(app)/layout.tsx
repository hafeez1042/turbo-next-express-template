import React, { PropsWithChildren } from "react";
import { AdminLayout } from "../../components/adminLayout/AdminLayout";
import { AppProvider } from "../../providers/AppProvider";
import "@repo/frontend/globals.css";

const Layout: React.FC<PropsWithChildren> = (props) => {
  return (
    <AppProvider>
      <AdminLayout>{props.children}</AdminLayout>
    </AppProvider>
  );
};

export default Layout;
