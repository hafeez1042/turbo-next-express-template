import { AbstractServices } from "@repo/frontend/lib/AbstractService";
import { IUser } from "@repo/types/src/schema/user";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export class UserService extends AbstractServices<IUser> {
  constructor() {
    super(`${API_BASE_URL}/users`);
  }

  // Add custom methods here if needed
}

export const userService = new UserService();
