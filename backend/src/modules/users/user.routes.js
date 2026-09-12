const express = require("express");
const authenticate = require("../../middleware/authenticate.middleware");
const userController = require("./user.controller");
const { updateProfileSchema,updateRoleSchema,updateUserStatusSchema } = require("./user.validator");
const validate = require("../../middleware/validate.middleware");
const authorize = require("../../middleware/authorize.midleware");
const router = express.Router();

router.get("/view-profile",authenticate,userController.getUserProfileController);
router.post("/update-profile",authenticate,validate(updateProfileSchema),userController.updateUserProfileController);
router.post("/update-role",authenticate,authorize("ADMIN"),validate(updateRoleSchema),userController.updateUserRoleController);
router.post("/update-status",authenticate,authorize("ADMIN"),validate(updateUserStatusSchema),userController.updateUserStatusController);
module.exports = router;