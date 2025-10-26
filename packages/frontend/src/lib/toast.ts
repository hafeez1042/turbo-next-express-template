import { toast } from "sonner";
// import { AxiosError } from "axios";

export const successToast = (message: string) => toast.success(message);

export const warningToast = (message: string) => toast.warning(message);

export const errorToast = (error: unknown) => {
  if (typeof error === "string") {
    toast.error(error);
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const axiosError = error as any; //AxiosError<{ error: string[] }>;
  if (axiosError?.response?.errors?.[0]) {
    toast.error(axiosError?.response?.errors?.[0]);
  } else {
    toast.error(axiosError.message);
  }
};
