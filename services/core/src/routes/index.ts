import { Router } from "express";
import { healthCheck } from "../controllers/health.controller";
import { userRoutes } from "./user.routes";

const routes: Router = Router();

routes.get("/health", healthCheck);

// Register all route modules
routes.use(userRoutes);

export { routes };
