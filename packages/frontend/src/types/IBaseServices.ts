import { IQueryStringParams } from "@repo/types/lib/types";

export interface IBaseServices<T = {}> {
  getAll<R = any[]>(queryParams?: IQueryStringParams): Promise<R>;
  getById<R = any>(id: string): Promise<R>;
  update(id: string, data: Partial<any>): Promise<T>;
  create(data: any): Promise<any>;
  delete(id: string): Promise<null>;
}
