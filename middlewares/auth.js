const mongoose = require("mongoose");
const UnAuthError = require("../config/noAuthError");
const BadRequestError = require("../config/badReqError");

const User = mongoose.model("User");
module.exports = async (req, _res, next) => {
  try {
    if (!req.headers.authorization)
      throw new BadRequestError("Token is missing");

    const token = req.headers.authorization.split(" ")[1];

    const user = await User.findOne({ accessToken: token }).populate("role");
    if (!user) throw new UnAuthError("User not Authnticated");

    await user.veifyUserToken();
    req.user = user;

    return next();
  } catch (err) {
    return next(err);
  }
};
