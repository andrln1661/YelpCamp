import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const sessionConfig = {
  name: "session",
  secret: "thisshoulbeabettersecret",
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
