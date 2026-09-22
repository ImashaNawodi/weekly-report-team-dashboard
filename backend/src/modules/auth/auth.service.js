const bcrypt = require("bcrypt");

const userModel = require("../../models/user.model");

const { sendResetEmail } = require("../../utils/mailer.utils");

const {
  generateToken,
  verifyToken,
  generateResetToken,
} = require("../../utils/token.utils");

const AppError = require("../../utils/appError.utils");
const { assignProfileColor } = require("../../utils/profileColor.util");

const registerUser = async (data) => {
  const { firstName, lastName, email, password } = data;

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const salt = Number(process.env.SALT);
  const hashedPassword = await bcrypt.hash(password, salt);
  const profileColor = await assignProfileColor();

  const user = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "TEAM_MEMBER",
    profileColor,
  });

  await user.save();

  const token = generateToken(user);

  return {
    user: {
      userID: user.userID,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profileColor: user.profileColor,
    },
    token,
  };
};

const loginUser = async (data) => {
  const { email, password } = data;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 400);
  }

  if (!user.isActive) {
    throw new AppError(
      "Your account is inactive. Please contact an administrator.",
      403,
    );
  }

  const token = generateToken(user);

  return {
    user: {
      userID: user.userID,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profileColor: user.profileColor,
    },
    token,
  };
};

const forgetPassword = async (data) => {
  const { email } = data;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 400);
  }

  const resetToken = generateResetToken(user);

  await sendResetEmail(user.email, resetToken);

  return {
    message: "Password reset instructions sent to your email",
  };
};

const resetPassword = async (data) => {
  const { token, password } = data;

  if (!token) {
    throw new AppError("Reset token is required", 400);
  }

  if (!password) {
    throw new AppError("New password is required", 400);
  }

  let decoded;

  try {
    decoded = verifyToken(token);
  } catch (error) {
    console.error("RESET TOKEN ERROR:", error.message);

    throw new AppError(
      "This password reset link is invalid or has expired.",
      400,
    );
  }

  if (decoded.type !== "PASSWORD_RESET") {
    throw new AppError("Invalid password reset token.", 400);
  }

  const userID = decoded.userID;

  if (!userID) {
    throw new AppError("Invalid password reset token.", 400);
  }

  const user = await userModel.findById(userID);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError(
      "Your account is inactive. Please contact an administrator.",
      403,
    );
  }

  const salt = Number(process.env.SALT);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.password = hashedPassword;

  await user.save();

  return {
    message: "Password reset successfully",
  };
};
const getAuthUser = async (userID) => {
  const user = await userModel.findById(userID);

  console.log("Retrieved user:", user);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError(
      "Your account is inactive. Please contact an administrator.",
      403,
    );
  }

  return {
    userID: user.userID,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    profileColor: user.profileColor,
  };
};

module.exports = {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
  getAuthUser,
};
