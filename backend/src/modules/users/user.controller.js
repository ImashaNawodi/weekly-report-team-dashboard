const userService = require("./user.service");

const createUserController = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
const getUserProfileController = async (req, res, next) => {
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

const updateUserProfileController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const updatedProfile = await userService.updateUserProfile(
      userID,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRoleController = async (req, res, next) => {
  try {
    const userAccountID = req.body.userAccountID;
    const role = req.body.role;
    const updatedUser = await userService.updateUserRole(userAccountID, { role });
    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserStatusController = async (req, res, next) => {
  try {
    const { userAccountID, isActive } = req.body;
    const updatedUser = await userService.updateUserStatus(userAccountID, isActive);
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsersController = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req.query);
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getUserProfileController,
  updateUserProfileController,
  updateUserRoleController,
  updateUserStatusController,
  getAllUsersController,
};
