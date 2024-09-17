import { CustomError } from './CustomError';

const message = "Error connecting to database";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;

  constructor() {
    super(message);

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: message }];
  }
}
