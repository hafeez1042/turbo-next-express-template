import { IAPIV1Response } from "@repo/types/lib/types";
import { AbstractServices } from "./AbstractService";
import { IUser } from "@repo/types/lib/schema/user";
import { ICurrentUser } from "../types";

class UserServices extends AbstractServices<IUser> {
  constructor() {
    super("/users");
  }

  getCurrentUser = async (): Promise<
    IAPIV1Response<{ user: ICurrentUser }>
  > => {
    const response = await this.http.get("/me");
    return response.data;
  };
}

export const userServices = Object.freeze(new UserServices());
