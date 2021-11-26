const express = require("express");
const mongoose = require("mongoose");
const colors = require("colors");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError")
const campsRoute = require("./router/camps");
const methodOverride = require("method-override");
const path = require("path");

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

const Campground = require("./models/campground");

// Express shit
const app = express();
app.engine('ejs', ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Home Route
app.get("/", (req, res) => {
  res.render("home");
});

// Camps Route

app.use("/camps", campsRoute);

// Handle All Requests
app.all('*', (req,res,next)=>{
  next(new ExpressError('Page not found', 404))
})

// Handling Errors
app.use((err,req,res,next)=>{
  const {statusCode = 500} = err;
  if (!err.message) err.message = "Smth went wrong";
  res.status(statusCode).render('error', {err})
})

// Running our shit
const port = process.argv[2];
const server = app.listen(port, () => {
  console.log(`App is listening on port ${port}`.black.bgGreen);
});

