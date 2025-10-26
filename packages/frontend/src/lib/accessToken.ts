export const setAccessToken = (accessToken: string) => {
  if (typeof window !== "undefined")
  window.sessionStorage?.setItem("access-token", accessToken);
};

export const getAccessToken = () => {
  if (typeof window !== "undefined")
  return window.sessionStorage.getItem("access-token");
};

export const removeAccessToken = () => {
  if (typeof window !== "undefined")
  window.sessionStorage.removeItem("access-token");
};
