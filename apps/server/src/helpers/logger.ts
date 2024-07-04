import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import Transport from "winston-transport";
import winston from "winston";
import {
  S3_APPLICATION_BUCKET_NAME,
  s3ClientApplication,
} from "./s3.applicationLog";

interface S3TransportOptions extends Transport.TransportStreamOptions {
  bucketName: string;
  s3Client: S3Client;
}

class S3Transport extends Transport {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(opts: S3TransportOptions) {
    super(opts);
    this.s3Client = opts.s3Client;
    this.bucketName = opts.bucketName;
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    const fileName = `logs/${new Date().toISOString()}.log`;
    const body = JSON.stringify(info);

    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: fileName,
          Body: body,
        },
      });

      await upload.done();
      console.log("Log uploaded to S3 successfully");
    } catch (error) {
      console.error("Error uploading log to S3:", error);
    }

    callback();
  }
}

const transports: winston.transport[] = [];

if (process.env.LOCAL === "true") {
  transports.push(
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
} else {
  transports.push(
    new S3Transport({
      bucketName: S3_APPLICATION_BUCKET_NAME,
      s3Client: s3ClientApplication,
      level: "info",
    })
  );
}

export const logger = winston.createLogger({
  transports,
});

export const morganStream = { write: (message) => logger.info(message.trim()) };
