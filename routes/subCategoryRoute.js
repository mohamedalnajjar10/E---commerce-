const express = require("express");
const router = express.Router({ mergeParams: true });
const subCategoryController = require("../controllers/subCategoryController.js");
const subCategory = require("../models/subCategory.js");
const {
  createCategoryValidator,
} = require("../utils/validators/categoryValidator.js");

const {
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator.js");
const authController = require("../controllers/authController.js");

router
  .route("/")
  .get(
    subCategoryController.createFilterObj,
    subCategoryController.getSubCategories
  )
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    subCategoryController.setCategoryIdToBody,
    createCategoryValidator,
    subCategoryController.createSubCategory
  );

router
  .route("/:id")
  .get(getSubCategoryValidator, subCategoryController.getSubCategory)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    subCategoryController.updateSubCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteSubCategoryValidator,
    subCategoryController.deleteSubCategory
  );
module.exports = router;
