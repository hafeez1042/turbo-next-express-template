import { IBaseAttributes, ISoftDeleteAttributes } from "../types.sql";

export interface ITechStack extends IBaseAttributes, ISoftDeleteAttributes {
  name: string; // Name of the tech stack
  description?: string; // Optional description of the tech stack
}