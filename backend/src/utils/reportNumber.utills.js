const reportModel = require("../models/report.model");

const generateReportID = async () => {
  const lastReport = await reportModel
    .findOne()
    .sort({ createdAt: -1 });

  if (!lastReport) {
    return "R001";
  }

  const lastNumber = parseInt(
    lastReport.reportID.substring(1),
    10
  );

  const nextNumber = lastNumber + 1;

  return `R${String(nextNumber).padStart(3, "0")}`;
};

module.exports = {
  generateReportID,
};