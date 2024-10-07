"use client"
import React, { PropsWithChildren } from "react";
import { LeftNavLayout } from "../../../../components/leftNavLayout/LeftNavLayout";
import { useParams } from "next/navigation";
import { getClientNavigationRoutes } from "../../../../routes/clientNavigationRoutes";

const Layout: React.FC<PropsWithChildren> = (props) => {
  const { clientId } = useParams();

  return (
    <LeftNavLayout
      header="Client Name"
      navRoutes={getClientNavigationRoutes(clientId as string)}
    >
      {props.children}
    </LeftNavLayout>
  );
};

export default Layout;
