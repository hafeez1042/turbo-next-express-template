import React, { PropsWithChildren } from "react";
import { AppLayout } from "../../components/appLayout/AppLayout";
import { AppProvider } from "../../providers/AppProvider";

const Layout: React.FC<PropsWithChildren> = (props) => {
  return (
    <AppProvider>
      <AppLayout>{props.children}</AppLayout>
    </AppProvider>
  );
};

export default Layout;
