const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

const {
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  createUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator.js");
const authController = require("../controllers/authController.js");

router
  .route("/getMe")
  .get(
    authController.protect,
    userController.getLoggedUserData,
    userController.getUser
  );

router
  .route("/changeMyPassword")
  .put(authController.protect, userController.updateLoggedPassword);

router
  .route("/updateMe")
  .put(
    authController.protect,
    updateLoggedUserValidator,
    userController.updateLoggedUserData
  );

router.put(
  "/changepassowrd/:id",
  changeUserPasswordValidator,
  userController.changeUserPassowrd
);

router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    userController.getUsers
  )
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    userController.uploadUserImage,
    userController.reSizeImage,
    createUserValidator,
    userController.createUser
  );
router
  .route("/:id")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    getUserValidator,
    userController.getUser
  )
  .put(
    authController.protect,
    authController.allowedTo("admin"),
    userController.uploadUserImage,
    userController.reSizeImage,
    updateUserValidator,
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteUserValidator,
    userController.deleteUser
  );

module.exports = router;
