const projectModel = require("../../models/project.model");
const userModel = require("../../models/user.model");
const reportModel = require("../../models/report.model");
const { generateReportID } = require("../../utils/reportNumber.utills");
const AppError = require("../../utils/appError.utils");

const createReport = async (userID, data) => {
  const {
    project,
    weekNumber,
    weekStart,
    weekEnd,
    tasks,
    plannedTasks,
    blockers,
    achievements,
    hours,
    notes,
    links,
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

  if (!weekNumber || weekNumber < 1) {
    throw new AppError("Invalid week number", 400);
  }

  const startDate = new Date(weekStart);
  const endDate = new Date(weekEnd);

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    throw new AppError("Invalid week dates", 400);
  }

  if (startDate > endDate) {
    throw new AppError(
      "Week start cannot be after week end",
      400
    );
  }

  const existingReport = await reportModel.findOne({
    user: userID,
    project,
    weekNumber,
  });

  if (existingReport) {
    throw new AppError(
      "A report already exists for this project and week",
      400
    );
  }

  const reportNumber = await generateReportID();

  const report = new reportModel({
    reportNumber,
    user: userID,
    project,
    weekNumber,
    weekStart: startDate,
    weekEnd: endDate,

    tasks: tasks || [],
    plannedTasks: plannedTasks || [],
    blockers: blockers || [],
    achievements: achievements || [],
    hours: hours || [],

    notes: notes || "",
    links: links || "",

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
  const report = await reportModel.findById(reportID);

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (report.user.toString() !== userID.toString()) {
    throw new AppError(
      "You can only update your own report",
      403
    );
  }

  if (
    report.status !== "DRAFT" &&
    report.status !== "NEEDS_CORRECTION"
  ) {
    throw new AppError(
      "Only draft or reports needing correction can be edited",
      400
    );
  }

  const {
    project,
    weekNumber,
    weekStart,
    weekEnd,
    tasks,
    plannedTasks,
    blockers,
    achievements,
    hours,
    notes,
    links,
  } = data;

  if (project) {
    const projectExists = await projectModel.findById(project);

    if (!projectExists) {
      throw new AppError("Project not found", 404);
    }

    if (!projectExists.isActive) {
      throw new AppError(
        "Cannot use an inactive project",
        400
      );
    }

    report.project = project;
  }

  if (weekNumber !== undefined) {
    if (weekNumber < 1) {
      throw new AppError("Invalid week number", 400);
    }

    report.weekNumber = weekNumber;
  }

  if (weekStart !== undefined) {
    const startDate = new Date(weekStart);

    if (Number.isNaN(startDate.getTime())) {
      throw new AppError("Invalid week start date", 400);
    }

    report.weekStart = startDate;
  }

  if (weekEnd !== undefined) {
    const endDate = new Date(weekEnd);

    if (Number.isNaN(endDate.getTime())) {
      throw new AppError("Invalid week end date", 400);
    }

    report.weekEnd = endDate;
  }

  if (report.weekStart > report.weekEnd) {
    throw new AppError(
      "Week start cannot be after week end",
      400
    );
  }

  if (tasks !== undefined) {
    report.tasks = tasks;
  }

  if (plannedTasks !== undefined) {
    report.plannedTasks = plannedTasks;
  }

  if (blockers !== undefined) {
    report.blockers = blockers;
  }

  if (achievements !== undefined) {
    report.achievements = achievements;
  }

  if (hours !== undefined) {
    report.hours = hours;
  }

  if (notes !== undefined) {
    report.notes = notes;
  }

  if (links !== undefined) {
    report.links = links;
  }

  // If manager requested corrections,
  // editing makes the report a draft again.
  if (report.status === "NEEDS_CORRECTION") {
    report.status = "DRAFT";
    report.managerFeedback = "";
  }

  await report.save();

  return report;
};

const submitReport = async (reportID, userID) => {
  const report = await reportModel.findById(reportID);

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (report.user.toString() !== userID.toString()) {
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

  const versionNumber = report.versions.length + 1;

  report.versions.push({
    versionNumber,
    submittedAt: new Date(),
    submittedBy: userID,

    tasks: report.tasks.map((task) => task.toObject()),
    plannedTasks: report.plannedTasks.map((task) =>
      task.toObject()
    ),
    blockers: report.blockers.map((blocker) =>
      blocker.toObject()
    ),
    achievements: report.achievements.map((achievement) =>
      achievement.toObject()
    ),
    hours: report.hours.map((hour) => hour.toObject()),

    notes: report.notes,
    links: report.links,

    status: "SUBMITTED",
  });

  report.status = "SUBMITTED";
  report.submittedAt = new Date();

  await report.save();

  return report;
};

const approveReport = async (reportID, managerID) => {
  const report = await reportModel.findById(reportID);

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (report.status !== "SUBMITTED") {
    throw new AppError(
      "Only submitted reports can be approved",
      400
    );
  }

  report.status = "APPROVED";
  report.reviewedBy = managerID;
  report.reviewedAt = new Date();
  report.managerFeedback = "";

  await report.save();

  return report;
};

const requestCorrection = async (
  reportID,
  managerFeedback
) => {
  const report = await reportModel.findById(reportID);

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (report.status !== "SUBMITTED") {
    throw new AppError(
      "Only submitted reports can be sent for correction",
      400
    );
  }

  report.status = "NEEDS_CORRECTION";
  report.reviewedAt = new Date();

  report.managerFeedback =
    managerFeedback ||
    "Please review and correct your report.";

  await report.save();

  return report;
};
module.exports = {
  createReport,
  getMyReports,
  getAllReports,
  updateReport,
  submitReport,
  approveReport,
  requestCorrection,
};
