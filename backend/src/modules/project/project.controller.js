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

module.exports = {
  createProjectController,
};