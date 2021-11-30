import catchAsync from "../utils/CatchAsync.js";
import { Router } from "express";
import ExpressError from "../utils/ExpressError.js";
import User from "../models/user.js";

// Routes
const router = Router();

router
  .route("/signin")
  .get((req, res) => {
    res.render("user/signin");
  })
  .post(catchAsync(async (req, res) => {}));

router
  .route("/signup")
  .get((req, res) => {
    res.render("user/signup");
  })
  .post(
    catchAsync(async (req, res) => {
      res.send(req.body);
    })
  );

export default router;
