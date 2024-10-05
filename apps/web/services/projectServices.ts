import { IAPIV1Response, IQueryStringParams } from "@repo/types/lib/types";
import { AbstractServices } from "./AbstractService";
import { IUser } from "@repo/types/lib/schema/user";
import { ICurrentUser } from "../types";
import { APIError } from "@repo/frontend/errors/APIError";
import { IProject } from "@repo/types/lib/schema/project";
import { projects } from "../dummy-data/dummyData";

class ProjectServices extends AbstractServices<IProject> {
  constructor() {
    super("/projects");
  }

  public getAll = (queryParams?: IQueryStringParams) => {
    return Promise.resolve(projects);
  };
}

export const projectServices = Object.freeze(new ProjectServices());
