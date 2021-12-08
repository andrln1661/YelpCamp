import Campground from "../models/campground.js";
import Review from "../models/review.js";

export const showReviews = async (req, res, next) => {
  const camp = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user.id;
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  req.flash("success", "Created new review!");
  res.redirect(`/camps/${req.params.id}`);
};

export const deleteReview = async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.reviewId);
  req.flash("success", "Successfully deleted review");
  res.redirect(`/camps/${req.params.id}`);
};
