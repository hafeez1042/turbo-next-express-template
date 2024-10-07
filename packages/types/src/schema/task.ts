import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface ITask extends IBaseAttributes, ISoftDeleteAttributes {
  name: string;
  estimated_hours?: number;
  additional_hours?: number;
  start_date?: Date;
  end_date?: Date;
  assigned_to_id: number;
  assigned_by_id: number;
  description?: string;
  status: TaskStatusEnum;
  priority?: number;
  tech_stack_id: number;
  group_id?: number;
  project_id: number;
}

export enum TaskStatusEnum {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  ON_HOLD = "On Hold",
  CANCELLED = "Cancelled",
  BLOCKED = "Blocked",
}
