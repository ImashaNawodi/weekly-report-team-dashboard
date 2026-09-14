const serviceURL = process.env.REACT_APP_API_URL;

export async function userSignUpService(userData) {
  try {
    const response = await fetch(`${serviceURL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Signup failed",
      };
    }

    return {
      success: true,
      message: data.message,
      user: data.data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Something went wrong. Please try again later.",
    };
  }
}

export async function userSignInService(userData) {
  try {
    const response = await fetch(`${serviceURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Signup failed",
      };
    }

    return {
      success: true,
      message: data.message,
      user: data.data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Something went wrong. Please try again later.",
    };
  }
}

export async function authMeService() {
  const response = await fetch(`${serviceURL}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}

export async function logoutService() {
  const response = await fetch(`${serviceURL}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}

export async function forgotPasswordService(data) {
  try {
    const response = await fetch(`${serviceURL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Password reset failed",
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function resetPasswordService(data) {
  try {
    const response = await fetch(`${serviceURL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Password reset failed",
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

