import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import deserializeUser from "./middleware/deserializeUser";

const port = config.get<number>("port");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: config.get("origin"),
    credentials: true,
  })
); 
console.log(process.env.NODE_ENV);

app.use(deserializeUser);

app.listen(port, async () => {
  logger.info(`\nApp is running at http://localhost:${port}`);

  await connect();

  routes(app);
});