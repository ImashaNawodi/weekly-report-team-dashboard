const userService = require("./user.service");

const getUserProfileController = async (req, res,next) => {
  try {
    const userID = req.user.id;
    const userProfile = await userService.getUserProfile(userID);

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: userProfile,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfileController = async (req, res,next) => {
  try {
    const userID = req.user.id;
    const updatedProfile = await userService.updateUserProfile(userID, req.body);   
    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfileController,
  updateUserProfileController,
};