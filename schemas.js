const Joi = require("joi")
module.exports.campSchema = Joi.object({
    camp: Joi.object({
      title: Joi.string().required(), 
      price: Joi.number().min(0).required(),
      image: Joi.string().required(),
      location: Joi.string().required(),
      description: Joi.string().required()
    }).required()
  })
