import catchAsync from "../utils/CatchAsync.js";
import { Router } from "express";
import ExpressError from "../utils/ExpressError.js";

import { campSchema, reviewSchema } from "../schemas.js";
import Campground from "../models/campground.js";
import Review from "../models/review.js";

// Form Validations
const validateCamp = (req, res, next) => {
  const { error } = campSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Routes
const router = Router();

router.route("/").get(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("camps/campIndex", { campgrounds });
});

router
  .route("/create")
  .get((req, res) => {
    res.render("camps/campNew");
  })
  .post(
    validateCamp,
    catchAsync(async (req, res) => {
      const camp = new Campground(req.body.camp);
      await camp.save();
      req.flash("success", "Successfully made a new campground");
      res.redirect(`/camps/${camp.id}`);
    })
  );

router
  .route("/:id")
  .get(
    catchAsync(async (req, res) => {
      const camp = await Campground.findById(req.params.id).populate("reviews");
      if (!camp) {
        req.flash("error", "Cannot find this campground");
        return res.redirect("/camps");
      }
      res.render("camps/campPage", { camp });
    })
  )
  .delete(
    catchAsync(async (req, res, next) => {
      const { id } = req.params;
      await Campground.findByIdAndDelete(id);
      req.flash("success", "Successfully deleted campground");
      res.redirect("/camps");
    })
  );

router
  .route("/:id/update")
  .get(
    catchAsync(async (req, res) => {
      const camp = await Campground.findById(req.params.id);
      res.render("camps/campUpdate", { camp });
    })
  )
  .put(
    validateCamp,
    catchAsync(async (req, res, next) => {
      if (!req.body.camp) throw new ExpressError("Invalid Camp Data", 400);
      const camp = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.camp });
      req.flash("success", "Successfully updated campground");
      res.redirect(`/camps/${req.params.id}`);
    })
  );

router.route("/:id/reviews").post(
  validateReview,
  catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash("success", "Created new review!");
    res.redirect(`/camps/${req.params.id}`);
  })
);

router.route("/:id/reviews/:reviewId").delete(
  catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/camps/${req.params.id}`);
  })
);

// Exports routes to app.js
export default router;
