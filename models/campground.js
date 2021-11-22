const mongoose = require("mongoose");
const { Schema } = mongoose;

const campgroundSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String,
  owner: String,
});

module.exports = mongoose.model("Campground", campgroundSchema);
