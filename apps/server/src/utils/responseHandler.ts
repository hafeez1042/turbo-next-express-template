import { SuccessMessages } from "../errors/errorsMessages";
import { IAPIV1Response } from "../types/ICRUDController";

export const v1Response = <T>(data?: T, message?: SuccessMessages | string): IAPIV1Response<T> => {
  return {
    version: "v1",
    success: true,
    message,
    data,
  };
};
