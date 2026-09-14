const express = require("express");
const router= express.Router();
const dashboardController = require("./dashboard.contoller");
const authenticate = require("../../middleware/authenticate.middleware");
const authorize = require("../../middleware/authorize.midleware");

router.get(
  "/summary",
  authenticate,
  authorize("MANAGER", "ADMIN"),
  dashboardController.getDashboardSummaryController
);
module.exports = router;