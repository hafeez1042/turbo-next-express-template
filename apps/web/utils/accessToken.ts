export const setAccessToken = (accessToken: string) => {
  if (typeof window !== "undefined")
  window.localStorage?.setItem("access-token", accessToken);
};

export const getAccessToken = () => {
  if (typeof window !== "undefined")
  return window.localStorage.getItem("access-token");
};

export const removeAccessToken = () => {
  if (typeof window !== "undefined")
  window.localStorage.removeItem("access-token");
};
