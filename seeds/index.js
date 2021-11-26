import { connect, connection } from "mongoose";
import { cities } from "./cities.json";
import { descriptors, places } from "./seedHelpers.json";
import Campground, { deleteMany } from "../models/campground";

connect("mongodb://localhost:27017/yelp-camp")
  .then(console.log("SuccessFul Connected"))
  .catch((error) => {
    console.log("CONNECTION ERROR: ");
    console.log(error);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 0.99;
    const camp = new Campground({
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
    connection.close();
  })
  .catch((error) => {
    console.log("Error Seeding");
    console.log(error);
  });
