const express = require("express");
const router = express.Router();
const projectController = require("./project.controller");
const validate = require("../../middleware/validate.middleware");
const {
  createProjectSchema,
  updateProjectStatusSchema,
  updateProjectSchema,
} = require("./project.validator");
const authenticate = require("../../middleware/authenticate.middleware");
const authorize = require("../../middleware/authorize.midleware");

// check this condition later
router.post(
  "/create",
  authenticate,
  //authorize("ADMIN"),
  validate(createProjectSchema),
  projectController.createProjectController,
);
router.get(
  "/get-all-projects",
  authenticate,
  //authorize("ADMIN"),
  projectController.getAllProjectsController,
);
router.post(
  "/update-project",
  authenticate,
  authorize("ADMIN", "MANAGER"),
 //validate(updateProjectSchema),
  projectController.updateProjectController,
);
router.post(
  "/update-project-status",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  //validate(updateProjectStatusSchema),
  projectController.updateProjectStatusController,
);

module.exports = router;
