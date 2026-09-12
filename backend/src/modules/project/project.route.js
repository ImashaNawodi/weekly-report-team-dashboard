const express = require("express");
const router = express.Router();
const projectController = require("./project.controller");
const validate = require("../../middleware/validate.middleware");
const { createProjectSchema } = require("./project.validator");
const authenticate = require("../../middleware/authenticate.middleware");
const authorize = require("../../middleware/authorize.midleware");


// check this condition later
router.post("/create", authenticate, authorize("ADMIN", "MANAGER"), validate(createProjectSchema), projectController.createProjectController);

module.exports = router;