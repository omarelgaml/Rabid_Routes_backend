const mongoose = require("mongoose");

const { Schema } = mongoose;

const StatusSchema = new Schema({
  name: {
    type: String,
  },
});
// created: 644f66e61f885b0a62f80ea8
mongoose.model("ParcelStatus", StatusSchema);
