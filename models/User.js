const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
//////////////
const UnAuthError = require("../config/noAuthError");
const NotFoundError = require("../config/notFoundError");

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  title: { type: String },
  phoneNumber: { type: String },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  accessToken: { type: String },
  refreshToken: { type: String },
  changePasswordToken: { type: String },
});

UserSchema.methods.generateToken = function generateToken() {
  const user = this;

  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  user.accessToken = accessToken;
  user.refreshToken = refreshToken;

  user.save();
  user.populate("companyId");
  return user;
};

UserSchema.methods.refreshAccessToken = function refreshAccessToken() {
  const user = this;

  const decodedToken = jwt.verify(
    user.refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  if (!decodedToken) throw new UnAuthError("Invalid refresh token");

  const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  user.accessToken = newAccessToken;
  user.save();

  return newAccessToken;
};

UserSchema.methods.veifyUserToken = function veifyUserToken() {
  const user = this;
  const token = user.accessToken;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) throw new UnAuthError("Expired or invalid token");
};
UserSchema.methods.veifyResetToken = function veifyUserToken() {
  const user = this;
  const token = user.changePasswordToken;
  const decodedToken = jwt.verify(token, process.env.JWT_CHANGE_PASSWORD_TOKEN);
  if (!decodedToken) throw new UnAuthError("Expired or invalid token");
};
UserSchema.statics.generateResetPasswordToken = async function generate(email) {
  const user = await this.findOne({ email });
  if (!user) throw new NotFoundError("User not found");

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_CHANGE_PASSWORD_TOKEN,
    {
      expiresIn: "5m",
    }
  );
  user.changePasswordToken = token;

  await user.save();

  return token;
};
const validateId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid MongoDB ObjectId");
  }
  return value;
};

mongoose.model("User", UserSchema);
