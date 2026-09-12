const bcrypt = require("bcrypt");
const userModel = require("../../models/user.model");
const { sendResetEmail } = require("../../utils/mailer.utils");
const { generateToken } = require("../../utils/token.utils");
const AppError = require("../../utils/appError.utils");

const registerUser = async (data) => {
  const { firstName, lastName, email, password } = data;

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "TEAM_MEMBER",
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
    throw new AppError("Your account is inactive. Please contact an administrator.", 403);
  }
  const token = generateToken(user);

  return {
    user: {
      userID: user.userID,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
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

  const resetToken = generateToken(user);
  await sendResetEmail(user.email, resetToken);
};

module.exports = {
  registerUser,
  loginUser,
  forgetPassword,
};
