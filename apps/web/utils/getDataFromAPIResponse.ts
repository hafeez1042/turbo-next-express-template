import { IAPIV1Response } from "@repo/types/lib/types";

export const getDataFromAPIResponse = <T>(
  promise?: Promise<IAPIV1Response<T>>
): (() => Promise<T>) => {
  if (!promise) return () => Promise.resolve(undefined);

  return () => promise.then((response) => response.data);
};
