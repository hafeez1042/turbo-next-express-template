import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface IProjectType extends IBaseAttributes, ISoftDeleteAttributes {
  name: string;
  description?: string;
}
