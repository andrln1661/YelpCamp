import Campground from "../models/campground.js";
import { cloudinary } from "../cloudinary/index.js";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";

// Get lang and lat for location
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });

export const index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("camps/campIndex", { campgrounds });
};

// Create
export const createForm = (req, res) => {
  res.render("camps/campNew");
};

export const create = async (req, res) => {
  const camp = new Campground(req.body.camp);
  const geoData = await geocoder
    .forwardGeocode({
      query: camp.location,
      limit: 1,
    })
    .send();
  camp.geometry = geoData.body.features[0].geometry;
  camp.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  camp.author = req.user.id;
  await camp.save();
  req.flash("success", "Successfully made a new campground");
  res.redirect(`/camps/${camp.id}`);
};

// Show Camp
export const campPage = async (req, res) => {
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
};

// Delete
export const deleteCamp = async (req, res, next) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/camps");
};

// Update
export const updateForm = async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  res.render("camps/campUpdate", { camp });
};

export const update = async (req, res, next) => {
  const camp = await Campground.findByIdAndUpdate(req.params.id, {
    ...req.body.camp,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  camp.images.push(...imgs);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  await camp.save();
  req.flash("success", "Successfully updated campground");
  res.redirect(`/camps/${req.params.id}`);
};
