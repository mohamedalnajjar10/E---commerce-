const user = require("../models/user.js");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const wishList = require("../models/wishlist.js");
const product = require("../models/product.js");

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  if (!productId) {
    return next(new ApiError("Product ID is required", 400));
  }

  const userId = req.User.id;

  const User = await user.findByPk(userId);
  if (!User) {
    return next(new ApiError("User not found", 404));
  }

  if (User.wishList && User.wishList.includes(productId)) {
    return next(new ApiError("Product already in wishlist", 400));
  }
  await wishList.create({ userId, productId });

  res.status(200).json({
    status: "success",
    message: "Product added successfully to your wishlist.",
    data: User.wishList,
  });
});

exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  if (!productId) {
    return next(new ApiError("Product ID is required", 400));
  }

  const userId = req.User.id;

  const User = await user.findByPk(userId);
  if (!User) {
    return next(new ApiError("User not found", 404));
  }

  const wishListItem = await wishList.findOne({
    where: {
      userId,
      productId,
    },
  });

  if (!wishListItem) {
    return next(new ApiError("Product not found in your wishlist", 404));
  }

  await wishListItem.destroy();

  res.status(200).json({
    status: "success",
    message: "Product removed successfully from your wishlist.",
    data: User.wishList,
  });
});

exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.User?.id;

  if (!userId) {
    return next(new ApiError("Invalid token or user ID not found", 401));
  }

  const User = await user.findByPk(userId, {
    include: [
      {
        model: wishList,
        include: [
          {
            model: product,
            attributes: ["title", "price"], 
          },
        ],
      },
    ],
  });

  if (!User) {
    return next(new ApiError("User not found", 404));
  }

  const userWishlist = User.wishLists || []; 

  res.status(200).json({
    status: "success",
    results: userWishlist.length,
    data: userWishlist,
  });
});
