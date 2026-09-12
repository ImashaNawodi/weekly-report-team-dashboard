const projectModel = require("../../models/project.model");
const AppError = require("../../utils/appError.utils");
const { generateProjectID } = require("../../utils/projectId.utils");

const createProject = async (data) => {
  const { name, description, teamMembers = [] } = data;

  const existingProject = await projectModel.findOne({ name });

  if (existingProject) {
    throw new AppError("Project already exists", 400);
  }

  const projectID = await generateProjectID();

  const project = new projectModel({
    projectID,
    name,
    description,
    teamMembers,
  });

  await project.save();

  return {
    projectID: project.projectID,
    name: project.name,
    description: project.description,
    teamMembers: project.teamMembers,
    numberOfTeamMembers: project.teamMembers.length,
    isActive: project.isActive,
  };
};

const getAllProjects = async () => {
  const projects = await projectModel
    .find()
    .populate("teamMembers", "firstName lastName email role")
    .sort({ createdAt: -1 });

  return projects.map((project) => ({
    projectID: project.projectID,
    name: project.name,
    description: project.description,
    teamMembers: project.teamMembers,
    numberOfTeamMembers: project.teamMembers.length,
    isActive: project.isActive,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }));
};

module.exports = {
  createProject,
  getAllProjects,
};
