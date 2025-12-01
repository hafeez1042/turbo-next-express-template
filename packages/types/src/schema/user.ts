import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface IUser extends IBaseAttributes, ISoftDeleteAttributes {
  full_name: string;
  email: string;
  avatar_url?: string;
  status?: UserStatusEnum;
}
export enum UserStatusEnum {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  SUSPENDED = "Suspended",
  TERMINATED = "Terminated",
}
