const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const orderController = require("../controllers/orderController");

router
  .route("/:cartId")
  .post(
    authController.protect,
    authController.allowedTo("user"),
    orderController.createCashOrder
  );

router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("user", "admin", "manager"),
    orderController.filterOrderForLoggedUser,
    orderController.findAllOrders
  );

router
  .route("/:id")
  .get(
    authController.protect,
    authController.allowedTo("user", "admin", "manager"),
    orderController.findSpecificOrder
  );

router
  .route("/:id/pay")
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    orderController.updateOrderToPaid
  );

router
  .route("/:id/deliver")
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    orderController.updateOrderToDelivered
  );

router
  .route("/checkout-session/:cartId")
  .get(
    authController.protect,
    authController.allowedTo("user"),
    orderController.checkoutSession
  );
module.exports = router;
