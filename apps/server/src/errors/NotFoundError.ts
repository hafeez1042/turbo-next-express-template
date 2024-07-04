import { CustomError } from "./CustomError";
// import logger from "../utils/logger";

const message = "Not Found";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    // logger.error(message)
    return [{ message: message }];
  }
}
