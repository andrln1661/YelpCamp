import dotenv from "dotenv";
import MongoStore from "connect-mongo";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const secret = process.env.SECRET || "thisshoulbeabettersecret",

export const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_ATLAS_URL,
    touchAfter: 24 * 3600,
    secret
  }),
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  // Cookies
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
