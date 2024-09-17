import { BadRequestError } from "@repo/backend/lib/errors/BadRequestError";

export const serviceNotAvailableMiddleware = (req, res, next) => {
  throw new BadRequestError("Service temporarily unavailable!");
};
