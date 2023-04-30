const mongoose = require("mongoose");

const { Schema } = mongoose;

const ParcelSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  biker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  pickupAddress: {
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    buildingNumber: {
      type: String,
      required: true,
    },
    floor: {
      type: String,
      required: true,
    },
  },
  dropoffAddress: {
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    buildingNumber: {
      type: String,
      required: true,
    },
    floor: {
      type: String,
      required: true,
    },
  },
  datePicked: {
    type: Date,
  },
  dateDelivered: {
    type: Date,
  },
  notes: {
    type: String,
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Status",
    required: true,
  },
});

mongoose.model("Parcel", ParcelSchema);
