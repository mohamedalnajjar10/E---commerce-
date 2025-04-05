const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");

exports.getCouponValidator = [
  check("name").optional().isInt().withMessage("Invalid Coupon id format"),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Coupon required")
    .isLength({ min: 3 })
    .withMessage("Too short Coupon name")
    .isLength({ max: 32 })
    .withMessage("Too long Coupon name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value, { lower: true });
      return true;
    }),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  body("name").optional().custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("name").optional().trim().isInt().withMessage("Invalid Coupon id format"),
  validatorMiddleware,
];
