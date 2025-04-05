const user = require("../models/user.js");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const addreses = require("../models/addreses.js");


exports.addAddress = asyncHandler(async (req, res, next) => {''
  // الحصول على userId من الـ JWT Token  من الـ
  const UserId = req.User.id;

  // تأكيد أن الـ userId موجود
  if (!UserId) {
    return next(new ApiError("User ID is required", 400));
  }

  // البحث عن المستخدم
  const User = await user.findByPk(UserId);
  if (!User) {
    return next(new ApiError("User not found", 404));
  }

  // إضافة العنوان إلى قاعدة البيانات
  const { alias, details, city, postCode, phone } = req.body;

  // Validate required fields
  if (!alias || !details || !city || !postCode || !phone) {
    return next(new ApiError("All address fields are required", 400));
  }

  // Create the address
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

  // تأكيد أن الـ user موجود
  if (!UserId) {
    return next(new ApiError("User ID is required", 400));
  }

  // البحث عن المستخدم
  const User = await user.findByPk(UserId);
  if (!User) {
    return next(new ApiError("User not found", 404));
  }

  // البحث عن المنتج في Address الخاص بالمستخدم
  const Address = await addreses.findOne({
    where: {
      UserId,
    },
  });

  // التأكد من أن المنتج موجود في الـ wishList
  if (!Address) {
    return next(new ApiError("Address not found in this user", 404));
  }

  // حذف  الـ addreses
  await Address.destroy();

  res.status(200).json({
    status: "success",
    message: "Address added successfully",
    data: User.addreses,
  });
});

exports.getLoggedUserAddreses = asyncHandler(async (req, res, next) => {
  const UserId = req.User.id;

  // تأكيد أن الـ user موجود
  if (!UserId) {
    return next(new ApiError("User ID is required", 400));
  }

  // البحث عن المستخدم
  const User = await user.findByPk(UserId);
  if (!User) {
    return next(new ApiError("User not found", 404));
  }

  // البحث عن الـ addreses الخاص بالمستخدم
  const Address = await addreses.findAll({
    where: {
      UserId,
    },
  });

  res.status(200).json({
    status: "success",
    message: "Address added successfully",
    result : Address.length,
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