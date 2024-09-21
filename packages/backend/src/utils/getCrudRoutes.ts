import { RequestHandler, Router } from "express";
import { ICRUDController } from "../controller/ICRUDController";

const getCrudRoutes = (
  path: string,
  router: Router,
  controller: ICRUDController,
  middlewares: {
    common?: RequestHandler[];
    getById?: RequestHandler[];
    getAll?: RequestHandler[];
    create?: RequestHandler[];
    update?: RequestHandler[];
    delete?: RequestHandler[];
  } = {}
) => {
  if (middlewares.common) {
    router.use(middlewares.common);
  }
  router
    .get(path, (middlewares.getAll || []), controller.getAll!)
    .post(path, (middlewares.create || []), controller.create!)
    .get(`${path}/:id`, (middlewares.getById || []), controller.getById!)
    .put(`${path}/:id`, (middlewares.update || []), controller.update!)
    .delete(`${path}/:id`, (middlewares.delete || []), controller.delete!);

  return router;
};

export default getCrudRoutes;
