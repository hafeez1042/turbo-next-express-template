import { Router } from 'express';
import { profileRouter } from "./profiles.router";

const v1Router = Router();

v1Router.use("/profiles", profileRouter)

export {v1Router}
