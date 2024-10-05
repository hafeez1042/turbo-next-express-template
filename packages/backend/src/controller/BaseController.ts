import { ICRUDController } from "./ICRUDController";
import { IAPIResponse, IQueryStringParams } from "@repo/types/lib/types";
import { RequestHandler } from "express";
import { v1Response } from "../utils/responseHandler";
import { IBaseServices } from "../services/IBaseServices";
import { BadRequestError } from "../errors/BadRequestError";

export abstract class BaseController<T> implements ICRUDController<T> {
  protected services: IBaseServices<T>;
  constructor(services: IBaseServices<T>) {
    this.services = services;
  }
  create: RequestHandler<unknown, IAPIResponse<T>, T> = async (req, res) => {
    const data = await this.services.create(req.body);

    data;
    return res.json(v1Response(data));
  };

  getById: RequestHandler<{ id: string }, IAPIResponse<T>> = async (
    req,
    res
  ) => {
    const data = await this.services.getById(this.getId(req.params.id));
    return res.json(v1Response(data));
  };

  getAll: RequestHandler<
    unknown,
    IAPIResponse<T[]>,
    unknown,
    { query: IQueryStringParams }
  > = async (req, res) => {
    const data = await this.services.getAll(req.query.query);
    return res.json(v1Response(data));
  };

  update: RequestHandler<{ id: string }, IAPIResponse<T>, Partial<T>> = async (
    req,
    res
  ) => {
    const data = await this.services.update(
      this.getId(req.params.id),
      req.body
    );
    return res.json(v1Response(data));
  };

  delete: RequestHandler<{ id: string }, IAPIResponse<T>> = async (
    req,
    res
  ) => {
    await this.services.delete(this.getId(req.params.id));
    return res.json(v1Response());
  };

  protected getId(id: string) {
    const _id = Number(id);
    if (isNaN(_id)) {
      throw new BadRequestError("invalid id");
    }

    return _id;
  }
}
