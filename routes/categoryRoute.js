const express = require("express");
const router = express.Router({mergeParams : true});
const categoryController = require("../controllers/categoryController.js");
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/categoryValidator.js");
const subCategoryRoute = require("../routes/subCategoryRoute.js");
const authController = require("../controllers/authController.js");

//Nested Route
router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(categoryController.getCategories)
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    categoryController.uploadCategoryImage,
    categoryController.reSizeImage,
    createCategoryValidator,
    categoryController.createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, categoryController.getCategory)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    categoryController.uploadCategoryImage,
    categoryController.reSizeImage,
    updateCategoryValidator,
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteCategoryValidator,
    categoryController.deleteCategory
  );

module.exports = router;
