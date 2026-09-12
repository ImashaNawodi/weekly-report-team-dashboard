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

module.exports = {
  createReportController,
};