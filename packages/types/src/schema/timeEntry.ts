import { IBaseAttributes } from "../types.sql";

export interface ITimeEntry extends IBaseAttributes<number> {
  project_id: number;
  task_id: number;
  user_id: number;
  hours: number;
  date: Date;
  notes?: string;
}