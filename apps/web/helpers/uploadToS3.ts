import axios, {
  AxiosRequestConfig,
  AxiosProgressEvent,
  GenericAbortSignal,
} from "axios";

export const uploadToS3 = async (
  presignedUrl: string,
  file: File | Buffer | Blob,
  config?: IConfig
) => {
  const { onUploadProgress, signal } = config || {};
  try {
    const isBuffer = Buffer.isBuffer(file);
    const options: AxiosRequestConfig<File> = {
      headers: {
        "Content-Type": isBuffer ? config.contentType : file.type,
      },
      onUploadProgress,
      signal,
    };
    await axios.put(presignedUrl, file, options);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

export interface IConfig {
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  signal?: GenericAbortSignal;
  contentType?: string;
}
