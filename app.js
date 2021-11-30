import express, { urlencoded } from "express";
import mongoose from "mongoose";
import session from "express-session";
import colors from "colors";
import flash from "connect-flash";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import passport from "passport";
import LocalStrategy from "passport-local";

import ExpressError from "./utils/ExpressError.js";
import campsRoute from "./routes/camps.js";
import userRoute from "./routes/user.js";

// Just to let node work with ES6 modules(Все пойдет по пизде, если тронуть)
import { fileURLToPath } from "url";
import { join, dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Models
import User from "./models/user.js";
import Review from "./models/review.js";
import Campground from "./models/campground.js";

// Mongoose
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
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

// Static shit
app.use(express.static("public"));

// Session
const sessionConfig = {
  secret: "thisshoulbeabettersecret",
  resave: false,
  saveUninitialized: true,
  // Cookies
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// Passport and auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Home Route
app.get("/", (req, res) => {
  res.render("home");
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Camps Route
app.use("/camps", campsRoute);
app.use("/user", userRoute);

// Handle All Request Errors
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

// Handling Errors
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Smth went wrong";
  res.status(statusCode).render("error", { err });
});

// Running our shit
const port = process.argv[2];
const server = app.listen(port, () => {
  console.log(`App is listening on port ${port}`.black.bgGreen);
});
