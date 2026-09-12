const userModel = require("../../models/user.model");
const AppError = require("../../utils/appError.utils");

const getUserProfile = async (userID) => {
  const user = await userModel.findById(userID)
   
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const updateUserProfile = async (userID, data) => {
  const user = await userModel.findById(userID);

  if (!user) {
    throw new AppError("User not found", 404);
  } 

  if(data.firstName !== undefined){
    user.firstName = data.firstName;
  }
  if(data.lastName !== undefined){
    user.lastName = data.lastName;
  }
  if(data.email !== undefined){
    user.email = data.email;
  }

  await user.save();
  return ;

};

module.exports = {
  getUserProfile,
  updateUserProfile,
};