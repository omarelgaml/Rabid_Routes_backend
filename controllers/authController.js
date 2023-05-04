const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validations = require("../config/validations");
const BadRequestError = require("../config/badReqError");
const ConflictError = require("../config/conflictError");
const httpStatusCodes = require("../config/httpStatusCodes.js ");
const UnAuthError = require("../config/noAuthError");
const { sendEmail } = require("../config/mailing");

const User = mongoose.model("User");
const Role = mongoose.model("Role");

exports.signup = async (req, res, next) => {
  try {
    const { error } = validations.addUserValidation.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const { email, password, firstName, lastName, title, phoneNumber, role } =
      req.body;
    const sentRole = await Role.findById(role);
    if (!sentRole) throw new BadRequestError("Provide a valid role");

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
      role,
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

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) throw new BadRequestError("Token is missing");

    const user = await User.findOne({ refreshToken });

    if (!user) throw new UnAuthError("Invalid refresh token");

    const accessToken = user.refreshAccessToken();

    return res.status(httpStatusCodes.OK).json({ accessToken });
  } catch (error) {
    return next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { user } = req;

    await User.updateOne(
      // eslint-disable-next-line no-underscore-dangle
      { _id: user._id },
      { $unset: { accessToken: 1, refreshToken: 1 } }
    );

    return res
      .status(httpStatusCodes.NO_CONTENT_SUCCESS)
      .json({ message: "User logged out" });
  } catch (err) {
    return next(err);
  }
};

exports.sendResPassEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) throw new BadRequestError("Email is required");

    const token = await User.generateResetPasswordToken(email);
    await sendEmail(email, token);

    return res.status(httpStatusCodes.NO_CONTENT_SUCCESS).json({});
  } catch (err) {
    return next(err);
  }
};

exports.reSetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password)
      throw new BadRequestError("Token and Password are required");

    if (password.length < 6)
      throw new BadRequestError("Password should be more than 6 characters");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOne({ changePasswordToken: token });

    if (!user) throw new UnAuthError("Expired or invalid token");
    await user.veifyResetToken();

    await User.updateOne(
      { changePasswordToken: token },
      {
        password: hashedPassword,
        $unset: { changePasswordToken: 1, accessToken: 1, refreshToken: 1 },
      }
    );

    return res.status(httpStatusCodes.NO_CONTENT_SUCCESS).json({});
  } catch (err) {
    return next(err);
  }
};
