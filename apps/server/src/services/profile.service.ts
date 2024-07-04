import { IQueryStringParams } from "@repo/types/lib/types";
import { profileRepository } from "../repositories/Profile.repository";
import { IProfile } from "@repo/types/lib/schema/profile";
import { NotFoundError } from "../errors/NotFoundError";

export class ProfileService {
  static getAll = async (query: IQueryStringParams) => {
    const items = await profileRepository.getAll(query);
    return items;
  };

  static create = async (data: IProfile) => {
    const item = await profileRepository.create(data);

    return item;
  };

  static getById = async (id: string) => {
    const item = await profileRepository.getById(id);
    if (!item) throw new NotFoundError();
    return item;
  };
  static update = async (id: string, data: Partial<IProfile>) => {
    await profileRepository.update(id, data);
    const item = await profileRepository.getById(id);
    if (!item) throw new NotFoundError();
    return item;
  };
  static delete = async (id: string) => {
    await profileRepository.delete(id);
    return;
  };
}
