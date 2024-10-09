import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface IDesignation extends IBaseAttributes, ISoftDeleteAttributes {
  name: string,
  description?: string; // Optional description of the tech stack
}