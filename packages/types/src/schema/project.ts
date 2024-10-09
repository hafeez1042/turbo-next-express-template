import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface IProject extends IBaseAttributes, ISoftDeleteAttributes {
  name: string;
  code: string;
  slug: string;
  client_id: number;
  description?: string;
  status: ProjectStatusEnum;
  priority?: number;
  start_date?: Date;
  end_date?: Date;
  program_id?: number;
  overhead?: string;
  technology_id?: number;
  engagement_type_id?: number;
  billable?: string;
  project_type_id?: number;
  type_of_billing?: string;
  billing_units?: string;
  units?: number;
  department_id?: number;
  is_staff_augmentation?: boolean;
}

export interface IProject
  extends IBaseAttributes<number>,
    ISoftDeleteAttributes {}

export enum ProjectStatusEnum {
  NOT_STARTED = "Not Started",
  ON_HOLD = "On Hold",
  IN_PROGRESS = "In Progress",
  ARCHIVED = "Archived",
  DELETED = "Deleted",
  COMPLETED = "Completed",
}
