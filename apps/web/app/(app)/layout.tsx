import React, { PropsWithChildren } from "react";
import { AppLayout } from "../../components/adminLayout/AppLayout";
import { AppProvider } from "../../providers/AppProvider";
import "@repo/frontend/globals.css";

const Layout: React.FC<PropsWithChildren> = (props) => {
  return (
    <AppProvider>
      <AppLayout>{props.children}</AppLayout>
    </AppProvider>
  );
};

export default Layout;
