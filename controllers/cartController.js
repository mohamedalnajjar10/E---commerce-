const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const cart = require("../models/cart.js");
const product = require("../models/product.js");
const cartItems = require("../models/cartItems.js");
const coupon = require("../models/coupon.js");
const {Op} = require("sequelize");

// حساب إجمالي سعر السلة
const calcTotalCartPrice = async (cartId) => {
  const CartItems = await cartItems.findAll({ where: { cartId } });
  if (!CartItems || CartItems.length === 0) return 0; // Handle empty cart case
  const totalCartPrice = CartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  return totalCartPrice;
};

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  // Validate input
  if (!productId || !color) {
    return next(new ApiError("Product ID and color are required", 400));
  }

  // التحقق من وجود المنتج
  const Product = await product.findByPk(productId);
  if (!Product) {
    return next(new ApiError("Product not found", 404));
  }

  // 1) الحصول على السلة الخاصة بالمستخدم
  let Cart = await cart.findOne({ where: { userId: req.User.id } });

  if (!Cart) {
    // إنشاء سلة جديدة للمستخدم
    Cart = await cart.create({ userId: req.User.id });
  }

  // التحقق مما إذا كان المنتج موجودًا بالفعل في السلة
  const CartItem = await cartItems.findOne({
    where: { cartId: Cart.id, productId, color },
  });

  if (CartItem) {
    // إذا كان المنتج موجودًا، قم بزيادة الكمية
    CartItem.quantity += 1;
    await CartItem.save();
  } else {
    // إذا لم يكن المنتج موجودًا، أضفه إلى السلة
    await cartItems.create({
      cartId: Cart.id,
      productId,
      color,
      price: Product.price || 0,
      quantity: 1,
    });
  }

  // حساب إجمالي سعر السلة
  const totalCartPrice = await calcTotalCartPrice(Cart.id);
  Cart.totalCartPrice = totalCartPrice;
  await Cart.save();

  // جلب جميع العناصر في السلة لتضمينها في الاستجابة
  const updatedCartItems = await cartItems.findAll({
    where: { cartId: Cart.id },
  });

  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",
    data: {
      id: Cart.id,
      cartItems: updatedCartItems,
      totalCartPrice, // إضافة إجمالي السعر إلى الاستجابة
    },
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  // الحصول على السلة الخاصة بالمستخدم
  const Cart = await cart.findOne({
    where: { userId: req.User.id },
    include: [{ model: cartItems, as: "cartItems" }], // تضمين العناصر المرتبطة بالسلة
  });

  if (!Cart) {
    return next(
      new ApiError(`There is no cart for this user id: ${req.User.id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    numOfCartItems: Cart.cartItems.length,
    data: Cart,
  });
});

exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params; // الحصول على معرف العنصر المراد حذفه

  // التحقق من وجود العنصر في السلة
  const cartItem = await cartItems.findOne({ where: { id: itemId } });

  if (!cartItem) {
    return next(new ApiError(`No cart item found with id: ${itemId}`, 404));
  }

  // حذف العنصر من السلة
  await cartItems.destroy({ where: { id: itemId } });

  // إعادة حساب إجمالي سعر السلة
  const Cart = await cart.findOne({ where: { id: cartItem.cartId } });
  if (Cart) {
    const totalCartPrice = await calcTotalCartPrice(Cart.id);
    Cart.totalCartPrice = totalCartPrice;
    await Cart.save();
  }

  res.status(200).json({
    status: "success",
    message: "Cart item removed successfully",
    data: {
      cartId: cartItem.cartId,
      totalCartPrice: Cart ? Cart.totalCartPrice : 0,
    },
  });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  // حذف جميع العناصر المرتبطة بعربة المستخدم
  await cart.destroy({
    where: { userId: req.User.id },
  });

  res.status(204).send();
});

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  // البحث عن السلة للمستخدم
  const Cart = await cart.findOne({ where: { userId: req.User.id } });
  if (!Cart) {
    return next(new ApiError(`There is no cart for user ${req.User.id}`, 404));
  }

  // البحث عن item في cartItems
  const cartItem = await cartItems.findOne({
    where: { cartId: Cart.id, id: req.params.itemId },
  });

  if (!cartItem) {
    return next(
      new ApiError(`There is no item for this ID: ${req.params.itemId}`, 404)
    );
  }

  // تحديث الكمية
  cartItem.quantity = quantity;
  await cartItem.save();

  // إعادة حساب totalCartPrice
  const totalPrice = await calcTotalCartPrice(Cart.id);

  // استرجاع السلة المحدثة
  const updatedCart = await cart.findByPk(Cart.id, {
    include: [{ model: cartItems }],
  });

  res.status(200).json({
    status: "success",
    numOfCartItems: updatedCart.cartItems.length,
    data: updatedCart,
    totalCartPrice: totalPrice,
  });
});


exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name and check if it has expired
  const Coupon = await coupon.findOne({
    where: {
      name: req.body.coupon,
      expire: { [Op.gt]: new Date() }, // التأكد من عدم انتهاء صلاحية الكوبون
    },
  });

  if (!Coupon) {
    return next(new ApiError("Coupon is invalid or expired", 400));
  }

  // 2) Get logged user cart to get total cart price
  const Cart = await cart.findOne({
    where: { userId: req.User.id }, // استخدم userId بدلاً من req.user._id
    include: ["cartItems"], // تأكد من ربط الـ cartItems مع الـ cart
  });

  if (!Cart) {
    return next(new ApiError("Cart not found for the user", 404));
  }
  const totalPrice = Cart.totalCartPrice;

  // 3) Calculate price after applying coupon discount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * Coupon.discount) / 100
  ).toFixed(2); // نحتفظ بنفس التنسيق

  // 4) Update cart with new price after discount
  Cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await Cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: Cart.cartItems.length,
    data: {
      Cart,
      cartId: Cart.id,
      totalCartPrice: totalPrice,
      totalPriceAfterDiscount,
    },
  });
});
