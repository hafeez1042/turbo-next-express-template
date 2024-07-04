import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const s3ClientApplication = new S3Client({
  region: process.env.REGION_AWS,
});

export const S3_APPLICATION_BUCKET_NAME = process.env.S3_APPLICATION_BUCKET!;

export const s3Stream = (type: string) => ({
  write: (text) => {
    // Define the S3 PutObject parameters
    const params = {
      Bucket: S3_APPLICATION_BUCKET_NAME,
      Key: `${type}:log-${Date.now()}.txt`, // Unique name for each log file
      Body: text,
    };

    // Create and send a PutObjectCommand
    const command = new PutObjectCommand(params);
    s3ClientApplication
      .send(command)
      .then(() => console.log("Log successfully uploaded to S3"))
      .catch((err) => console.error("Error uploading log to S3:", err));
  },
});
