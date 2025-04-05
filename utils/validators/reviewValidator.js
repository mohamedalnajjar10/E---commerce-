const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const review = require("../../models/review");
const product = require("../../models/product");
const user = require("../../models/user");

exports.getReviewValidator = [
  check("id").isInt().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Ratings value required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 to 5"),
  check("userId")
    .isInt()
    .withMessage("Invalid user ID format")
    .custom(async (val) => {
      const User = await user.findByPk(val);
      if (!User) {
        return Promise.reject(new Error("User not found"));
      }
    }),

  check("productId")
    .isInt()
    .withMessage("Invalid Product ID format")
    .custom(async (val, { req }) => {
      // تحقق من أن المنتج موجود في قاعدة البيانات
      const Product = await product.findByPk(val);
      if (!Product) {
        return Promise.reject(new Error("Product not found"));
      }

      // تحقق إذا كان المستخدم قد قام بمراجعة هذا المنتج بالفعل
      const reviewExists = await review.findOne({
        where: { userId: req.body.userId, productId: val },
      });

      if (reviewExists) {
        return Promise.reject(
          new Error("You have already reviewed this product")
        );
      }
    }),

  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .trim()
    .toInt()
    .isInt()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) => {
      // Check review ownership before update
      return review.findByPk(val).then((Review) => {
        if (!Review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));
        }
        if (Review.userId.toString() !== req.User.id.toString()) {
          return Promise.reject(
            new Error(`Your are not allowed to perform this action`)
          );
        }
      });
    }),

  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .trim()
    .toInt()
    .isInt()
    .withMessage("Invalid Review id format")
    .custom( (val, { req }) => {
       // Check review ownership before update
       if (req.userId && req.userId.role === "user") {
        return  review.findByPk(val).then((Review) => {
          if (!Review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`)
            );
          }
          if (Review.userId.toString() !== req.userId.id.toString()) {
            return Promise.reject(
              new Error(`Your are not allowed to perform this action`)
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
