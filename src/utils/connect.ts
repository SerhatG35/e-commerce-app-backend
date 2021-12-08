import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

const connect = async () => {
  const dbUri = config.get<string>("dbUri");

  try {
    await mongoose.connect(dbUri);
    logger.info("\nConnected to DB");
  } catch (error) {
    logger.error("\nConnection to DB is failed");
    process.exit(1);
  }
};

export default connect;
