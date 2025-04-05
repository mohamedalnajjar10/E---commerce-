const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController.js");
const reviewRoute = require ("../routes/reviewRoute.js");

const router = express.Router({mergeParams : true});

//Nested Route
router.use("/:productId/reviews" , reviewRoute);

router
  .route("/")
  .get(productController.getProducts)
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    productController.uploadProductImages,
    productController.reSizeProductImage,
    createProductValidator,
    productController.createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, productController.getProduct)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    productController.uploadProductImages,
    productController.reSizeProductImage,
    updateProductValidator,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteProductValidator,
    productController.deleteProduct
  );

module.exports = router;
