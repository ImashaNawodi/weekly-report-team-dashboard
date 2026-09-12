const { setAuthCookie, clearAuthCookie } = require("../../utils/cookie.utils");
const authService = require("./auth.service");

const registerController = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    setAuthCookie(res, result.token);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

const loginController = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    setAuthCookie(res, result.token);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
       data: {
        user: result.user,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

const forgetPasswordController = async (req, res) => {
  try {
    const result = await authService.forgetPassword(req.body);
    res.status(200).json({
      success: true,
      message: "Password reset instructions sent to your email",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

const logoutController = (req, res) => {
  clearAuthCookie(res);

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};
module.exports = {
  registerController,
  loginController,
  forgetPasswordController,
  logoutController,
};
