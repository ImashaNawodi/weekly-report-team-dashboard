const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../../models/user.model");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.userID,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
  );
};

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "TEAM_MEMBER",
  });

  await newUser.save();
  const token = generateToken(newUser);

  return {
    newUser: {
      userID: newUser.userID,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
    },
    token,
  };
};

module.exports = {
  registerUser,
};
