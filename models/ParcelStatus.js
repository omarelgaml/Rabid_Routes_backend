const mongoose = require("mongoose");

const { Schema } = mongoose;

const StatusSchema = new Schema({
  name: {
    type: String,
  },
  code: { type: Number },
});
// created: 644f66e61f885b0a62f80ea8
mongoose.model("ParcelStatus", StatusSchema);
