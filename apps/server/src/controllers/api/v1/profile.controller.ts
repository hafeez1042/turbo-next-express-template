import { IProfile } from "@repo/types/lib/schema/profile";
import { RequestHandler } from "express";
import {
  IAPIV1Response,
  ICRUDController,
} from "../../../types/ICRUDController";
import { IQueryStringParams } from "@repo/types/lib/types";
import { v1Response } from "../../../helpers/responseHandler";
import { ProfileService } from "../../../services/profile.service";

class ProfileController implements ICRUDController<IProfile> {
  create: RequestHandler<unknown, IAPIV1Response, IProfile> = async (
    req,
    res
  ) => {
    const data = await ProfileService.create(req.body);

    return res.json(v1Response(data));
  };

  getById: RequestHandler<{ id: string }, IAPIV1Response> = async (
    req,
    res
  ) => {
    const data = await ProfileService.getById(req.params.id);

    return res.json(v1Response(data));
  };

  getAll: RequestHandler<
    unknown,
    IAPIV1Response,
    unknown,
    { query: IQueryStringParams }
  > = async (req, res) => {
    const data = await ProfileService.getAll(req.query.query);
    return res.json(v1Response(data));
  };

  update: RequestHandler<{ id: string }, IAPIV1Response, Partial<IProfile>> =
    async (req, res) => {
      const data = await ProfileService.update(req.params.id, req.body);

      return res.json(v1Response(data));
    };

  delete: RequestHandler<{ id: string }, IAPIV1Response> = async (req, res) => {
    const data = await ProfileService.delete(req.params.id);

    return res.json(v1Response());
  };
}

export const profileController = new ProfileController();
