import { ErrorRequestHandler } from "express";
import { CustomError } from "./CustomError";
import { IAPIResponse } from "../types/IAPIResponse";

export const errorHandler: ErrorRequestHandler<unknown, IAPIResponse> = (
  err,
  req,
  res,
  next,
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof CustomError) {
    const errors = err.serializeErrors();
    return res.status(err.statusCode).send({
      success: false,
      // locale: Locale.enUS,
      errors: errors.map((error) => error.message),
    });
  }

  console.error("Error", err);
  res.status(400).send({
    success: false,
    // locale: Locale.enUS,
    errors: ["Something went wrong"],
  });
};
