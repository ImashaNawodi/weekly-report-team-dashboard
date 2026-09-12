const express = require("express");
const router = express.Router();
const validate = require("../../middleware/validate.middleware");
const authenticate = require("../../middleware/authenticate.middleware");
const authorize = require("../../middleware/authorize.midleware");
const { createReportSchema, updateReportSchema } = require("./report.validator");
const reportController = require("./report.contoller");
router.post(
  "/create-report",
  authenticate,
  authorize("TEAM_MEMBER"),
  validate(createReportSchema),
  reportController.createReportController,
);
router.get(
  "/my-reports",
  authenticate,
  authorize("TEAM_MEMBER"),
  reportController.getMyReportsController,
);

router.get(
  "/all-reports",
  authenticate,
  authorize("MANAGER", "ADMIN"),
  reportController.getAllReportsController,
);

router.post(
  "/update-report",
  authenticate,
  authorize("TEAM_MEMBER"),
  validate(updateReportSchema),
  reportController.updateReportController
);

router.post(
  "/submit",
  authenticate,
  authorize("TEAM_MEMBER"),
  reportController.submitReportController
);

router.post(
  "/approve",
  authenticate,
  authorize("MANAGER", "ADMIN"),
  reportController.approveReportController
);
module.exports = router;
