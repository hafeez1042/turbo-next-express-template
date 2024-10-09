import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface IProgram
  extends IBaseAttributes<number>,
    ISoftDeleteAttributes {
  code?: string;
  name: string;
  client_id: number;
  status: ProgramStatusEnum;
}

export enum ProgramStatusEnum {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  PENDING = "Pending",
  SUSPENDED = "Suspended",
  COMPLETED = "Completed",
}
