const authService = require("./auth.service");

const registerController = async (req, res) => {
  try {
    const result = await authService.registerUser(req, res);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

const loginController = async (req, res) => {
  try {
    const result = await authService.loginUser(req, res);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

const forgetPasswordController = async (req, res) => {
  try {
    const result = await authService.forgetPassword(req, res);  
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
module.exports = {
  registerController,
  loginController,
  forgetPasswordController,
};
