import { Express, Request, Response } from "express";
import {
  createProductHandler,
  deleteProductHandler,
  getAllProductHandler,
  getProductHandler,
  getUserProducts,
  updateProductHandler,
} from "./controller/product.controller";
import {
  approvePurchaseRequestHandler,
  deletePurchaseRequestHandler,
  getReceivedPurchaseRequestHandler,
  getSendedPurchaseRequestHandler,
  purchaseRequestHandler,
  rejectPurchaseRequestHandler,
} from "./controller/purchase.contoller";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "./controller/session.controller";
import {
  createUserHandler,
  getCurrentUser,
  updateUserHandler,
} from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validate from "./middleware/validateResource";
import {
  createProductSchema,
  deleteProductSchema,
  updateProductSchema,
} from "./schema/product.schema";
import { purchaseRequestSchema } from "./schema/purchase.schema";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema, updateUserSchema } from "./schema/user.schema";

const routes = (app: Express) => {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  app.get("/env", (req: Request, res: Response) =>
    res.send(process.env.NODE_ENV)
  );

  app.get("/api/user/:userId", requireUser, getCurrentUser);

  //user registration
  app.post("/api/users", validate(createUserSchema), createUserHandler);

  app.put(
    "/api/user/:userId",
    [requireUser, validate(updateUserSchema)],
    updateUserHandler
  );

  app.post(
    "/api/sessions",
    validate(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  app.delete("/api/sessions", requireUser, deleteSessionHandler);
  // ------------------
  app.post(
    "/api/products",
    [requireUser, validate(createProductSchema)],
    createProductHandler
  );

  app.put(
    "/api/products/:productId",
    [requireUser, validate(updateProductSchema)],
    updateProductHandler
  );

  app.get("/api/:userId/products", requireUser, getUserProducts);

  app.get("/api/all-products", getAllProductHandler);

  app.get("/api/products/:productId", getProductHandler);

  app.delete(
    "/api/products/:productId",
    [requireUser, validate(deleteProductSchema)],
    deleteProductHandler
  );

  app.post(
    "/api/purchase-request/:productId",
    [requireUser, validate(purchaseRequestSchema)],
    purchaseRequestHandler
  );

  app.get(
    "/api/get-received-purchase-requests/:userId/",
    requireUser,
    getReceivedPurchaseRequestHandler
  );

  app.get(
    "/api/get-sended-purchase-requests/:userId",
    requireUser,
    getSendedPurchaseRequestHandler
  );

  app.delete(
    "/api/reject-purchase-request/:purchaseId",
    requireUser,
    rejectPurchaseRequestHandler
  );

  app.post(
    "/api/approve-purchase-request/:purchaseId",
    requireUser,
    approvePurchaseRequestHandler
  );

  app.delete(
    "/api/delete-purchase-request/:purchaseId",
    requireUser,
    deletePurchaseRequestHandler
  );
};

export default routes;
