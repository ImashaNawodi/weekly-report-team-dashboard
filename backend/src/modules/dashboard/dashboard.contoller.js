const dashboardService = require("./dashbaord.service");

const getDashboardSummaryController = async (req, res, next) => {
  try {
    const result = await dashboardService.getDashboardSummary();

    res.status(200).json({
      success: true,
      message: "Dashboard summary retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getDashboardSummaryController,
};
