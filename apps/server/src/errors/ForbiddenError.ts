import { CustomError } from './CustomError';
// import logger from "../utils/logger";

const message = 'Access Forbidden';

export class ForbiddenError extends CustomError {
  statusCode = 403;

  constructor() {
    super(message);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    // logger.error(message)
    return [{ message: message }];
  }
}
