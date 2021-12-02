import catchAsync from "../utils/CatchAsync.js";
import { Router } from "express";
import { isSignedIn, isCampAuthor, isCamp, isReviewAuthor } from "../utils/middleware.js";

import Campground from "../models/campground.js";
import Review from "../models/review.js";
import { validateCamp, validateReview } from "../utils/validate.js";

// Routes
const router = Router();

router.route("/").get(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("camps/campIndex", { campgrounds });
});

router
  .route("/create")
  .get(isSignedIn, (req, res) => {
    res.render("camps/campNew");
  })
  .post(
    isSignedIn,
    validateCamp,
    catchAsync(async (req, res) => {
      const camp = new Campground(req.body.camp);
      camp.author = req.user.id;
      await camp.save();
      req.flash("success", "Successfully made a new campground");
      res.redirect(`/camps/${camp.id}`);
    })
  );

router
  .route("/:id")
  .get(
    catchAsync(async (req, res) => {
      const camp = await Campground.findById(req.params.id)
        .populate("author")
        .populate({
          path: "reviews",
          populate: {
            path: "author",
          },
        });
      if (!camp) {
        req.flash("error", "Cannot find this campground");
        return res.redirect("/camps");
      }
      res.render("camps/campPage", { camp });
    })
  )
  .delete(
    isSignedIn,
    isCamp,
    isCampAuthor,
    catchAsync(async (req, res, next) => {
      await Campground.findByIdAndDelete(req.params.id);
      req.flash("success", "Successfully deleted campground");
      res.redirect("/camps");
    })
  );

router
  .route("/:id/update")
  .get(
    isSignedIn,
    isCamp,
    isCampAuthor,
    catchAsync(async (req, res) => {
      const camp = await Campground.findById(req.params.id);
      res.render("camps/campUpdate", { camp });
    })
  )
  .put(
    isSignedIn,
    isCamp,
    isCampAuthor,
    validateCamp,
    catchAsync(async (req, res, next) => {
      const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.camp });
      req.flash("success", "Successfully updated campground");
      res.redirect(`/camps/${req.params.id}`);
    })
  );

// Reviews
router.route("/:id/reviews").post(
  isSignedIn,
  validateReview,
  catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user.id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash("success", "Created new review!");
    res.redirect(`/camps/${req.params.id}`);
  })
);

router.route("/:id/reviews/:reviewId").delete(
  isSignedIn,
  isReviewAuthor,
  catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/camps/${req.params.id}`);
  })
);

// Exports routes
export default router;
