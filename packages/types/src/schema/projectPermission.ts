import { IBaseAttributes } from "../types.sql";

export interface IProjectPermission extends IBaseAttributes {
  role_id: number;
  permission: PermissionsEnum;
}

export enum PermissionsEnum {}
