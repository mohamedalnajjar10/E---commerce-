const user = require("../models/user.js");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const addreses = require("../models/addreses.js");

exports.addAddress = asyncHandler(async (req, res, next) => {
  const UserId = req.User.id;

  if (!UserId) {
    return next(new ApiError("User ID is required", 400));
  }

  const User = await user.findByPk(UserId);
  if (!User) {
    return next(new ApiError("User not found", 404));
  }

  const { alias, details, city, postCode, phone } = req.body;

  if (!alias || !details || !city || !postCode || !phone) {
    return next(new ApiError("All address fields are required", 400));
  }

  const AddresesData = await addreses.create({
    userId: UserId,
    alias,
    details,
    city,
    postCode,
    phone,
  });

  res.status(200).json({
    status: "success",
    message: "Address added successfully ",
    data: AddresesData,
  });
});

exports.removeAddress = asyncHandler(async (req, res, next) => {
  const UserId = req.User.id;

  if (!UserId) {
    return next(new ApiError("User ID is required", 400));
  }

  const User = await user.findByPk(UserId);
  if (!User) {
    return next(new ApiError("User not found", 404));
  }

  const Address = await addreses.findOne({
    where: {
      UserId,
    },
  });

  if (!Address) {
    return next(new ApiError("Address not found in this user", 404));
  }

  await Address.destroy();

  res.status(200).json({
    status: "success",
    message: "Address added successfully",
    data: User.addreses,
  });
});

exports.getLoggedUserAddreses = asyncHandler(async (req, res, next) => {
  const UserId = req.User.id;

  if (!UserId) {
    return next(new ApiError("User ID is required", 400));
  }

  const User = await user.findByPk(UserId);
  if (!User) {
    return next(new ApiError("User not found", 404));
  }

  const Address = await addreses.findAll({
    where: {
      UserId,
    },
  });

  res.status(200).json({
    status: "success",
    message: "Address added successfully",
    result: Address.length,
    data: Address,
  });
});

// exports.getAllAddreses = asyncHandler(async (req, res, next) => {
//   const AddresesData = await addreses.findAll();

//   res.status(200).json({
//     status: "success",
//     message: "Address added successfully",
//     data: AddresesData,
//   });
// });
