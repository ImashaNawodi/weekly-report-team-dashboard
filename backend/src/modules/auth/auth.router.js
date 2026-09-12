const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const validate = require("../../middleware/validate");
const { registerSchema, loginSchema, passwordResetSchema } = require("./auth.validator");

router.post("/register",validate(registerSchema),authController.registerController);
router.post("/login",validate(loginSchema),authController.loginController);
router.post("/forget-pw",validate(passwordResetSchema),authController.forgetPasswordController);

module.exports = router;