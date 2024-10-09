import { IBaseAttributes } from "../types.sql";

export interface IRole extends IBaseAttributes {
  name: string;
  description?: string;
}
