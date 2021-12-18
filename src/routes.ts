import { Express, Request, Response } from "express";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "./controller/session.controller";
import {
  createUserHandler,
  getCurrentUser,
} from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validate from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";

const routes = (app: Express) => {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  app.get("/env", (req: Request, res: Response) =>
    res.send(process.env.NODE_ENV)
  );

  app.get("/api/me", requireUser, getCurrentUser);

  //user registration
  app.post("/api/users", validate(createUserSchema), createUserHandler);

  app.post(
    "/api/sessions",
    validate(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  app.delete("/api/sessions", requireUser, deleteSessionHandler);
};

export default routes;
