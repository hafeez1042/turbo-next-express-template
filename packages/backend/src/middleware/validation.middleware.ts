import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/RequestValidationError";
import { RequestHandler } from "express";

export const validationMiddleware: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  console.log({ errors: errors.array() });

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  next();
};
