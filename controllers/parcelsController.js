const mongoose = require("mongoose");
const validations = require("../config/validations");
const BadRequestError = require("../config/badReqError");
const httpStatusCodes = require("../config/httpStatusCodes.js ");
const NotFoundError = require("../config/notFoundError");

const Parcel = mongoose.model("Parcel");
const ParcelStatus = mongoose.model("ParcelStatus");

exports.add = async (req, res, next) => {
  try {
    const { error } = validations.addParcelValidation.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const { pickupAddress, dropoffAddress, senderNotes } = req.body;
    const newParcel = new Parcel({
      sender: req.user.id,
      pickupAddress,
      dropoffAddress,
      senderNotes,
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
      bikerNotes,
      senderNotes,

      dateDelivered,
      datePicked,
    } = req.body;

    const parcel = await Parcel.findById(id);
    if (parcel.biker && req.user.role.code === 1)
      throw new BadRequestError(
        "You can not update Parcel after biker selectd it"
      );

    if (parcel.dateDelivered)
      throw new BadRequestError("Can not update a delivered parcel");
    if (parcel.sender.toString() !== req.user.id && req.user.role.code === 1)
      throw new BadRequestError("Parcel owner only can update it");

    parcel.pickupAddress = pickupAddress || parcel.pickupAddress;
    parcel.dropoffAddress = dropoffAddress || parcel.dropoffAddress;
    parcel.status = status || parcel.status;
    parcel.biker = biker || parcel.biker;
    parcel.bikerNotes = bikerNotes || parcel.bikerNotes;
    parcel.senderNotes = senderNotes || parcel.senderNotes;
    parcel.dateDelivered = dateDelivered || parcel.dateDelivered;
    parcel.datePicked = datePicked || parcel.datePicked;

    await parcel.save();

    res.status(httpStatusCodes.OK).json({ parcel });
  } catch (err) {
    next(err);
  }
};
exports.getUnAssigned = async (_req, res, next) => {
  try {
    const parcels = await Parcel.find({
      $or: [{ biker: { $exists: false } }, { biker: { $eq: null } }],
    })
      .populate("sender")
      .populate("status");
    return res.status(httpStatusCodes.OK).json({ parcels });
  } catch (err) {
    return next(err);
  }
};
exports.getallUserParcels = async (req, res, next) => {
  try {
    let parcels;
    const { user } = req;
    if (user.role.code === 1) {
      // sender
      parcels = await Parcel.find({ sender: user.id })
        .populate("biker")
        .populate("status");
    } else {
      parcels = await Parcel.find({ biker: user.id })
        .populate("sender")
        .populate("status");
    }

    return res.status(httpStatusCodes.OK).json({ parcels });
  } catch (err) {
    return next(err);
  }
};
exports.filterByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    let parcels;

    const { user } = req;
    if (user.role.code === 1) {
      // sender
      parcels = await Parcel.find({ sender: user.id, status })
        .populate("biker")
        .populate("status");
    } else {
      parcels = await Parcel.find({ biker: user.id, status })
        .populate("sender")
        .populate("status");
    }

    return res.status(httpStatusCodes.OK).json({ parcels });
  } catch (err) {
    return next(err);
  }
};
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const parcel = await Parcel.findById(id);

    if (!parcel) throw new NotFoundError("parcel not found");
    if (parcel.datePicked)
      throw new BadRequestError("can not delete a picked parcel");

    if (parcel.sender.toString() !== user.id)
      throw new NotFoundError("only sender of parcel can delete it");

    await Parcel.findByIdAndDelete(parcel.id);

    res.status(httpStatusCodes.OK).json({ message: "Parcel Deleted" });
  } catch (err) {
    next(err);
  }
};
exports.getStatuses = async (_req, res, next) => {
  try {
    const statuses = await ParcelStatus.find();
    return res.status(httpStatusCodes.OK).json({ statuses });
  } catch (err) {
    return next(err);
  }
};
