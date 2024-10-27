import { RequestHandler } from "express";
import { IQueryStringParams, IAPIResponse } from "@repo/types/lib/types";
import { ParamsDictionary } from "express-serve-static-core";

export interface ICRUDController<T = object, R = T, TCreate = T, TUpdate = T> {
  create?: RequestHandler<ParamsDictionary, IAPIResponse<R>, TCreate>;
  getAll?: RequestHandler<
    ParamsDictionary,
    IAPIResponse<R[]>,
    unknown,
    { query: IQueryStringParams }
  >;
  getOne?: RequestHandler<
    ParamsDictionary,
    IAPIResponse<R>,
    unknown,
    { query: IQueryStringParams }
  >;
  getById?: RequestHandler<{ id: string } & ParamsDictionary, IAPIResponse<R>>;
  update?: RequestHandler<
    { id: string } & ParamsDictionary,
    IAPIResponse<R>,
    Partial<TUpdate>
  >;
  delete?: RequestHandler<{ id: string } & ParamsDictionary, IAPIResponse<R>>;
}
