const catchAsync = require("../utils/CatchAsync")
const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError")
const Joi = require("joi")
const {campSchema} = require("../schemas")

const Campground = require("../models/campground");

const validateCamp = (req, res, next) => {
  const { error } = campSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

router
  .route("/")
  .get(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("camps/campIndex", { campgrounds});
  })

router
  .route("/create")
  .get((req, res) => {
    res.render("camps/campNew");
  })
  .post(validateCamp, catchAsync(async (req, res) => {
    const camp = new Campground(req.body.camp);
    await camp.save();
    res.redirect(`/camps/${camp.id}`);
  }));

router
  .route("/:id")
  .get(catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render("camps/campPage", { camp });
  }))
  .delete(catchAsync(async (req, res,next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/camps");
  }));

router
  .route("/:id/update")
  .get(catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render("camps/campUpdate", { camp });
  }))
  .put(validateCamp, catchAsync(async (req, res,next) => {
    if(!req.body.camp) throw new ExpressError('Invalid Camp Data', 400)
      const camp = await Campground.findByIdAndUpdate(
        req.params.id,
        {...req.body.camp}
      ); 
      res.redirect(`/camps/${req.params.id}`);  
  }));



module.exports = router;
