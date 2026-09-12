const reportService = require("./report.service");
const createReportController = async (req, res, next) => {
  try {
    const result = await reportService.createReport(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyReportsController = async (req, res, next) => {
  try {
    const result = await reportService.getMyReports(
      req.user.id,
      req.query
    );

    res.status(200).json({
      success: true,
      message: "Reports retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReportController,
  getMyReportsController,
};