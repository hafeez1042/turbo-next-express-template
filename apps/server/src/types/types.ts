export interface ICognitoJWTUserData {
  sub: string;
  iss: string;
  origin_jti: string;
  // event_id: string;
  token_use: string;
  // scope: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  "cognito:username": string;
  email: string;
}
