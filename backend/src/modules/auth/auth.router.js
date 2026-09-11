const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const validate = require("../../middleware/validate");
const { registerSchema, loginSchema } = require("./auth.validator");

router.post("/register",validate(registerSchema),authController.registerController);
router.post("/login",validate(loginSchema),authController.loginController);


module.exports = router;