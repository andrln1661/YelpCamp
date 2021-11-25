const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");
let routePage = "";

router
  .route("/")
  .get(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("camps/campIndex", { campgrounds, routePage });
  })
  .post();

router
  .route("/create")
  .get((req, res) => {
    res.render("camps/campNew", { routePage });
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
    res.render("camps/campPage", { camp, routePage });
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
    res.render("camps/campUpdate", { camp, routePage });
  })
  .put(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(
      req.params.id,
      {...req.body.camp}
    ); 
    res.redirect(`/camps/${req.params.id}`);
  });

module.exports = router;
