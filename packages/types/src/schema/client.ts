import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface IClient extends IBaseAttributes, ISoftDeleteAttributes {
  name: string;
  slug: string;
  client: string;
  description?: string;
  status: ClientStatusEnum;
  priority?: number;
  rms_id?: string;
  start_date?: Date;
  end_date?: Date;
  manager_id: number;
}

export enum ClientStatusEnum {
  NOT_STARTED = 'Not Started',
  ON_HOLD = 'On Hold',
  IN_PROGRESS = 'In Progress',
  ARCHIVED = "Archived",
  DELETED = "Deleted",
  COMPLETED = "Completed",
}
