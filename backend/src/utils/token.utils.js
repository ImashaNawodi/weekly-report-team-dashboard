const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
  );
};

const generateResetToken = (user) => {
  return jwt.sign(
    {
      userID: user._id.toString(),
      type: "PASSWORD_RESET",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  generateResetToken,
  verifyToken,
};
