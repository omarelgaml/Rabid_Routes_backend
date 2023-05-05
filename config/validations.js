const Joi = require("joi");
const mongoose = require("mongoose");

const validateId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid MongoDB ObjectId");
  }
  return value;
};
exports.addUserValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password should have at least 6 characters",
    "any.required": "Password is required",
  }),
  firstName: Joi.string().min(2).max(30).messages({
    "string.min": "First name should have at least 2 characters",
    "string.max": "First name should not exceed 30 characters",
  }),
  lastName: Joi.string().min(2).max(30).allow(null, "").messages({
    "string.min": "Last name should have at least 2 characters",
    "string.max": "Last name should not exceed 30 characters",
  }),
  title: Joi.string().min(2).max(6).allow(null, "").messages({
    "string.min": "Title should have at least 2 characters",
    "string.max": "Title should not exceed 6 characters",
  }),
  phoneNumber: Joi.number().required().messages({
    "any.required":
      "Please provide a valid phone number starting with + followed by country code and phone number",
  }),
  role: Joi.string().custom(validateId).required().messages({
    "any.required": "Role is required",
  }),
});

// exports.addUserValidation = Joi.object({
//   email: Joi.string().email().required(),
//   password: Joi.string().min(6).required(),
//   firstName: Joi.string().min(2).max(30),
//   lastName: Joi.string().min(2).max(30).allow(null, ""),
//   title: Joi.string().min(2).max(6).allow(null, ""),
//   phoneNumber: Joi.string()
//     .pattern(/^\+[1-9]\d{10}$/)
//     .required(),
//   role: Joi.string().custom(validateId).required(),
// });
exports.updateUserValidation = Joi.object({
  password: Joi.string().min(6),
  firstName: Joi.string().min(2).max(30),
  lastName: Joi.string().min(2).max(30),
  title: Joi.string(),
  phoneNumber: Joi.number(),
  role: Joi.string().custom(validateId),
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
  bikerNotes: Joi.string().allow(null),
  senderNotes: Joi.string().allow(null),

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
  bikerNotes: Joi.string(),
  senderNotes: Joi.string(),
});
