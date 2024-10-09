import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface IClient extends IBaseAttributes, ISoftDeleteAttributes {
  code: string;
  name: string;
  slug: string;
  description?: string;
  status: ClientStatusEnum;
  currency?: string;     
  geography?: string;    
  country?: string;       
  from_db_name?: string;
}

export enum ClientStatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending',
  SUSPENDED = 'Suspended',
  CLOSED = 'Closed',
}