import express, { urlencoded } from "express";
import mongoose from "mongoose";
import colors from "colors";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import campsRoute from "./router/camps.js";
import methodOverride from "method-override";
// Just to let node work with ES6 modules
import { fileURLToPath } from "url";
import { join, dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.use(urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Home Route
app.get("/", (req, res) => {
  res.render("home");
});

// Camps Route

app.use("/camps", campsRoute);

// Handle All Requests
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
