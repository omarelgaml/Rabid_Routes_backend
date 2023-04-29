const mongoose = require("mongoose");

const { Schema } = mongoose;

const RoleSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

mongoose.model("Role", RoleSchema);
