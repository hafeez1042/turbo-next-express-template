import * as auth from "aws-amplify/auth";
import { removeAccessToken, setAccessToken } from "../utils/accessToken";

export const fetchAuthSession = async () =>
  auth.fetchAuthSession().then((session) => {
    const token = session.tokens?.idToken?.toString();
    if (token) {
      setAccessToken(token);
    } else {
      removeAccessToken();
    }

    return session;
  });
