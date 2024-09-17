import {
  PutObjectCommand,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client } from "@aws-sdk/client-s3";

interface IGeneratePresignedPutUrlParams {
  s3Client: S3Client;
  filename: string;
  bucketName: string;
  contentType?: string;
  metadata?: Record<string, string>;
  publicRead?: boolean;
}

export const generatePresignedPutUrl = async ({
  s3Client,
  filename,
  bucketName,
  contentType,
  metadata,
}: IGeneratePresignedPutUrlParams) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: filename,
    ContentType: contentType,
    Metadata: metadata,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
};

export const generateDocumentPresignedPutUrl = (
  s3Client: S3Client,
  fileName: string,
  contentType?: string,
  metadata?: Record<string, string>
) =>
  generatePresignedPutUrl({
    s3Client,
    filename: fileName,
    bucketName: process.env.S3_DOCUMENTS_BUCKET!,
    contentType: contentType,
    metadata: metadata,
  });

export const generatePresignedReadUrl = (
  s3Client: S3Client,
  bucketName: string,
  objectKey: string
) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 60 * 60 });
};

export const moveFile = async (
  s3Client: S3Client,
  bucketName: string,
  sourceObjectKey: string,
  targetObjectKey: string
) => {
  try {
    await s3Client.send(
      new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: `/${bucketName}/${sourceObjectKey}`,
        Key: targetObjectKey,
      })
    );

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: sourceObjectKey,
      })
    );

    console.log("File moved successfully");
  } catch (err) {
    console.error("Error moving file:", err);
    throw err;
  }
};
