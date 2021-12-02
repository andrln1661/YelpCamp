import catchAsync from "../utils/CatchAsync.js";
import { Router } from "express";
import ExpressError from "../utils/ExpressError.js";
import passport from "passport";

import * as users from "../controllers/users.js";

// Routes
const router = Router();

router
  .route("/signin")
  .get(users.signinForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/user/signin",
    }),
    users.signin
  );

router.route("/signup").get(users.signupForm).post(catchAsync(users.signup));

router.route("/signout").get(users.signout);

export default router;
