import { APIError } from "../errors/APIError";
import { getHttp } from "./getHttp";
import { getQueryParams } from "./getQueryParams";
import { IAPIV1Response, IQueryStringParams } from "../types/lib/types";
import { IBaseServices } from "../types/IBaseServices";
import { AxiosError, AxiosInstance } from "axios";

export abstract class AbstractServices<
  T = {},
  TGetAll = T,
  TCreate = T,
  TGetByID = T,
  TUpdate = T,
> implements IBaseServices<T>
{
  protected http: AxiosInstance;

  constructor(url: string, accessToken?: string) {
    this.http = getHttp(url, accessToken);
  }

  public getAll = async <R = TGetAll[]>(
    queryParams?: IQueryStringParams
  ): Promise<R> => {
    try {
      const response = await this.http.get<IAPIV1Response<R>>(
        `/?${queryParams ? getQueryParams(queryParams) : ""}`
      );
      if (response?.data?.success) {
        return response.data.data;
      } else {
        throw new APIError(response?.data as IAPIV1Response);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };

  public getById = async <R = TGetByID>(id: string): Promise<R> => {
    try {
      const response = await this.http.get<IAPIV1Response<R>>(`/${id}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new APIError(response.data as IAPIV1Response);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };

  public update = async <UResponse = TUpdate, UData = UResponse>(
    id: string,
    data: Partial<UData>
  ): Promise<UResponse> => {
    try {
      const response = await this.http.put<IAPIV1Response<UResponse>>(
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

  public create = async <CResponse = TCreate, CData = CResponse>(
    data: CData
  ): Promise<CResponse> => {
    try {
      const response = await this.http.post<IAPIV1Response<CResponse>>(
        `/`,
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
      _error.response?.data as IAPIV1Response,
      _error.message,
      _error.response?.status
    );
  };
}
