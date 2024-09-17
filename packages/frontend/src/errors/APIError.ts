import { IAPIV1Response } from "@repo/types/lib/types";

export class APIError<T = IAPIV1Response> extends Error {
  public response: T;
  public status: number;

  constructor(
    response: T,
    message: string = "Failed to fetch data",
    status?: number
  ) {
    super(message); // Pass the message to the base Error class
    this.name = "API Error"; // Set a custom name for the error
    this.response = response; // Attach a JavaScript object with additional error details
    this.status = status;

    // Maintaining proper stack trace in V8 environments like Chrome
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
  }
}
