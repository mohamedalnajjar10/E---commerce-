const stripe = require("stripe")(process.env.STRIPE_SECRET);
const factory = require("./handelrsFactory.js");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const order = require("../models/order.js");
const product = require("../models/product.js");
const cart = require("../models/cart.js");
const { where } = require("sequelize");
const cartItems = require("../models/cartItems.js");

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  const Cart = await cart.findByPk(req.params.cartId, {
    include: [{ model: cartItems, as: "cartItems" }],
  });

  if (!Cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  const cartPrice = Cart.totalPriceAfterDiscount
    ? Cart.totalPriceAfterDiscount
    : Cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  const Order = await order.create({
    userId: req.User.id,
    cartId: req.params.cartId,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
    paymentMethodType: "cash",
  });

  if (Order) {
    const bulkUpdates = Cart.cartItems.map(async (item) => {
      const Product = await product.findByPk(item.productId);
      if (Product) {
        Product.quantity -= item.quantity;
        Product.sold += item.quantity;
        await Product.save();
      }
    });

    await Promise.all(bulkUpdates);

    await cart.destroy({ where: { id: req.params.cartId } });
  }

  res.status(201).send({ status: "success", data: Order });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.User.role === "user") {
    req.filterObj = { userId: req.User.id };
    console.log("Filter applied:", req.filterObj);
  }
  next();
});

exports.findAllOrders = factory.getAll(order);

exports.findSpecificOrder = factory.getOne(order);

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const Order = await order.findByPk(req.params.id);
  if (!Order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }
  // update order to paid
  Order.isPaid = true;
  Order.paidAt = Date.now();

  const updatedOrder = await Order.save();

  res.status(200).send({ status: "success", data: updatedOrder });
});

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const Order = await order.findByPk(req.params.id);
  if (!Order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }
  // update order to paid
  Order.isDelivered = true;
  Order.deliveredAt = Date.now();

  const updatedOrder = await Order.save();

  res.status(200).send({ status: "success", data: updatedOrder });
});

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  const Cart = await cart.findByPk(req.params.cartId, {
    include: [{ model: cartItems, as: "cartItems" }],
  });
  if (!Cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  const cartPrice = Cart.totalPriceAfterDiscount
    ? Cart.totalPriceAfterDiscount
    : Cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  const session = await stripe.checkout.sessions.create({
    line_items: Cart.cartItems.map((item) => ({
      price_data: {
        currency: "egp",
        product_data: {
          name: item.productId,
        },
        unit_amount: totalOrderPrice * 100,
      },
      quantity: 1,
    })),
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.User.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  res.status(200).send({ status: "success", session });
});
