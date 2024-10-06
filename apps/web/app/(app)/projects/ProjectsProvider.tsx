import { IProject, ProjectStatusEnum } from "@repo/types/lib/schema/project";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { useQuery } from "../../../hooks/useQuery";
import { projectServices } from "../../../services/projectServices";
import { useList } from "../../../hooks/useList";

export const ProjectsContext = createContext<IProjectsContext>({
  projects: undefined,
  setStatusFilter: undefined,
  statusFilter: undefined,
});

interface IProjectsContext {
  projects: IProject[];
  setStatusFilter: React.Dispatch<React.SetStateAction<ProjectStatusEnum>>;
  statusFilter: ProjectStatusEnum;
}

export const ProjectsProvider: React.FC<PropsWithChildren<IProps>> = (
  props
) => {
  const [statusFilter, setStatusFilter] = useState<ProjectStatusEnum>();
  const [projects, setProjects, updateProject, deleteProject] =
    useList<IProject>();

  const [, isProjectsFetching] = useQuery(projectServices.getAll, [], {
    defaultValue: [],
    callback: setProjects,
  });

  const value: IProjectsContext = useMemo(
    () => ({
      statusFilter,
      setStatusFilter,
      projects,
    }),
    [statusFilter, projects]
  );

  return (
    <ProjectsContext.Provider value={value}>
      {props.children}
    </ProjectsContext.Provider>
  );
};

interface IProps {
  // Add your prop types here
}
export const useProjectsContext = () => useContext(ProjectsContext);
