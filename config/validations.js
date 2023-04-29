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
  phoneNumber: Joi.string().pattern(new RegExp("^[0-9]{10}$")),
  roles: Joi.array().items(Joi.string().custom(validateId)).required(),
});
exports.updateUserValidation = Joi.object({
  password: Joi.string().min(6).optional().not().null(),
  firstName: Joi.string().alphanum().min(2).max(30).optional().not().null(),
  lastName: Joi.string().alphanum().min(2).max(30).optional().not().null(),
  title: Joi.string(),
  phoneNumber: Joi.string().pattern(new RegExp("^[0-9]{10}$")),
  roles: Joi.array()
    .items(Joi.string().custom(validateId))
    .optional()
    .not()
    .null(),
}).min(1);

exports.updateParcelValidation = Joi.object({
  biker: Joi.string().custom(validateId),
  pickupAddress: Joi.object({
    country: Joi.string().allow(null).optional().not().null(),
    city: Joi.string().allow(null).optional().not().null(),
    street: Joi.string().allow(null).optional().not().null(),
    buildingNumber: Joi.string().allow(null).optional().not().null(),
    floor: Joi.string().allow(null).optional().not().null(),
  }),
  dropoffAddress: Joi.object({
    country: Joi.string().allow(null).optional().not().null(),
    city: Joi.string().allow(null).optional().not().null(),
    street: Joi.string().allow(null).optional().not().null(),
    buildingNumber: Joi.string().allow(null).optional().not().null(),
    floor: Joi.string().allow(null).optional().not().null(),
  }),
  datePicked: Joi.date().allow(null).min(1).optional().not().null(),
  dateDelivered: Joi.date().allow(null).min(1).optional().not().null(),
  notes: Joi.string().allow(null).optional().not().null(),
  status: Joi.string().optional().not().null(),
}).min(1);

exports.addParcelValidation = (parcel) => {
  const schema = Joi.object({
    sender: Joi.string().custom(validateId).required(),
    biker: Joi.string().custom(validateId),
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
    status: Joi.objectId().required(),
  });
  return schema.validate(parcel);
};
