import { BaseServices } from "@repo/backend/lib/services/BaseServices";
import { IUser } from "@repo/types/src/schema/user";
import userRepository from "../repositories/user.repository";

export class UserService extends BaseServices<IUser> {
  constructor() {
    super(userRepository);
  }
}

export default new UserService();
