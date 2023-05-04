const mongoose = require("mongoose");

const { Schema } = mongoose;

const RoleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  code: { type: Number, required: true, unique: true },
});
// biker :644df9ac2adcab5fc76c6088
// sender : 644df9cb2adcab5fc76c6089
mongoose.model("Role", RoleSchema);
