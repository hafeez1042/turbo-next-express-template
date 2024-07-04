import axios from "axios";
import { getAccessToken } from "./accessToken";
import { fetchAuthSession } from "../helpers/cognito";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getHttp = (baseUrl: string) => {
  const http = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}${baseUrl}`,
    headers: {
      "X-Time-Zone": timeZone
    }
    // withCredentials: true,
  });

  http.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        if (config.headers) config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  http.interceptors.response.use(
    (response) => {
      // Any status code within the range of 2xx will cause this function to trigger
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      // Check if the error is due to an expired token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Marking request as retried
        try {
          const session = await fetchAuthSession();
          const token = session.tokens?.accessToken?.toString();
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          return http(originalRequest); // Retrying the original request with new token
        } catch (sessionError) {
          console.error("Error refreshing token:", sessionError);
          return Promise.reject(sessionError);
        }
      }
      return Promise.reject(error);
    }
  );

  // http.interceptors.response.use(
  //   (response) => {
  //     if (response?.data?.status?.error?.errorCode === 403) logout();
  //     if (response?.data?.status?.error?.errorCode === 401) {
  //       return handle401(response.config);
  //     }
  //     //Need to add if something is required to do with response
  //     return response;
  //   },
  //   async (err) => {
  //     if (axios.isCancel(err))
  //       console.log("Axios Request cancelled ", err.message);
  //     else {
  //       if (
  //         err?.response?.status === 403 ||
  //         err?.response?.data?.status?.error?.errorCode === 403
  //       )
  //         logout();
  //       if (err?.response?.status === 401) {
  //         return handle401(err.config);
  //       }
  //       return Promise.reject(err);
  //     }
  //   }
  // );

  return http;

  // async function handle401(config: AxiosRequestConfig) {
  //   const token = window.localStorage.getItem("accessToken");
  //   if (!token) {
  //     await waitToSetAccessToken();
  //     const updatedToken = window.localStorage.getItem("accessToken");

  //     config.headers = {
  //       ...config.headers,
  //       AuthorizationX: "Bearer " + updatedToken,
  //     };
  //     return axios(config);
  //   }

  //   return refreshAccessToken(config);
  // }

  // const refreshAccessToken = (config: AxiosRequestConfig) => {
  // const accessToken = window.localStorage.getItem("accessToken");
  // window.localStorage.removeItem("accessToken");
  // return new Promise((resolve, reject) => {
  //   const refreshToken = window.localStorage.getItem("refreshToken");
  //   axios
  //     .post(
  //       `${getBaseUrl(API_CATEGORY.user)}${
  //         API_CATEGORY.user
  //       }${VERSION}/auth/refresh`,
  //       { refreshToken: refreshToken },
  //       {
  //         headers: {
  //           AuthorizationX: `Bearer ${accessToken}`,
  //         },
  //       }
  //     )
  //     .then(async (res) => {
  //       const updatedAccessToken = res?.data?.data?.accessToken;
  //       window.localStorage.setItem("accessToken", updatedAccessToken);
  //       http.defaults.headers.common[
  //         "AuthorizationX"
  //       ] = `Bearer ${updatedAccessToken}`;
  //       const response = await http(config);
  //       resolve(response);
  //     })
  //     .catch((error) => {
  //       reject(Promise.reject(error));
  //     });
  // });
  // };

  // const waitToSetAccessToken = (): Promise<void> =>
  //   new Promise((resolve, reject) => {
  // const waitAccessTokenInterval = setInterval(() => {
  //   if (window.localStorage.getItem("accessToken")) {
  //     clearInterval(waitAccessTokenInterval);
  //     resolve();
  //   }
  // }, 300);
  // });
};
