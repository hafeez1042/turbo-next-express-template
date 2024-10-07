import { IBaseAttributes } from "../types.sql";

export interface IRole extends IBaseAttributes {
  name: string;
  description: string;
}

export interface IRolePermission extends IBaseAttributes {
  role_id: number;
  permission: PermissionsEnum;
}

export enum PermissionsEnum {}
