import Campground from "../models/campground.js";
import Review from "../models/review.js";

export const isSignedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    return res.redirect("/user/signin");
  }
  next();
};

export const isCamp = async (req, res, next) => {
  const camp = await Campground.findById(req.params.id);
  if (!camp) {
    req.flash("error", "Cannot fint that campground");
    return res.redirect("/camps");
  }
  next();
};

export const isCampAuthor = async (req, res, next) => {
  const camp = await Campground.findById(req.params.id);
  if (!camp.author.equals(req.user.id)) {
    req.flash("error", "You dont have perrmision to do that");
    return res.redirect(`/camps/${camp.id}`);
  }
  next();
};

export const isReviewAuthor = async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review.author.equals(req.user.id)) {
    req.flash("error", "You dont have perrmision to do that");
    return res.redirect(`/camps/${req.params.id}`);
  }
  next();
};
