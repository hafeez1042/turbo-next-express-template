import { IBaseAttributes } from "../types.sql";

export interface IUser extends IBaseAttributes {
  full_name: string;
  email: string
}