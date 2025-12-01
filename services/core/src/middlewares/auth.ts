import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

// Placeholder for actual authentication logic
// You might want to import a verifyToken function from @repo/backend or implement it here
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn("Missing authorization header");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Missing token");
    return res.status(401).json({ message: "Unauthorized" });
  }

  // TODO: Verify token
  // try {
  //   const decoded = verifyToken(token);
  //   req.user = decoded;
  //   next();
  // } catch (error) {
  //   logger.error('Invalid token', error);
  //   return res.status(403).json({ message: 'Forbidden' });
  // }

  next();
};
