/**
 * Interface representing query string parameters for database operations.
 */
export interface IQueryStringParams {
  /** Optional. A query string for search operations. */
  q?: string;

  /** Optional. Filters to apply on the query. Should match the structure of the document being queried. */
  filter?: IFieldFilter;

  /** Optional. The field name to sort the results by. */
  orderBy?: string;

  /** Optional. The order of sorting: 'asc' for ascending, 'dsc' for descending. */
  order?: "asc" | "dsc";

  /** Optional. The maximum number of items to return. Used for pagination or limiting result size. */
  limit?: number;

  /** Optional. The number of items to skip. Used for offset-based pagination. */
  skip?: number;

  /** Optional. A cursor for cursor-based pagination. Typically, this is the identifier of the last item in the previous set of results. */
  cursor?: string;
}

export interface IFieldFilter {
  [field: string]: {
    startsWith?: string;
    contains?: string;
    endsWith?: string;
    eq?: valueType;
    neq?: valueType;
    lt?: number | null | Date;
    lte?: number | null | Date;
    gt?: number | null | Date;
    gte?: number | null | Date;
    in?: valueType[];
    nin?: valueType[];
    // Add more filter options as needed
  };
}

type valueType<T = unknown> = string | number | boolean | null | T;

export interface IAPIV1Response<D = object[] | object> {
  version: "v1";
  success: boolean;
  message?: string;
  errors?: string[];
  data?: D;
  validationErrors?: { [field: string]: string[] };
}

/**
 * Option type for react-select options
 */
export interface IOption {
  value: string | number;
  label: string;

  [key: string]: number | string | boolean;
}


export interface IBaseModelAttributes<T =  string> {
  createdBy?: string;
  updatedBy?: string;
  _id?: T;
  createdAt?: Date;
  updatedAt?: Date;
}


export enum FileTypeEnum {
  Image = "IMAGE",
  Video = "VIDEO",
  Audio = "AUDIO",
  Document = "DOCUMENT",
}
