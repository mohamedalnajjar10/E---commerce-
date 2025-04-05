const express = require("express");
const router = express.Router();
const addresesController = require("../controllers/addresesController.js");
const authController = require("../controllers/authController.js");

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("user"),
    addresesController.addAddress
  )
  .get(
    authController.protect,
    authController.allowedTo("user"),
    addresesController.getLoggedUserAddreses
  );
router
  .route("/:addresesId")
  .delete(
    authController.protect,
    authController.allowedTo("user"),
    addresesController.removeAddress
  );

module.exports = router;
