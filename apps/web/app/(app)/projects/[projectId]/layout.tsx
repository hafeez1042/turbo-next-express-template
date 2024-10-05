import React, { PropsWithChildren } from "react";
import { ProjectLayout } from "../../../../components/projectLayout/ProjectLayout";

const Layout: React.FC<PropsWithChildren> = (props) => {
  return <ProjectLayout>{props.children}</ProjectLayout>;
};

export default Layout;
