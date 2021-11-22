const mongoose = require("mongoose");
const { cities } = require("./cities.json");
const { descriptors, places } = require("./seedHelpers.json");
const Campground = require("../models/campground");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(console.log("SuccessFul Connected"))
  .catch((error) => {
    console.log("CONNECTION ERROR: ");
    console.log(error);
  });

const sample = (array) =>
  array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
