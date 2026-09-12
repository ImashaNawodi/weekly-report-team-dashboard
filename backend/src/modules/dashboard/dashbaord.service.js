const reportModel = require("../../models/report.model");

const getDashboardSummary = async () => {
  const [
    totalReports,
    draftReports,
    submittedReports,
    approvedReports,
    correctionReports,
    totalProjects,
    totalTeamMembers,
  ] = await Promise.all([
    reportModel.countDocuments(),

    reportModel.countDocuments({
      status: "DRAFT",
    }),

    reportModel.countDocuments({
      status: "SUBMITTED",
    }),

    reportModel.countDocuments({
      status: "APPROVED",
    }),

    reportModel.countDocuments({
      status: "NEEDS_CORRECTION",
    }),

    projectModel.countDocuments({
      isActive: true,
    }),

    userModel.countDocuments({
      role: "TEAM_MEMBER",
      isActive: true,
    }),
  ]);

  return {
    reports: {
      total: totalReports,
      draft: draftReports,
      submitted: submittedReports,
      approved: approvedReports,
      needsCorrection: correctionReports,
    },

    totalProjects,
    totalTeamMembers,
  };
};

module.exports = {
  getDashboardSummary,
};