import mongoose from "mongoose";
import cities from "./cities.js";
import seedHelpers from "./seedHelpers.js";
const { descriptors, places } = seedHelpers;
import Campground from "../models/campground.js";

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(console.log("SuccessFul Connected"))
  .catch((error) => {
    console.log("CONNECTION ERROR: ");
    console.log(error);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 0.99;
    const camp = new Campground({
      author: "61a8475ce15a6fd14fc32408",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://source.unsplash.com/collection/483251`,
      description: `Lorem, ipsum dolor sit amet 
      consectetur adipisicing elit. Facilis eaque earum quidem 
      repellendus velit omnis non, inventore voluptatibus perspiciatis
      iste, dignissimos adipisci quo dicta alias unde eum quibusdam
      officia ratione.`,
      price,
    });
    await camp.save();
  }
};

seedDB()
  .then(() => {
    console.log("Successful Seeded!");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log("Error Seeding");
    console.log(error);
  });
