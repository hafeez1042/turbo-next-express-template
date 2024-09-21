import { RequestHandler } from "express";
import { IQueryStringParams, IAPIResponse } from "@repo/types/lib/types";

export interface ICRUDController<T = object, R = T, TCreate = T, TUpdate = T> {
  create?: RequestHandler<unknown, IAPIResponse<R>, TCreate>;
  getAll?: RequestHandler<
    unknown,
    IAPIResponse<R[]>,
    unknown,
    { query: IQueryStringParams }
  >;
  getOne?: RequestHandler<
    unknown,
    IAPIResponse<R>,
    unknown,
    { query: IQueryStringParams }
  >;
  getById?: RequestHandler<{ id: string }, IAPIResponse<R>>;
  update?: RequestHandler<{ id: string }, IAPIResponse<R>, Partial<TUpdate>>;
  delete?: RequestHandler<{ id: string }, IAPIResponse<R>>;
}
