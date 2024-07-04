import { IAPIResponse } from "./IAPIResponse";
import { RequestHandler } from "express";
import { IQueryStringParams } from "@repo/types/lib/types";

export interface ICRUDController<T = object, TCreate = T> {
  create?: RequestHandler<unknown, IAPIV1Response, TCreate>;
  getAll?: RequestHandler<
    unknown,
    IAPIV1Response,
    unknown,
    { query: IQueryStringParams }
  >;
  getOne?: RequestHandler<
    unknown,
    IAPIV1Response,
    unknown,
    { query: IQueryStringParams }
  >;
  getById?: RequestHandler<{ id: string }, IAPIV1Response>;
  update?: RequestHandler<{ id: string }, IAPIV1Response, Partial<T>>;
  delete?: RequestHandler<{ id: string }, IAPIV1Response>;
}

export interface IAPIV1Response<D = object[] | object> extends IAPIResponse<D> {
  version: "v1";
}
