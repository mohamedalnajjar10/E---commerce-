const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController.js");
const {
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  createReviewValidator,
} = require("../utils/validators/reviewValidator.js");
const authController = require("../controllers/authController.js");

router
  .route("/")
  .get(reviewController.createFilterObj, reviewController.getreviews)
  .post(
    authController.protect,
    authController.allowedTo("user"),
    reviewController.setProductIdAndUserIdToBody,
    createReviewValidator,
    reviewController.createreview
  );
router
  .route("/:id")
  .get(getReviewValidator, reviewController.getreview)
  .put(
    authController.protect,
    authController.allowedTo("user"),
    updateReviewValidator,
    reviewController.updatereview
  )
  .delete(
    authController.protect,
    authController.allowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    reviewController.deletereview
  );

module.exports = router;
