import { IBaseAttributes } from "../types.sql";

export interface IProjectRole extends IBaseAttributes {
  name: string;
  description: string;
}
