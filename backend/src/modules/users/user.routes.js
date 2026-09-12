const express = require("express");
const authenticate = require("../../middleware/authenticate.middleware");
const userController = require("./user.controller");
const { updateProfileSchema,updateRoleSchema } = require("./user.validator");
const validate = require("../../middleware/validate.middleware");
const router = express.Router();

router.get("/view-profile",authenticate,userController.getUserProfileController);
router.post("/update-profile",authenticate,validate(updateProfileSchema),userController.updateUserProfileController);
router.post("/update-role",authenticate,validate(updateRoleSchema),userController.updateUserRoleController);
module.exports = router;