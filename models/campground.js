import mongoose from "mongoose";
const { Schema } = mongoose;
import Review from "./review.js";

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
ImageSchema.virtual("index").get(function () {
  return this.url.replace("/upload", "/upload/w_1000,ar_1:1,c_fill,g_auto");
});

const campgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  geometry: {
    type: {
      type: "String",
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  location: String,
  images: [ImageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({
      id: {
        $in: doc.reviews,
      },
    });
  }
});

export default mongoose.model("Campground", campgroundSchema);
