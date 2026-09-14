const serviceURL = process.env.REACT_APP_API_URL;

export async function getUserProfileService() {
  try {
    const response = await fetch(`${serviceURL}/user/profile`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to retrieve user profile",
      };
    }

    return {
      success: true,
      message: data.message,
      user: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Something went wrong. Please try again later.",
    };
  }
}

export async function updateUserProfileService(profileData) {
  try {
    const response = await fetch(`${serviceURL}/users/update-profile`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "User profile update failed",
      };
    }

    return {
      success: true,
      message: data.message,
      user: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Something went wrong. Please try again later.",
    };
  }
}

export async function updateUserRoleService(userAccountID, role) {
  try {
    const response = await fetch(`${serviceURL}/users/update-role`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        userAccountID,
        role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "User role update failed",
      };
    }

    return {
      success: true,
      message: data.message,
      user: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Something went wrong. Please try again later.",
    };
  }
}

export async function updateUserStatusService(userAccountID, isActive) {
  try {
    const response = await fetch(`${serviceURL}/users/update-status`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        userAccountID,
        isActive,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "User status update failed",
      };
    }

    return {
      success: true,
      message: data.message,
      user: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Something went wrong. Please try again later.",
    };
  }
}

export async function getAllUsersService(queryParams = {}) {
  try {
    const queryString = new URLSearchParams(queryParams).toString();

    const response = await fetch(
      `${serviceURL}/users/all-users${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",
      },
    );

    const data = await response.json();
    console.log("getAllUsersService response:", data);

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to retrieve users",
      };
    }
    console.log("getAllUsersService returning data:", data.data);
    return {
      success: true,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Something went wrong. Please try again later.",
    };
  }
}
