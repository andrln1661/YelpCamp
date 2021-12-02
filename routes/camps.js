import catchAsync from "../utils/CatchAsync.js";
import { Router } from "express";
import {
  isSignedIn,
  isCampAuthor,
  isCamp,
  isReviewAuthor,
} from "../utils/middleware.js";
import * as camps from "../controllers/camps.js";
import * as reviews from "../controllers/reviews.js";

import Campground from "../models/campground.js";
import Review from "../models/review.js";
import { validateCamp, validateReview } from "../utils/validate.js";

// Routes
const router = Router();

router.route("/").get(catchAsync(camps.index));

router
  .route("/create")
  .get(isSignedIn, camps.createForm)
  .post(isSignedIn, validateCamp, catchAsync(camps.create));

router
  .route("/:id")
  .get(catchAsync(camps.campPage))
  .delete(isSignedIn, isCamp, isCampAuthor, catchAsync(camps.deleteCamp));

router
  .route("/:id/update")
  .get(isSignedIn, isCamp, isCampAuthor, catchAsync(camps.updateForm))
  .put(
    isSignedIn,
    isCamp,
    isCampAuthor,
    validateCamp,
    catchAsync(camps.update)
  );

// Reviews
router
  .route("/:id/reviews")
  .post(isSignedIn, validateReview, catchAsync(reviews.showReviews));

router
  .route("/:id/reviews/:reviewId")
  .delete(isSignedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

// Exports routes
export default router;
