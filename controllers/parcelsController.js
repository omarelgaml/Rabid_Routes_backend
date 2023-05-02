const mongoose = require("mongoose");
const validations = require("../config/validations");
const BadRequestError = require("../config/badReqError");
const httpStatusCodes = require("../config/httpStatusCodes.js ");

const Parcel = mongoose.model("Parcel");

exports.add = async (req, res, next) => {
  try {
    const { error } = validations.addParcelValidation.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const { pickupAddress, dropoffAddress, status } = req.body;
    const newParcel = new Parcel({
      sender: req.user.id,
      pickupAddress,
      dropoffAddress,
      status,
    });
    await newParcel.save();

    res.status(httpStatusCodes.CREATED).json({ parcel: newParcel });
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { error } = validations.updateParcelValidation.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const { id } = req.params;
    const {
      pickupAddress,
      dropoffAddress,
      status,
      biker,
      notes,
      dateDelivered,
      datePicked,
    } = req.body;

    const parcel = await Parcel.findById(id);
    if (parcel.biker && parcel.biker !== id)
      throw new BadRequestError(
        "Only the biker can update the parcel after being picked"
      );

    if (parcel.dateDelivered)
      throw new BadRequestError("Can not update a delivered parcel");

    if (parcel.datePicked && (pickupAddress || dropoffAddress || datePicked))
      throw new BadRequestError(
        "Can not update pickup, dropoff addresses or datePicked for a picked parcel"
      );

    parcel.pickupAddress = pickupAddress || parcel.pickupAddress;
    parcel.dropoffAddress = dropoffAddress || parcel.dropoffAddress;
    parcel.status = status || parcel.status;
    parcel.biker = biker || parcel.biker;
    parcel.notes = notes || parcel.notes;
    parcel.dateDelivered = dateDelivered || parcel.dateDelivered;
    parcel.datePicked = datePicked || parcel.datePicked;

    await parcel.save();

    res.status(httpStatusCodes.OK).json({ parcel });
  } catch (err) {
    next(err);
  }
};
