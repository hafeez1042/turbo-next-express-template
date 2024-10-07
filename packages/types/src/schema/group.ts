import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface IGroup extends IBaseAttributes, ISoftDeleteAttributes {
  name: string;
  type: string; // type of group, e.g., sprint, feature, etc.
  start_date?: Date;
  end_date?: Date;
  descriptions?: string;
  group_id?: number; // Foreign key referencing parent group
  project_id: number; // Foreign key referencing project
}

export enum GroupTypeEnum {
  FEATURE = "Feature",
  SPRINT = "Sprint",
}
