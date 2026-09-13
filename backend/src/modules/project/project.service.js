const projectModel = require("../../models/project.model");
const userModel = require("../../models/user.model");
const AppError = require("../../utils/appError.utils");
const { generateProjectID } = require("../../utils/projectId.utils");

const createProject = async (data) => {
  const { name, description, teamMembers = [] } = data;

  const existingProject = await projectModel.findOne({ name });

  if (existingProject) {
    throw new AppError("Project already exists", 400);
  }

  const projectNumber = await generateProjectID();

  const project = new projectModel({
    projectNumber,
    name,
    description,
    teamMembers,
  });

  await project.save();

  return {
    projectNumber: project.projectNumber,
    projectID: project._id,
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
    projectNumber: project.projectNumber,
    projectID: project._id,
    name: project.name,
    description: project.description,
    teamMembers: project.teamMembers,
    numberOfTeamMembers: project.teamMembers.length,
    isActive: project.isActive,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }));
};

const updateProject = async (projectID, data) => {
  console.log("Project ID:", projectID);
  console.log("Update data:", data);

  const project = await projectModel.findById(projectID);

  console.log("Project before update:", project);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (data.name !== undefined) {
    const existingProject = await projectModel.findOne({
      name: data.name,
      _id: { $ne: project._id },
    });

    if (existingProject) {
      throw new AppError("Project already exists", 400);
    }

    project.name = data.name;
  }

  if (data.description !== undefined) {
    project.description = data.description;
  }

  if (data.teamMembers !== undefined) {
    const users = await userModel.find({
      _id: { $in: data.teamMembers },
    });

    if (users.length !== data.teamMembers.length) {
      throw new AppError("One or more team members do not exist", 400);
    }

    project.teamMembers = data.teamMembers;
  }

  console.log("Project before save:", project);

  await project.save();

  console.log("Project after save:", project);

  await project.populate(
    "teamMembers",
    "firstName lastName email role"
  );

  return {
    projectNumber: project.projectNumber,
    projectID: project._id,
    name: project.name,
    description: project.description,
    teamMembers: project.teamMembers,
    numberOfTeamMembers: project.teamMembers.length,
    isActive: project.isActive,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

const updateProjectStatus = async (projectID, data) => {
  const project = await projectModel.findById(projectID);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  project.isActive = data.isActive;

  await project.save();

  return {
    projectID: project.projectID,
    name: project.name,
    description: project.description,
    numberOfTeamMembers: project.teamMembers.length,
    isActive: project.isActive,
    updatedAt: project.updatedAt,
  };
};

module.exports = {
  createProject,
  getAllProjects,
  updateProject,
  updateProjectStatus,
};
