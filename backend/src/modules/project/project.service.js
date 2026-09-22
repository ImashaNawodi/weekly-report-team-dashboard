const projectModel = require("../../models/project.model");
const userModel = require("../../models/user.model");
const AppError = require("../../utils/appError.utils");
const { generateProjectID } = require("../../utils/projectId.utils");

const createProject = async (data, loggedUser) => {
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
    createdBy: loggedUser,
  });
console.log("Creating project with data:", {
    projectNumber,
    name,
    description,
    teamMembers,
    createdBy: loggedUser,
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
    createdBy: project.createdBy,
  };
};

const getAllProjects = async () => {
  const projects = await projectModel
    .find()
    .populate("teamMembers", "firstName lastName email role profileColor isActive")
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


  const project = await projectModel.findById(projectID);


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


  await project.save();


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

const getUserProjects = async (userID) => {
  const user = await userModel.findById(userID);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const createdProjects = await projectModel
    .find({
      createdBy: userID,
    })
    .populate("teamMembers", "firstName lastName email role isActive")
    .sort({ createdAt: -1 });

  const teamProjects = await projectModel
    .find({
      teamMembers: userID,
      createdBy: { $ne: userID },
    })
    .populate("teamMembers", "firstName lastName email role isActive")
    .sort({ createdAt: -1 });

  const formatProject = (project) => ({
    projectNumber: project.projectNumber,
    projectID: project._id,
    name: project.name,
    description: project.description,
    teamMembers: project.teamMembers,
    numberOfTeamMembers: project.teamMembers.length,
    isActive: project.isActive,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    createdBy: project.createdBy,
  });

  return {
    createdProjects: createdProjects.map(formatProject),
    teamProjects: teamProjects.map(formatProject),
  };
};

module.exports = {
  createProject,
  getAllProjects,
  updateProject,
  updateProjectStatus,
  getUserProjects,
};
