import { CustomError } from './CustomError';

const errorMessage = "Resource Conflict: Please ensure creation is complete or resolve conflicts."// "The requested resource is in a conflicted state due to incomplete creation or conflicting changes. Please ensure that the resource is fully created before attempting to access it, or resolve any conflicts before retrying your request."

export class ConflictError extends CustomError {
  statusCode = 409;

  constructor(public message: string = errorMessage) {
    super(message);

    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serializeErrors() {
    // logger.error(this.message)
    return [{ message: this.message }];
  }
}
