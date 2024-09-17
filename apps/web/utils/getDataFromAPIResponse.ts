import { IAPIV1Response } from "@repo/types/lib/types";

export const getDataFromAPIResponse = async <T>(
  promise?: Promise<IAPIV1Response<T>>
): Promise<T> => {
  if (!promise) return Promise.resolve(undefined);

  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error; // Rethrow to handle in parent
  }
};
