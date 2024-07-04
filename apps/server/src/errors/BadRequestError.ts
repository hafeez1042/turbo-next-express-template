import { CustomError } from './CustomError';
// import logger from "../utils/logger";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    // logger.error(this.message)
    return [{ message: this.message }];
  }
}
