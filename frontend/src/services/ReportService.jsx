const serviceURL = process.env.REACT_APP_API_URL;

export async function createReportService(reportData) {
  try {
    const response = await fetch(`${serviceURL}/reports/create-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(reportData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to create report",
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

export async function getMyReportsService(query = "") {
  try {
    const response = await fetch(
      `${serviceURL}/reports/my-reports${query ? `?${query}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to retrieve reports",
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

export async function getAllReportsService(query = "") {
  try {
    const response = await fetch(
      `${serviceURL}/reports/all-reports${query ? `?${query}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to retrieve reports",
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

export async function updateReportService(reportID, reportData) {
  try {
    console.log("Updating report:", reportID);
    console.log("Report data:", reportData);

    const payload = {
      reportID: reportID,
      weekStart: reportData.weekStart,
      weekEnd: reportData.weekEnd,
      workCompleted: reportData.workCompleted,
      plannedWork: reportData.plannedWork,
      blockers: reportData.blockers,
    };

    console.log("Update payload:", payload);

    console.log("JSON BEING SENT:", JSON.stringify(payload));

    const response = await fetch(`${serviceURL}/reports/update-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log("Report API response:", data);

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to update report",
      };
    }

    return {
      success: true,
      message: data.message || "Report updated successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Update report error:", error);

    return {
      success: false,
      message: error.message || "Failed to update report",
    };
  }
}

export async function submitReportService(reportID) {
  try {
    const response = await fetch(`${serviceURL}/reports/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        reportID,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to submit report",
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

export async function approveReportService(reportID) {
  try {
    const response = await fetch(`${serviceURL}/reports/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        reportID,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to approve report",
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

export async function requestCorrectionService(reportID, managerFeedback) {
  try {
    const response = await fetch(`${serviceURL}/reports/request-correction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        reportID,
        managerFeedback,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to request correction",
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
