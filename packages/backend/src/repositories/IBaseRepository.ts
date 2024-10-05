import { IQueryStringParams } from "@repo/types/lib/types";

export interface IBaseRepository<T, I = number, TCreate = T, TUpdate = T> {
  getAll(queryParams: Omit<IQueryStringParams, "cursor">): Promise<T[]>;

  getAllWithCursor(
    queryParams: IQueryStringParams,
    cursorComparison: "lt" | "gt"
  ): Promise<{ items: T[]; nextCursor: number | null }>;

  getById(id: I): Promise<T | null>;

  findOne(queryParams: IQueryStringParams): Promise<T | null>;

  create(data: TCreate): Promise<T>;

  update(
    id: I | undefined,
    data: Partial<T>,
    upsert?: boolean
  ): Promise<T | null>;

  updateMany(query: IQueryStringParams, updateData: Partial<T>): Promise<void>;

  delete(id: I): Promise<void>;

  bulkCreate(data: Partial<T>[]): Promise<T[]>;

  bulkUpdate(updateData: (Partial<T> & { id: string })[]): Promise<void>;

  bulkDelete(query: IQueryStringParams): Promise<any>;

  getSearchQuery?: (searchString: string) => unknown;
}
