const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const validate = require("../../middleware/validate.middleware");
const {
  registerSchema,
  loginSchema,
  passwordResetSchema,
} = require("./auth.validator");
const authenticate = require("../../middleware/authenticate.middleware");

router.post(
  "/register",
  validate(registerSchema),
  authController.registerController,
);
router.post("/login", validate(loginSchema), authController.loginController);
router.post(
  "/forgot-password",
  validate(passwordResetSchema),
  authController.forgetPasswordController,
);
router.post("/reset-password", authController.resetPasswordController);
router.post("/logout", authenticate, authController.logoutController);
router.get("/me", authenticate, authController.authMeController);
module.exports = router;
