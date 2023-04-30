const mongoose = require("mongoose");

const { Schema } = mongoose;

const StatusSchema = new Schema({
  name: {
    type: String,
  },
});

mongoose.model("ParcelStatus", StatusSchema);
