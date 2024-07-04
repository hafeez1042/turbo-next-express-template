require("dotenv").config();
import "express-async-errors";

import swaggerUi from "swagger-ui-express";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import {router} from "./routes";
import { ForbiddenError } from "./errors/ForbiddenError";
import { NotFoundError } from "./errors/NotFoundError";
import { errorHandler } from "./errors/errorHandler";
import morganMiddleware from "./middleware/morgan.middleware";
import swaggerSpec from "./swagger/swaggerSpec";
import { clientTimeZoneMiddleware } from "./middleware/clientTimeZone.middleware";

const allowList =
  process.env.ALLOWED_IP_LIST?.split(",").map((ip) => ip.trim()) || [];

const app = express();

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
  })
);

app.use(morganMiddleware);

app.use(cors());

// Apply the IP-based access control middleware to all routes
app.use((req, res, next) => {
  const clientIP = req.ip;

  if (!allowList || !allowList.length || allowList.includes(clientIP!)) {
    next();
  } else {
    throw new ForbiddenError();
  }
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

// Graceful shutdown function
function gracefulShutdown() {
  console.log("Shutting down gracefully...");

  // app.close(() => {
  //   console.log("Closed out remaining connections");
  //   // Here you can also close other resources like database connections
  //   process.exit(0);
  // });

  // If server hasn't finished in a timely manner, force close
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000); // 10 seconds
}

// For nodemon restarts
process.once("SIGUSR2", function () {
  gracefulShutdown();
  process.kill(process.pid, "SIGUSR2");
});

// For app termination
process.on("SIGINT", gracefulShutdown);

// For Heroku app termination
process.on("SIGTERM", gracefulShutdown);

app.use(helmet()); // https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
// app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(clientTimeZoneMiddleware);
app.use("/", router);

//customCssUrl:
//"https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
//"https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css"

// catch 404 and forward to error handler
app.use((req, res, next) => {
  console.log(req.url);

  throw new NotFoundError();
});

// pass any unhandled errors to the error handler
app.use(errorHandler);

export { app };

//if running app.js directly with nodemon app.js
// const PORT = process.env.PORT || 3000;
// app.listen(PORT);

// console.debug("Server listening on port: " + PORT);
