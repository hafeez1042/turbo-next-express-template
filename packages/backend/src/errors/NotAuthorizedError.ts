import { CustomError } from './CustomError';
// import logger from "../utils/logger";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  message: string;

  constructor(message = 'Not Authorized') {
    super(message);

    this.message = message;


    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    // logger.error(message)
    return [{ message: this.message }];
  }
}
