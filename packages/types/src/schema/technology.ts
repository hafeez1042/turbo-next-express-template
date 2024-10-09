import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface ITechnology extends IBaseAttributes, ISoftDeleteAttributes {
  name: string;
  description?: string;
}
