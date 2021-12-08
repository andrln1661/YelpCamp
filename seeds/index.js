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

const sample = (array) =>
  array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 100; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 0.99;
    const camp = new Campground({
      author: "61a8475ce15a6fd14fc32408",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      description: `Lorem, ipsum dolor sit amet 
      consectetur adipisicing elit. Facilis eaque earum quidem 
      repellendus velit omnis non, inventore voluptatibus perspiciatis
      iste, dignissimos adipisci quo dicta alias unde eum quibusdam
      officia ratione.`,
      price,
      images: [
        {
          url: "https://res.cloudinary.com/setinsky/image/upload/v1638734282/yelp-camp/k1usluy5ytgbcpjbeiqv.jpg",
          filename: "yelp-camp/k1usluy5ytgbcpjbeiqv",
        },
        {
          url: "https://res.cloudinary.com/setinsky/image/upload/v1638734283/yelp-camp/dgh2lsyhcqyl7ixy2lex.jpg",
          filename: "yelp-camp/dgh2lsyhcqyl7ixy2lex",
        },
        {
          url: "https://res.cloudinary.com/setinsky/image/upload/v1638734283/yelp-camp/bggilw03sb13ycqjgegt.jpg",
          filename: "yelp-camp/bggilw03sb13ycqjgegt",
        },
      ],
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
