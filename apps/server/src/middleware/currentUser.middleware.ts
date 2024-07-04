import { NotAuthorizedError } from "../errors/NotAuthorizedError";
import { RequestHandler } from "express";
import { ICognitoJWTUserData } from "../types/types";

export const currentUserMiddleware: RequestHandler<
  unknown,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  // Check that the request contains a token
  if (req.headers?.authorization?.split(" ")[0] !== "Bearer") {
    throw new NotAuthorizedError("No token provided");
  }
  // Validate the token
  const base64String = req.headers.authorization.split(" ")[1].split(".")[1];
  const data: ICognitoJWTUserData = JSON.parse(
    Buffer.from(base64String, "base64").toString("utf-8")
  );

  const isUserCreateCall =
    req.originalUrl === "/v1/users" && req.method === "POST";

  if (isUserCreateCall) {
    req.cognitoUser = data;
    return next();
  }


  next();
};
