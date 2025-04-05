const asyncHandler = require("express-async-handler");
const user = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError.js");
const { Op, where } = require("sequelize");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail.js");
const createToken = require("../utils/createToken.js");
const { sanitizeUser } = require("../utils/sanitizeData.js");

exports.signup = asyncHandler(async (req, res, next) => {

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const User = await user.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  // 2- Generate token
  const token = createToken(User.id);

  res.status(201).json({ data: sanitizeUser(User), token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const User = await user.findOne({ where: { email: req.body.email } });
  if (!User || !(await bcrypt.compareSync(req.body.password, User.password))) {
    return next(new ApiError("Incoreect password or email "));
  }

  const token = createToken(User.id);

  res.status(200).send({ data: User, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await user.findByPk(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }
  
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    const tokenIssuedAt = Math.floor(Date.now() / 1000);
    if (passChangedTimestamp > tokenIssuedAt) {
      return next(
        new ApiError("Password was recently changed. Please login again.", 401)
      );
    }
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password. please login again..",
          401
        )
      );
    }
  }
  req.User = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.User.role)) {
      return next(
        new ApiError("You are not allowed to access this route ", 403)
      );
    }
    next();
  });

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const User = await user.findOne({ where: { email: req.body.email } });
  if (!User) {
    return next(
      new ApiError(`There is no user with that email : ${req.body.email}`, 404)
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  User.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  User.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  User.passwordResetVerified = false;
  await User.save();

  const message = `Hi ${User.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;

  try {
    await sendEmail({
      email: User.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    User.passwordResetCode = undefined;
    User.passwordResetExpires = undefined;
    User.passwordResetVerified = undefined;
    await User.save();

    console.error("detiels error", err); 
    return next(new ApiError("There is an error in sending email", 500));
  }
  res.status(200).send({
    status: "Success",
    message: " A recovery code has been sent to your email",
  });
});

exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const User = await user.findOne({
    where: {
      passwordResetCode: hashedResetCode,
      passwordResetExpires: {
        [Op.gt]: Date.now(),
      },
    },
  });
  if (!User) {
    return next(new ApiError("Reset code invalid or expired"));
  }
  // 2) Reset code valid
  User.passwordResetVerified = true;
  await User.save();

  res.status(200).send({
    status: "Success",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const User = await user.findOne({ where: { email: req.body.email } });
  if (!User) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    );
  }
  // 2) Check if reset code verified
  if (!User.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  User.password = req.body.newPassword;
  User.passwordResetCode = undefined;
  User.passwordResetExpires = undefined;
  User.passwordResetVerified = undefined;

  await User.save();

  const token = createToken(User.id);

  res.status(200).send({ token });
});
