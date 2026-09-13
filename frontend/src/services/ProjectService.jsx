const serviceURL = process.env.REACT_APP_API_URL;

export async function createProjectService(projectData) {
  try {
    const response = await fetch(`${serviceURL}/projects/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(projectData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Project creation failed",
      };
    }

    return {
      success: true,
      message: data.message,
      project: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Something went wrong. Please try again later.",
    };
  }
}

export async function getAllProjectsService() {
  try {
    const response = await fetch(`${serviceURL}/projects/get-all-projects`, {
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
        message: data.message || "Failed to retrieve projects",
      };
    }

    return {
      success: true,
      message: data.message,
      projects: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Something went wrong. Please try again later.",
    };
  }
}

export async function updateProjectService(projectID, projectData) {
  try {
    const response = await fetch(`${serviceURL}/projects/update-project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        projectID,
        ...projectData,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Project update failed",
      };
    }

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
export async function updateProjectStatusService(projectID, projectData) {
  try {
    const response = await fetch(
      `${serviceURL}/projects/update-project-status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          projectID,
          ...projectData,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Project status update failed",
      };
    }

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
