const projectService = require("./project.service");
const createProjectController = async (req, res, next) => {
  try {
    const result = await projectService.createProject(req.body);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProjectsController = async (req, res, next) => {
  try {
    const result = await projectService.getAllProjects();

    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateProjectController = async (req, res, next) => {
  try {
    const { projectID, ...data } = req.body;

    const result = await projectService.updateProject(projectID, data);

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateProjectStatusController = async (req, res, next) => {
  try {
    const { projectID, ...data } = req.body;
    const result = await projectService.updateProjectStatus(projectID, data);

    res.status(200).json({
      success: true,
      message: "Project status updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUserProjectsController = async (req, res, next) => {
  try {
    const result = await projectService.getUserProjects(req.user.id);

    res.status(200).json({
      success: true,
      message: "User projects retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createProjectController,
  getAllProjectsController,
  updateProjectController,
  updateProjectStatusController,
  getUserProjectsController,
};
