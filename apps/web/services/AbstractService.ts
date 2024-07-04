import { getHttp } from "../utils/getHttp";
import { getQueryParams } from "../utils/getQueryParams";
import { IAPIV1Response, IQueryStringParams } from "@repo/types/lib/types";
import { AxiosInstance } from "axios";

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
  ): Promise<IAPIV1Response<TGetAll[]>> => {
    const response = await this.http.get(
      `/?${queryParams ? getQueryParams(queryParams) : ""}`
    );
    return response.data;
  };

  public getById = async (id: string): Promise<IAPIV1Response<TGetByID>> => {
    const response = await this.http.get(`/${id}`);
    return response.data;
  };

  public update = async (
    id: string,
    data: Partial<T>
  ): Promise<IAPIV1Response<TUpdate>> => {
    const response = await this.http.put(`/${id}`, data);
    return response.data;
  };

  public create = async (data: T): Promise<IAPIV1Response<TCreate>> => {
    const response = await this.http.post(`/`, data);
    return response.data;
  };

  public delete = async (id: string): Promise<IAPIV1Response> => {
    const response = await this.http.delete(`/${id}`);
    return response.data;
  };
}
