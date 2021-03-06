import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import deserializeUser from "./middleware/deserializeUser";

const port = config.get<number>("port");

const app = express();

app.use(express.json({ limit: "5mb" }));

app.use(
  cors({
    origin: config.get<string[]>("origin"),
    credentials: true,
  })
);

app.use(cookieParser());

app.use(deserializeUser);

app.listen(port, async () => {
  logger.info(`\nApp is running at http://localhost:${port}`);
  await connect();

  routes(app);
});
