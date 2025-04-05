const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
const user = require("../../models/user.js");
const { where } = require("sequelize");
const bcrypt = require("bcrypt");

exports.getUserValidator = [
  check("id").isInt().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 2 })
    .withMessage("Too short User name")
    .isLength({ max: 55 })
    .withMessage("Too long User name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value, { lower: true });
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email Requried")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (value) => {
      await user.findOne({ where: { email: value } }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in user"));
        }
      });
    }),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  check("profileImg").optional(),

  check("role").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-PS"])
    .withMessage("Invalid Phone"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").trim().isInt().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
    
  check("email")
    .notEmpty()
    .withMessage("Email Requried")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (value) => {
      await user.findOne({ where: { email: value } }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in user"));
        }
      });
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-PS"])
    .withMessage("Invalid Phone"),

  check("profileImg").optional(),

  check("role").optional(),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isInt().withMessage("Invalid User id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirm"),
  body("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const User = await user.findByPk(req.params.id);
      if (!User) {
        throw new Error("There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        User.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      // 2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").trim().isInt().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  body("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
    
  check("email")
    .notEmpty()
    .withMessage("Email Requried")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (value) => {
      await user.findOne({ where: { email: value } }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in user"));
        }
      });
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-PS"])
    .withMessage("Invalid Phone"),

  check("profileImg").optional(),

  validatorMiddleware,
];
