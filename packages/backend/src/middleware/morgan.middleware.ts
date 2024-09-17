import morgan from "morgan";
import { morganStream } from "../helpers/logger";

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};
const morganMiddleware = morgan(
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  { stream: morganStream },
  skip
);


export default morganMiddleware;
