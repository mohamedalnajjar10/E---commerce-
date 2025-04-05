const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");

exports.getBrandValidator = [
  check("id").isInt().withMessage("Invalid Brand id format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 3 })
    .withMessage("Too short Brand name")
    .isLength({ max: 32 })
    .withMessage("Too long Brand name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value, { lower: true });
      return true;
    }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").trim().isInt().withMessage("Invalid Brand id format"),
  body("name").optional().custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").trim().isInt().withMessage("Invalid Brand id format"),
  validatorMiddleware,
];
