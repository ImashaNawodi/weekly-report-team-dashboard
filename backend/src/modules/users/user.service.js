const userModel = require("../../models/user.model");
const AppError = require("../../utils/appError.utils");

const getUserProfile = async (userID) => {
  const user = await userModel.findById(userID);

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

  if (data.firstName !== undefined) {
    user.firstName = data.firstName;
  }
  if (data.lastName !== undefined) {
    user.lastName = data.lastName;
  }
  if (data.email !== undefined) {
    user.email = data.email;
  }

  await user.save();
  return user;
};

const updateUserRole = async (userID, newRole) => {
  const { role } = newRole;
  const user = await userModel.findById(userID);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  user.role = role;
  await user.save();
  return user;
};

const updateUserStatus = async (userID, isActive) => {
  const user = await userModel.findById(userID);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  user.isActive = isActive;
  await user.save();
  return user;
};

const getAllUsers = async (query) => {
  const {
    page = 1,
    limit = 10,
    role,
    search,
    isActive,
  } = query;

  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  if (search) {
    filter.$or = [
      {
        firstName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const users = await userModel
    .find(filter)
    .select("-password")
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalUsers = await userModel.countDocuments(filter);

  return {
    users,
    pagination: {
      totalUsers,
      currentPage: Number(page),
      totalPages: Math.ceil(totalUsers / Number(limit)),
      limit: Number(limit),
    },
  };
};
module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserRole,
  updateUserStatus,
  getAllUsers,
};
