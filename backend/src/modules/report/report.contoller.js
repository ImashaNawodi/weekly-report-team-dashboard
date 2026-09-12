const reportService = require("./report.service");
const createReportController = async (req, res, next) => {
  try {
    const result = await reportService.createReport(req.user.id, req.body);
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
    const result = await reportService.getMyReports(req.user.id, req.query);

    res.status(200).json({
      success: true,
      message: "Reports retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllReportsController = async (req, res, next) => {
  try {
    const result = await reportService.getAllReports(req.query);

    res.status(200).json({
      success: true,
      message: "Reports retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateReportController = async (req, res, next) => {
  try {
    const { reportID, ...data } = req.body;
    console.log("Report ID:", reportID);
    console.log("Data to update:", data);
    const result = await reportService.updateReport(
      reportID,
      req.user.id,
      data
    );

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createReportController,
  getMyReportsController,
  getAllReportsController,
  updateReportController,
};
