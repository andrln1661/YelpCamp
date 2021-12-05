import Cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

export const cloudinary = Cloudinary.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECTET,
});

console.log(process.env.CLOUDINARY_CLOUD_NAME);

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "yelp-camp",
    allowedFormats: ["jpeg", "jpg", "png"],
  },
});
