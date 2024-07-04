import { PutObjectCommand, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand  } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { S3Client as awsS3Client } from "@aws-sdk/client-s3";
const params = process.env.ACCESS_KEY_ID_AWS
  ? {
      region: process.env.REGION_AWS,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID_AWS!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS!,
      },
    }
  : {
      region: process.env.REGION_AWS,
    };
export const s3Client = new awsS3Client(params);

interface IGeneratePresignedPutUrlParams {
  filename: string;
  bucketName: string;
  contentType?: string;
  metadata?: Record<string, string>;
  publicRead?: boolean;
}

export const generatePresignedPutUrl = async ({
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
  fileName: string,
  contentType?: string,
  metadata?: Record<string, string>
) =>
  generatePresignedPutUrl({
    filename: fileName,
    bucketName: process.env.S3_DOCUMENTS_BUCKET!,
    contentType: contentType,
    metadata: metadata,
  });

export const generatePresignedReadUrl = (
  bucketName: string,
  objectKey: string
) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 60 * 60 });
};

export const moveFile = async (bucketName: string, sourceObjectKey: string, targetObjectKey: string) => {
  try {
    await s3Client.send(new CopyObjectCommand({
      Bucket: bucketName,
      CopySource: `/${bucketName}/${sourceObjectKey}`,
      Key: targetObjectKey,
    }));

    await s3Client.send(new DeleteObjectCommand({
      Bucket: bucketName,
      Key: sourceObjectKey,
    }));

    console.log('File moved successfully');
  } catch (err) {
    console.error('Error moving file:', err);
    throw err;
  }
}
