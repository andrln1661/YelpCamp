import Campground from "../models/campground.js";

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
  await Campground.findByIdAndUpdate(req.params.id, {
    ...req.body.camp,
  });
  req.flash("success", "Successfully updated campground");
  res.redirect(`/camps/${req.params.id}`);
};
