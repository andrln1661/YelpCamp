const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");

router
  .route("/")
  .get(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("camps/campIndex", { campgrounds});
  })
  .post();

router
  .route("/create")
  .get((req, res) => {
    res.render("camps/campNew");
  })
  .post(async (req, res) => {
    const camp = new Campground(req.body.camp);
    await camp.save();
    res.redirect(`/camps/${camp.id}`);
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render("camps/campPage", { camp });
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/camps");
  });

router
  .route("/:id/update")
  .get(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render("camps/campUpdate", { camp });
  })
  .put(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(
      req.params.id,
      {...req.body.camp}
    ); 
    res.redirect(`/camps/${req.params.id}`);
  });

module.exports = router;
