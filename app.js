import "./config.js";
import { sessionConfig } from "./config.js";

import express, { urlencoded } from "express";
import mongoose from "mongoose";
import session from "express-session";
import flash from "connect-flash";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import passport from "passport";
import LocalStrategy from "passport-local";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";

import ExpressError from "./utils/ExpressError.js";
import campsRoute from "./routes/camps.js";
import userRoute from "./routes/user.js";
import helmetConfig from "./utils/helmetConfig.js";

// Just to let node work with ES6 modules(Все пойдет по пизде, если тронуть)
import { fileURLToPath } from "url";
import { join, dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Models
import User from "./models/user.js";

const mongoURL = process.env.MONGO_ATLAS_URL;
// Mongoose
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Express shit
const app = express();

// Setting EJS and flash msgs
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.use(flash());

// Хуйня для запросов
app.use(urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(mongoSanitize());

// Static shit
app.use(express.static("public"));

// Session
app.use(session(sessionConfig));
app.use(helmet());
app.use(helmet.contentSecurityPolicy(helmetConfig));

// Passport and auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("home");
});
app.use("/camps", campsRoute);
app.use("/user", userRoute);

// Handle All Request Errors
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

// Handling Errors
app.use((err, req, res, next) => {
  if (typeof err != "string") {
    if (!err.message) err.message = "Smth went wrong";
  } else {
    const msg = err;
    err = {
      message: msg,
    };
  }
  const { statusCode = 500 } = err;
  res.status(statusCode).render("error", { err });
});

// Running our shit
const port = process.argv[2];
const server = app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
