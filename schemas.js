import Joi from "joi";

export const campSchema = Joi.object({
  camp: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

export const reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});

export const userSchema = Joi.object({
  user: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.number().required().min(6).max(32),
    camps: Joi.array(),
    reviews: Joi.array(),
  }).required(),
});
