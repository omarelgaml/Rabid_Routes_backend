const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validations = require("../config/validations");
const BadRequestError = require("../config/badReqError");
const ConflictError = require("../config/conflictError");
const httpStatusCodes = require("../config/httpStatusCodes.js ");
const UnAuthError = require("../config/noAuthError");

const User = mongoose.model("User");

exports.signup = async (req, res, next) => {
  try {
    const { error } = validations.addUserValidation.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const { email, password, firstName, lastName, title, phoneNumber, roles } =
      req.body;
    const existingUser = await User.find({ email });
    if (existingUser.length) throw new ConflictError("User already exists");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      title,
      phoneNumber,
      roles,
    });

    await user.save();

    return res
      .status(httpStatusCodes.CREATED)
      .json({ message: "User created successfully" });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new BadRequestError("Email and Password are required");
    let user = await User.findOne({ email });

    if (!user) throw new UnAuthError("Email and/or Password are wrong ");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnAuthError("Email and/or Password are wrong ");
    }

    user = await user.generateToken();

    return res.status(httpStatusCodes.OK).json({ user });
  } catch (error) {
    return next(error);
  }
};
