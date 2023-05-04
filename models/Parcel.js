const mongoose = require("mongoose");

const { Schema } = mongoose;

const Status = mongoose.model("ParcelStatus");

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
  updatedAt: {
    type: Date,
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
  bikerNotes: {
    type: String,
  },
  senderNotes: {
    type: String,
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParcelStatus",
  },
});
ParcelSchema.pre("save", async function updateAt(next) {
  this.updatedAt = Date.now;
  if (!this.status) {
    const created = await Status.findOne({ code: 1 });
    this.status = created ? created.id : "";
  }
  next();
});
mongoose.model("Parcel", ParcelSchema);
