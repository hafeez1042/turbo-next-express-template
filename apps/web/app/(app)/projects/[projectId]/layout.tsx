"use client"
import React, { PropsWithChildren } from "react";
import { LeftNavLayout } from "../../../../components/leftNavLayout/LeftNavLayout";
import { getProjectNavigationRoutes } from "../../../../routes/projectNavigationRoutes";
import { useParams } from "next/navigation";

const Layout: React.FC<PropsWithChildren> = (props) => {
  const { projectId } = useParams();

  return (
    <LeftNavLayout
      header="Project Name"
      navRoutes={getProjectNavigationRoutes(projectId as string)}
    >
      {props.children}
    </LeftNavLayout>
  );
};

export default Layout;
