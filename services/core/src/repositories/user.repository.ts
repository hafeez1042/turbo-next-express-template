import { Op, WhereOptions } from "sequelize";
import { BaseRepository } from "@repo/backend/lib/repositories/BaseRepository.sequelize";
import { IUser } from "@repo/types/src/schema/user";
import User from "../models/user.model";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User as any);
  }

  getSearchQuery = (searchText: string): WhereOptions<IUser> => {
    return {
      [Op.or]: [
        { full_name: { [Op.iLike]: `%${searchText}%` } },
        { email: { [Op.iLike]: `%${searchText}%` } },
      ],
    };
  };
}

export default new UserRepository();
