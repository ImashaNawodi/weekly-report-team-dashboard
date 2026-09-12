const userModel = require("../../models/user.model");
const AppError = require("../../utils/appError.utils");

const getUserProfile = async (userID) => {
  const user = await userModel.findById(userID)
   
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

module.exports = {
  getUserProfile,
};