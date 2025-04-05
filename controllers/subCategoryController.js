const subCategory = require("../models/subCategory.js");
const factory = require ("./handelrsFactory.js");

//Nested Route
exports.setCategoryIdToBody = (req , res ,next) => {
  if (! req.body.categoryId) req.body.categoryId = req.params.categoryId ;
  next()
}
  
//Nested Route
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};


exports.getSubCategories = factory.getAll(subCategory);

exports.createSubCategory = factory.createOne(subCategory);

exports.getSubCategory = factory.getOne(subCategory);

exports.updateSubCategory = factory.updateOne(subCategory);

exports.deleteSubCategory = factory.deleteOne(subCategory);