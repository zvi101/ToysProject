const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
    name:String,
    info:String,
    category:String,
    img_url:String,
    user_id:String,
    price:Number,
  },{timestamps:true})

exports.ToysModel = mongoose.model("toys", schema)

exports.validateToys = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    info: Joi.string().min(5).max(300).required(),
    category: Joi.string().min(2).max(50).required(),
    img_url: Joi.string().min(1).max(100).allow(null,""),
    price: Joi.number().min(1).max(99999).required(),
  })
  return joiSchema.validate(_reqBody)
}
