export interface IRole {
  _id: string;
  name: RolesEnum;
  permissions: string[];
}

export enum RolesEnum {
  ADMIN = "ADMIN",
  USER = "USER"
}

export interface IPermission {
  name: string;
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
  list?: boolean;
}