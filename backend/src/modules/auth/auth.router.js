const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const validate = require("../../middleware/validate");
const { registerSchema } = require("./auth.validator");

router.post("/register",validate(registerSchema),authController.registerController);

module.exports = router;