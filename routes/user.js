import catchAsync from "../utils/CatchAsync.js";
import { Router } from "express";
import ExpressError from "../utils/ExpressError.js";
import passport from "passport";

import User from "../models/user.js";

// Routes
const router = Router();

router
  .route("/signin")
  .get((req, res) => {
    res.render("user/signin");
  })
  .post(
    passport.authenticate("local", { failureFlash: true, failureRedirect: "/user/signin" }),
    (req, res) => {
      const redirectUrl = req.session.returnTo || "/camps";
      delete req.session.returnTo;
      req.flash("success", "Welcome back");
      res.redirect(redirectUrl);
    }
  );

router
  .route("/signup")
  .get((req, res) => {
    res.render("user/signup");
  })
  .post(
    catchAsync(async (req, res) => {
      try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registredUser = await User.register(user, password);
        req.login(registredUser, (err) => {
          if (err) return next(err);
          req.flash("success", "Welcome back");
          res.redirect("/camps");
        });
        req.flash("success", "Signed Up");
        res.redirect("/camps");
      } catch (e) {
        req.flash("error", e.message);
        res.redirect("signup");
      }
    })
  );

router.route("/signout").get((req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/camps");
});

export default router;
