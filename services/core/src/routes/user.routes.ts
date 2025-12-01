import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router: Router = Router();

// User routes
router.get("/users", userController.getAll);
router.get("/users/:id", userController.getById);
router.post("/users", userController.create);
router.put("/users/:id", userController.update);
router.delete("/users/:id", userController.delete);

export { router as userRoutes };
