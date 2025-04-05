const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator.js");

router.route("/singup").post(signupValidator, authController.signup);

router.route("/login").post(loginValidator, authController.login);

router.route("/forgetPassword").post( authController.forgetPassword);

router.route("/verifyReserCode").post( authController.verifyPassResetCode);

router.route("/resetPassword").put( authController.resetPassword);



module.exports = router;
