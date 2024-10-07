import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface IProject extends IBaseAttributes, ISoftDeleteAttributes {
  name: string;
  slug: string;
  client_id: number;
  description?: string;
  status: ProjectStatusEnum;
  priority?: number;
  rms_id?: string;
  start_date?: Date;
  end_date?: Date;
  manager_id: number;
}

export enum ProjectStatusEnum {
  NOT_STARTED = 'Not Started',
  ON_HOLD = 'On Hold',
  IN_PROGRESS = 'In Progress',
  ARCHIVED = "Archived",
  DELETED = "Deleted",
  COMPLETED = "Completed",
}
