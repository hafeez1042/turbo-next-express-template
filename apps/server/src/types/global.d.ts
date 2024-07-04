import { ICognitoJWTUserData } from "./types";

//
declare global {
  namespace Express {
    interface Request {
      cognitoUser: ICognitoJWTUserData;

      clientTimeZone: string;
    }
  }
}
