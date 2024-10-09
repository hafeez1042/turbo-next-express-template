import { IBaseAttributes } from "../types.sql";

export interface IPermission extends IBaseAttributes {
  role_id: number;
  permission: PermissionsEnum;
}

export enum PermissionsEnum {}
