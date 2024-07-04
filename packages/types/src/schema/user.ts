import { IBaseModelAttributes } from "../types";
import { IRole } from "./role";

export interface IUser extends IBaseModelAttributes {
  cognitoUsername: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roles: IRole[];
}
