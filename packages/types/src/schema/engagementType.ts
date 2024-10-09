import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface IEngagementType
  extends IBaseAttributes,
    ISoftDeleteAttributes {
  name: string;
  description?: string;
}
