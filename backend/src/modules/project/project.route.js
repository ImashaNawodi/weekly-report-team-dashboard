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
  authorize("MANAGER"),
  validate(createProjectSchema),
  projectController.createProjectController,
);
router.get(
  "/get-all-projects",
  authenticate,
  authorize("MANAGER"),
  projectController.getAllProjectsController,
);
router.post(
  "/update-project",
  authenticate,
  authorize("MANAGER"),
 //validate(updateProjectSchema),
  projectController.updateProjectController,
);
router.post(
  "/update-project-status",
  authenticate,
  authorize("MANAGER"),
  //validate(updateProjectStatusSchema),
  projectController.updateProjectStatusController,
);

router.get(
  "/get-my-project",
  authenticate,
  authorize("MANAGER", "TEAM_MEMBER"),
  projectController.getUserProjectsController,
);

module.exports = router;
