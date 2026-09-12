const projectModel = require("../models/project.model");

const generateProjectID = async () => {
  const lastProject = await projectModel
    .findOne()
    .sort({ createdAt: -1 });

  if (!lastProject) {
    return "P001";
  }

  const lastNumber = parseInt(
    lastProject.projectNumber.substring(1)
  );

  const nextNumber = lastNumber + 1;

  return `P${String(nextNumber).padStart(3, "0")}`;
};

module.exports = {
  generateProjectID,
};