import dotenv from "dotenv";
import MongoStore from "connect-mongo";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
