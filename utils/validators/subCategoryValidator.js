const { check , body} = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");


exports.getSubCategoryValidator = [
  check("id").isInt().withMessage("Invalid category id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
    check("name")
    .trim()
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((value , {req}) => {
      req.body.slug = slugify(value ,{ lower: true });
      return true; 
    }),
    
    check('categoryId')
    .notEmpty()
    .withMessage('subCategory must be belong to category')
    .isInt()
    .withMessage('Invalid Category id format'),
    validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").trim().isInt().withMessage("Invalid category id format"),
  body("name").custom((value , {req}) => {
    req.body.slug = slugify(value);
    return true; 
  }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").trim().isInt().withMessage("Invalid category id format"),
  validatorMiddleware,
];
