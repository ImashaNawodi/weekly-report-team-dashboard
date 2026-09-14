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
    const {
      reportID,
      weekStart,
      weekEnd,
      workCompleted,
      plannedWork,
      blockers,
    } = req.body;

    const result = await reportService.updateReport(reportID, req.user.id, {
      weekStart,
      weekEnd,
      workCompleted,
      plannedWork,
      blockers,
    });

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update report controller error:", error);
    next(error);
  }
};

const submitReportController = async (req, res, next) => {
  try {
    const { reportID } = req.body;
    const result = await reportService.submitReport(reportID, req.user.id);

    res.status(200).json({
      success: true,
      message: "Report submitted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const approveReportController = async (req, res, next) => {
  try {
    const { reportID } = req.body;
    const result = await reportService.approveReport(reportID, req.user.id);

    res.status(200).json({
      success: true,
      message: "Report approved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const requestCorrectionController = async (req, res, next) => {
  try {
    const { reportID, managerFeedback } = req.body;

    const result = await reportService.requestCorrection(
      reportID,
      managerFeedback,
    );

    res.status(200).json({
      success: true,
      message: "Correction requested successfully",
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
  submitReportController,
  approveReportController,
  requestCorrectionController,
};
