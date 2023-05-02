const Joi = require("joi");
const mongoose = require("mongoose");

const validateId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid MongoDB ObjectId");
  }
  return value;
};

exports.addUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(30),
  lastName: Joi.string().min(2).max(30).allow(null, ""),
  title: Joi.string().min(2).max(6).allow(null, ""),
  phoneNumber: Joi.string()
    .pattern(/^\+[1-9]\d{10}$/)
    .required(),
  roles: Joi.array().items(Joi.string().custom(validateId)).required(),
});
exports.updateUserValidation = Joi.object({
  password: Joi.string().min(6),
  firstName: Joi.string().min(2).max(30),
  lastName: Joi.string().min(2).max(30),
  title: Joi.string(),
  phoneNumber: Joi.string().pattern(/^\+[1-9]\d{10}$/),
  roles: Joi.array().items(Joi.string().custom(validateId)),
}).min(1);

exports.updateParcelValidation = Joi.object({
  biker: Joi.string().custom(validateId),
  pickupAddress: Joi.object({
    country: Joi.string().allow(null),
    city: Joi.string().allow(null),
    street: Joi.string().allow(null),
    buildingNumber: Joi.string().allow(null),
    floor: Joi.string().allow(null),
  }),
  dropoffAddress: Joi.object({
    country: Joi.string().allow(null),
    city: Joi.string().allow(null),
    street: Joi.string().allow(null),
    buildingNumber: Joi.string().allow(null),
    floor: Joi.string().allow(null),
  }),
  datePicked: Joi.date().allow(null).min(1),
  dateDelivered: Joi.date().allow(null).min(1),
  notes: Joi.string().allow(null),
  status: Joi.string().custom(validateId),
}).min(1);

exports.addParcelValidation = Joi.object({
  //  sender: Joi.string().custom(validateId).required(),
  // biker: Joi.string().custom(validateId),
  pickupAddress: Joi.object({
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    buildingNumber: Joi.string().required(),
    floor: Joi.string().required(),
  }).required(),
  dropoffAddress: Joi.object({
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    buildingNumber: Joi.string().required(),
    floor: Joi.string().required(),
  }).required(),
  notes: Joi.string(),
  status: Joi.string().custom(validateId).required(),
});
