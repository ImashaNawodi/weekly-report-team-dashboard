const projectModel = require("../../models/project.model");
const userModel = require("../../models/user.model");
const reportModel = require("../../models/report.model");
const { generateReportID } = require("../../utils/reportNumber.utills");
const AppError = require("../../utils/appError.utils");

const createReport = async (userID, data) => {
  const {
    project,
    weekStart,
    weekEnd,
    workCompleted,
    plannedWork,
    blockers,
  } = data;

  const user = await userModel.findById(userID);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const projectExists = await projectModel.findById(project);

  if (!projectExists) {
    throw new AppError("Project not found", 404);
  }

  if (!projectExists.isActive) {
    throw new AppError(
      "Cannot create a report for an inactive project",
      400
    );
  }

  const startDate = new Date(weekStart);
  const endDate = new Date(weekEnd);

  if (startDate > endDate) {
    throw new AppError(
      "Week start cannot be after week end",
      400
    );
  }

  const existingReport = await reportModel.findOne({
    user: userID,
    project,
    weekStart: startDate,
  });

  if (existingReport) {
    throw new AppError(
      "A report already exists for this project and week",
      400
    );
  }

  const reportID = await generateReportID();

  const report = new reportModel({
    reportID,
    user: userID,
    project,
    weekStart: startDate,
    weekEnd: endDate,
    workCompleted,
    plannedWork,
    blockers: blockers || "",
    status: "DRAFT",
  });

  await report.save();

  return report;
};

module.exports = {
  createReport,
};