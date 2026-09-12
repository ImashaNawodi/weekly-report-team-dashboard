const projectModel = require("../../models/project.model");
const userModel = require("../../models/user.model");
const reportModel = require("../../models/report.model");
const { generateReportID } = require("../../utils/reportNumber.utills");
const AppError = require("../../utils/appError.utils");

const createReport = async (userID, data) => {
  const { project, weekStart, weekEnd, workCompleted, plannedWork, blockers } =
    data;

  const user = await userModel.findById(userID);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const projectExists = await projectModel.findById(project);

  if (!projectExists) {
    throw new AppError("Project not found", 404);
  }

  if (!projectExists.isActive) {
    throw new AppError("Cannot create a report for an inactive project", 400);
  }

  const startDate = new Date(weekStart);
  const endDate = new Date(weekEnd);

  if (startDate > endDate) {
    throw new AppError("Week start cannot be after week end", 400);
  }

  const existingReport = await reportModel.findOne({
    user: userID,
    project,
    weekStart: startDate,
  });

  if (existingReport) {
    throw new AppError(
      "A report already exists for this project and week",
      400,
    );
  }

  const reportNumber = await generateReportID();

  const report = new reportModel({
    reportNumber,
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

const getMyReports = async (userID, query) => {
  const { page = 1, limit = 10, status, project } = query;

  const filter = {
    user: userID,
  };

  if (status) {
    filter.status = status;
  }

  if (project) {
    filter.project = project;
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const reports = await reportModel
    .find(filter)
    .populate("project", "projectID name")
    .sort({ weekStart: -1 })
    .skip(skip)
    .limit(limitNumber);

  const totalReports = await reportModel.countDocuments(filter);

  return {
    reports,
    pagination: {
      totalReports,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalReports / limitNumber),
      limit: limitNumber,
    },
  };
};

const getAllReports = async (query) => {
  const { page = 1, limit = 10, status, project, user } = query;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (project) {
    filter.project = project;
  }

  if (user) {
    filter.user = user;
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const reports = await reportModel
    .find(filter)
    .populate("user", "firstName lastName email role")
    .populate("project", "projectID name")
    .sort({ weekStart: -1 })
    .skip(skip)
    .limit(limitNumber);

  const totalReports = await reportModel.countDocuments(filter);

  return {
    reports,
    pagination: {
      totalReports,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalReports / limitNumber),
      limit: limitNumber,
    },
  };
};

const updateReport = async (reportID, userID, data) => {
  // Check later
  const report = await reportModel.findOne(reportID);
  console.log("Report found:", report);
  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (report.user.toString() !== userID) {
    throw new AppError("You can only update your own report", 403);
  }

  if (report.status !== "DRAFT" && report.status !== "NEEDS_CORRECTION") {
    throw new AppError(
      "Only draft or reports needing correction can be edited",
      400,
    );
  }

  Object.assign(report, data);

  if (report.status === "NEEDS_CORRECTION") {
    report.status = "DRAFT";
    report.managerFeedback = "";
  }

  await report.save();

  return report;
};
const submitReport = async (
  reportID,
  userID
) => {
  const report = await reportModel.findById(reportID);

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (report.user.toString() !== userID) {
    throw new AppError(
      "You can only submit your own report",
      403
    );
  }

  if (report.status !== "DRAFT") {
    throw new AppError(
      "Only draft reports can be submitted",
      400
    );
  }

  const versionNumber =
    report.versions.length + 1;

  report.versions.push({
    versionNumber,
    submittedAt: new Date(),
    submittedBy: userID,
    workCompleted: report.workCompleted,
    plannedWork: report.plannedWork,
    blockers: report.blockers,
    status: "SUBMITTED",
  });

  report.status = "SUBMITTED";
  report.submittedAt = new Date();

  await report.save();

  return report;
};


module.exports = {
  createReport,
  getMyReports,
  getAllReports,
  updateReport,
  submitReport,
};
