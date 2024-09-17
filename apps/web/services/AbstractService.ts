import { APIError } from "@repo/frontend/errors/APIError";
import { getHttp } from "../utils/getHttp";
import { getQueryParams } from "../utils/getQueryParams";
import { IAPIV1Response, IQueryStringParams } from "@repo/types/lib/types";
import { AxiosError, AxiosInstance } from "axios";

export abstract class AbstractServices<
  T = Object,
  TGetAll = T,
  TCreate = T,
  TGetByID = T,
  TUpdate = T,
> {
  protected http: AxiosInstance;

  constructor(url: string) {
    this.http = getHttp(url);
  }

  public getAll = async (
    queryParams?: IQueryStringParams
  ): Promise<TGetAll[]> => {
    try {
      const response = await this.http.get<IAPIV1Response<TGetAll[]>>(
        `/?${queryParams ? getQueryParams(queryParams) : ""}`
      );
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new APIError(response.data as IAPIV1Response);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };

  public getById = async (id: string): Promise<TGetByID> => {
    try {
      const response = await this.http.get<IAPIV1Response<TGetByID>>(`/${id}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new APIError(response.data as IAPIV1Response);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };

  public update = async (id: string, data: Partial<T>): Promise<TUpdate> => {
    try {
      const response = await this.http.put<IAPIV1Response<TUpdate>>(
        `/${id}`,
        data
      );
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new APIError(response.data as IAPIV1Response);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };

  public create = async (data: T): Promise<TCreate> => {
    try {
      const response = await this.http.post<IAPIV1Response<TCreate>>(`/`, data);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new APIError(response.data as IAPIV1Response);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };

  public delete = async (id: string): Promise<null> => {
    try {
      const response = await this.http.delete<IAPIV1Response>(`/${id}`);
      if (response.data.success) {
        return null;
      } else {
        throw new APIError(response.data as IAPIV1Response);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };

  protected apiError = (error: unknown) => {
    const _error = error as AxiosError;
    return new APIError(
      _error.response.data as IAPIV1Response,
      _error.message,
      _error.response.status
    );
  };
}
