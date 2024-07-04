import { ErrorMessages, SuccessMessages } from "../errors/errorsMessages";

export interface IAPIResponse<D = object[] | object> {
  version?: string;
  // locale: Locale;
  success?: boolean;
  message?: SuccessMessages | ErrorMessages | string;
  errors?: string[];
  data?: D;
  validationErrors?: { [field: string]: string[] };
}
