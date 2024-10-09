import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface IUser extends IBaseAttributes, ISoftDeleteAttributes {
  full_name: string;
  email: string;
  /**
   * Employee id, nothing related to db relation
   */
  employee_id: number;
  mobile?: string;

  date_of_joining?: Date;
  relieved_date?: Date;
  settlement_date?: Date | null;

  department_id?: number;
  designation_id?: number;
  manager_id?: number;

  image_url?: string;
  status?: EmployeeStatusEnum;
}
export enum EmployeeStatusEnum {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  SUSPENDED = "Suspended",
  TERMINATED = "Terminated",
}
