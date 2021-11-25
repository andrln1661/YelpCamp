const mongoose = require("mongoose");
const { Schema } = mongoose;

const campgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  owner: String,
  image: String
});

module.exports = mongoose.model("Campground", campgroundSchema);
