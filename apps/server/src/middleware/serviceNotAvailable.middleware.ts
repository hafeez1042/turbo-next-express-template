import { BadRequestError } from "../errors/BadRequestError";

export const serviceNotAvailableMiddleware = (req, res, next) => {
    throw new BadRequestError("Service temporarily unavailable!")
};
