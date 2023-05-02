const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = mongoose.model("User");
const { addUserValidation } = require("../config/validations");
const httpStatusCodes = require("../config/httpStatusCodes.js ");
const NotFoundError = require("../config/notFoundError");
const BadRequestError = require("../config/badReqError");

exports.updateUser = async (req, res, next) => {
  try {
    const { error, value } = addUserValidation.validate(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundError("User not found");

    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    let newPassword;

    if (value.password) newPassword = await bcrypt.hash(value.password, 10);

    user.password = newPassword || user.password;
    user.firstName = value.firstName || user.firstName;
    user.lastName = value.lastName || user.lastName;
    user.title = value.title || user.title;
    user.phoneNumber = value.phoneNumber || user.phoneNumber;
    user.roles = value.roles || user.roles;

    await user.save();

    return res.status(httpStatusCodes.OK).json({ user });
  } catch (err) {
    return next(err);
  }
};
