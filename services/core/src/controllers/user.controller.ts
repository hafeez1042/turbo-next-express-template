import { BaseController } from "@repo/backend/lib/controller/BaseController";
import { IUser } from "@repo/types/src/schema/user";
import userService from "../services/user.service";

export class UserController extends BaseController<IUser> {
  constructor() {
    super(userService);
  }
}

export const userController = new UserController();
