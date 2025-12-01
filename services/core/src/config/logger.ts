import winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, json, printf, colorize, align } = winston.format;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: "YYYY-MM-DD hh:mm:ss.SSS A",
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: `${process.env.LOG_DIR || "../../logs"}/application-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export default logger;
