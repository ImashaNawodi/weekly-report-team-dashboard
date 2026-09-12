const express = require("express");
const authenticate = require("../../middleware/authenticate.middleware");
const userController = require("./user.controller");
const router = express.Router();

router.get("/view-profile",authenticate,userController.getUserProfileController);

module.exports = router;