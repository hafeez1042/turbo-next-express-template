import { IAPIV1Response } from "@repo/types/lib/types";
import { AbstractServices } from "./AbstractService";
import { IUser } from "@repo/types/lib/schema/user";
import { ICurrentUser } from "../types";
import { APIError } from "@repo/frontend/errors/APIError";

class UserServices extends AbstractServices<IUser> {
  constructor() {
    super("/users");
  }

  getCurrentUser = async (): Promise<{ user: ICurrentUser }> => {
    try {
      const response =
        await this.http.get<IAPIV1Response<{ user: ICurrentUser }>>("/me");

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new APIError(response.data as IAPIV1Response);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };
}

export const userServices = Object.freeze(new UserServices());
