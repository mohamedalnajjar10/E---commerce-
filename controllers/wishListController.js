const user = require("../models/user.js");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const wishList = require("../models/wishlist.js");
const product = require("../models/product.js");

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  // تأكيد أن الـ productId موجود
  if (!productId) {
    return next(new ApiError("Product ID is required", 400));
  }

  // الحصول على userId من الـ JWT Token أو من الـ session (حسب الطريقة التي تستخدمها للمصادقة)
  const userId = req.User.id;

  // البحث عن المستخدم
  const User = await user.findByPk(userId);
  if (!User) {
    return next(new ApiError("User not found", 404));
  }

  // التحقق من وجود المنتج في القائمة
  if (User.wishList && User.wishList.includes(productId)) {
    return next(new ApiError("Product already in wishlist", 400));
  }
  // إضافة المنتج إلى قاعدة البيانات
  await wishList.create({ userId, productId });

  res.status(200).json({
    status: "success",
    message: "Product added successfully to your wishlist.",
    data: User.wishList,
  });
});

exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  // تأكيد أن الـ productId موجود
  if (!productId) {
    return next(new ApiError("Product ID is required", 400));
  }

  // الحصول على userId من الـ JWT Token أو من الـ session (حسب الطريقة التي تستخدمها للمصادقة)
  const userId = req.User.id;

  // البحث عن المستخدم
  const User = await user.findByPk(userId);
  if (!User) {
    return next(new ApiError("User not found", 404));
  }

  // البحث عن المنتج في wishList الخاص بالمستخدم
  const wishListItem = await wishList.findOne({
    where: {
      userId,
      productId,
    },
  });

  // التأكد من أن المنتج موجود في الـ wishList
  if (!wishListItem) {
    return next(new ApiError("Product not found in your wishlist", 404));
  }

  // حذف المنتج من الـ wishList
  await wishListItem.destroy();

  res.status(200).json({
    status: "success",
    message: "Product removed successfully from your wishlist.",
    data: User.wishList,
  });
});

exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  // الحصول على userId من JWT
  const userId = req.User?.id;

  // التحقق من وجود userId
  if (!userId) {
    return next(new ApiError("Invalid token or user ID not found", 401));
  }

  // البحث عن المستخدم مع قائمة الأمنيات الخاصة به
  const User = await user.findByPk(userId, {
    include: [
      {
        model: wishList,
        include: [
          {
            model: product,
            attributes: ["title", "price"], // تحديد الأعمدة المطلوبة فقط
          },
        ],
      },
    ],
  });

  // التحقق من وجود المستخدم
  if (!User) {
    return next(new ApiError("User not found", 404));
  }

  // جلب بيانات الـ wishList للمستخدم
  const userWishlist = User.wishLists || []; // إذا لم توجد عناصر، أرجع مصفوفة فارغة

  // إرسال الرد
  res.status(200).json({
    status: "success",
    results: userWishlist.length,
    data: userWishlist,
  });
});
