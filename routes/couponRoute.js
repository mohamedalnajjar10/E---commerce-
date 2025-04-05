const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponConteoller.js");
const {
  getCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
  createCouponValidator,
} = require("../utils/validators/couponValidator.js");

const authController = require("../controllers/authController.js");

// router.use("/:CategoryId/subcategories" , subCategoryRoute);

router
  .route("/")
  .get(couponController.getCoupons)
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    createCouponValidator,
    couponController.creatCoupon
  );
router
  .route("/:id")
  .get(getCouponValidator, couponController.getCoupon)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    updateCouponValidator,
    couponController.updatCoupon
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteCouponValidator,
    couponController.deletCoupon
  );

module.exports = router;
