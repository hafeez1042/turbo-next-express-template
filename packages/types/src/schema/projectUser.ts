import { IBaseAttributes } from "../types.sql";

export interface IProjectUser extends IBaseAttributes {
  project_id: number;
  user_id: number;
  allocation_start_date: Date,
  allocation_end_date: Date,
  allocation_hours: number,
  status: ProjectUserStatusEnum,
  project_role_id: number
}

export enum ProjectUserStatusEnum {

}
