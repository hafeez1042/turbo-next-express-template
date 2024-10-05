import { IQueryStringParams } from "@repo/types/lib/types";

export interface IBaseServices<T> {
  getAll(query: IQueryStringParams): Promise<T[]>;

  create(data: T): Promise<T>;

  getById(id: number): Promise<T>;

  update(id: number, data: Partial<T>): Promise<T>;

  delete(id: number): Promise<void>;
}
