import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { routes } from "./routes";
import sequelize from "./config/database";
import logger from "./config/logger";
import { swaggerSpec } from "./config/swagger";

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(express.json());
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Swagger documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", routes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection has been established successfully.");
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

startServer();

export default app;
