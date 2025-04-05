const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController.js");
const {
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
  createBrandValidator,
} = require("../utils/validators/brandValidator.js");
const authController = require("../controllers/authController.js");

// const subCategoryRoute = require ("../routes/subCategoryRoute.js");

// router.use("/:CategoryId/subcategories" , subCategoryRoute);

router
  .route("/")
  .get(brandController.getBrands)
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    brandController.uploadBrandImage,
    brandController.reSizeImage,
    createBrandValidator,
    brandController.createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, brandController.getBrand)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    brandController.uploadBrandImage,
    brandController.reSizeImage,
    updateBrandValidator,
    brandController.updateBrand
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteBrandValidator,
    brandController.deleteBrand
  );

module.exports = router;
