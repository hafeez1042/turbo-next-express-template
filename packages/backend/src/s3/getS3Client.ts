import { S3Client } from "@aws-sdk/client-s3";

export const getS3Client = (
  region: string,
  accessKey?: string,
  secret?: string
) => {
  const params = accessKey
    ? {
        region: region,
        credentials: {
          accessKeyId: accessKey!,
          secretAccessKey: secret!,
        },
      }
    : {
        region: region,
      };

  return new S3Client(params);
};
