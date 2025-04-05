const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController.js");
const authController = require("../controllers/authController.js");

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("user"),
    cartController.addProductToCart
  )
  .get(
    authController.protect,
    authController.allowedTo("user"),
    cartController.getLoggedUserCart
  )
  .delete(
    authController.protect,
    authController.allowedTo("user"),
    cartController.clearCart
  );

router
  .route("/:itemId")
  .put(
    authController.protect,
    authController.allowedTo("user"),
    cartController.updateCartItemQuantity
  )
  .delete(
    authController.protect,
    authController.allowedTo("user"),
    cartController.removeSpecificCartItem
  );

router
  .route("/applyCoupon")
  .post(
    authController.protect,
    authController.allowedTo("user"),
    cartController.applyCoupon
  );
module.exports = router;
