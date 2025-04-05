const express = require("express");
const router = express.Router();
const wishListController = require("../controllers/wishListController.js");
const authController = require("../controllers/authController.js");

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("user"),
    wishListController.addProductToWishlist
  )
  .get(
    authController.protect,
    authController.allowedTo("user"),
    wishListController.getLoggedUserWishlist
  );
router
  .route("/:productId")
  .delete(
    authController.protect,
    authController.allowedTo("user"),
    wishListController.removeProductFromWishlist
  );

module.exports = router;
