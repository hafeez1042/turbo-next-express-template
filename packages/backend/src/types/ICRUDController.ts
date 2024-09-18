import { RequestHandler } from "express";
import { IQueryStringParams, IAPIResponse } from "@repo/types/lib/types";

export interface ICRUDController<T = object, TCreate = T, TUpdate = T> {
  create?: RequestHandler<unknown, IAPIResponse, TCreate>;
  getAll?: RequestHandler<
    unknown,
    IAPIResponse,
    unknown,
    { query: IQueryStringParams }
  >;
  getOne?: RequestHandler<
    unknown,
    IAPIResponse,
    unknown,
    { query: IQueryStringParams }
  >;
  getById?: RequestHandler<{ id: string }, IAPIResponse>;
  update?: RequestHandler<{ id: string }, IAPIResponse, Partial<TUpdate>>;
  delete?: RequestHandler<{ id: string }, IAPIResponse>;
}