import { IBaseAttributes } from "../types.sql";

export interface ITime extends IBaseAttributes<number> {
  task_id?: number;
  user_id?: number;
  hours?: number;
  date?: Date;
  notes?: string;
}