import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface IClient extends IBaseAttributes, ISoftDeleteAttributes {
  name: string;
  slug: string;
  description?: string;
  status: ClientStatusEnum;
}

export enum ClientStatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending',
  SUSPENDED = 'Suspended',
  CLOSED = 'Closed',
}