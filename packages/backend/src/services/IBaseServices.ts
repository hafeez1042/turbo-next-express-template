import { IQueryStringParams } from "@repo/types/lib/types";

export interface IBaseServices<T> {
  getAll(query: IQueryStringParams): Promise<T[]>;

  create(data: T): Promise<T>;

  getById(id: string): Promise<T>;

  update(id: string, data: Partial<T>): Promise<T>;

  delete(id: string): Promise<void>;
}
