const express = require("express");
const router = express.Router();
const validate = require("../../middleware/validate.middleware");
const authenticate = require("../../middleware/authenticate.middleware");
const authorize = require("../../middleware/authorize.midleware");
const { createReportSchema } = require("./report.validator");
const reportController = require("./report.contoller");
router.post(
  "/create-report",
  authenticate,
  authorize("TEAM_MEMBER"),
  validate(createReportSchema),
  reportController.createReportController
);

module.exports = router;