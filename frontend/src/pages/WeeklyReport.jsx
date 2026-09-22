import { useState, useCallback, useEffect } from "react";
import { message, Button, Card, Spin } from "antd";
import { FolderOutlined, WarningOutlined } from "@ant-design/icons";

import ReportMetaBar from "../components/ReportMetaBar";
import ActionBar from "../components/ActionBar";
import PreviewModal from "../components/PreviewModal";

import ProjectSection from "../components/sections/ProjectSection";
import TasksCompletedSection from "../components/sections/TaskedCompleted";
import PlannedTasksSection from "../components/sections/PlannedTaskSection";
import BlockersSection from "../components/sections/BlockerSection";
import AchievementsSection from "../components/sections/AchievementSection";
import HoursWorkedSection from "../components/sections/HoursWorkedSection";
import NotesSection from "../components/sections/NotesSection";

import { HOUR_TYPES } from "../helpers/Constants";

import {
  createReportService,
  updateReportService,
} from "../services/ReportService";

import { getUserProjectsService } from "../services/ProjectService";
import { useNavigate } from "react-router-dom";

const getWeekStart = (date = new Date()) => {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);

  return result;
};

const dateToStr = (date) => {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getISOWeekNumber = (dateString) => {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "";

  const tempDate = new Date(date);

  tempDate.setHours(0, 0, 0, 0);

  tempDate.setDate(
    tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7),
  );

  const week1 = new Date(tempDate.getFullYear(), 0, 4);

  return (
    1 +
    Math.round(
      ((tempDate - week1) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    )
  );
};

const createClientId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const createEmptyReport = () => {
  const weekStart = getWeekStart();

  const weekEnd = new Date(weekStart);

  weekEnd.setDate(weekStart.getDate() + 6);

  return {
    id: null,

    weekStart: dateToStr(weekStart),

    weekEnd: dateToStr(weekEnd),

    weekNumber: getISOWeekNumber(dateToStr(weekStart)),

    status: "DRAFT",

    lastSaved: null,

    project: "",

    tasks: [],

    plannedTasks: [],

    blockers: [],

    achievements: [],

    hours: HOUR_TYPES.map((type) => ({
      id: createClientId(),
      type,
      hours: 0,
    })),

    notes: "",

    links: "",
  };
};

const getDisplayStatus = (status) => {
  switch (status) {
    case "DRAFT":
      return "Draft";

    case "SUBMITTED":
      return "Submitted";

    case "NEEDS_CORRECTION":
      return "Needs Correction";

    case "APPROVED":
      return "Approved";

    default:
      return status || "Draft";
  }
};

const WeeklyReport = () => {
  const isEditMode =
    sessionStorage.getItem("editingReport") === "true";

  const editReportData = (() => {
    if (!isEditMode) {
      return null;
    }

    try {
      const data = sessionStorage.getItem("editReportData");

      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to parse edit report data:", error);

      return null;
    }
  })();

  const [report, setReport] = useState(() => {
    if (!isEditMode || !editReportData) {
      return createEmptyReport();
    }

    const existingProject = editReportData.project;

    const projectId =
      typeof existingProject === "object"
        ? existingProject?._id ||
          existingProject?.id ||
          existingProject?.projectID ||
          ""
        : existingProject || "";

    return {
      ...createEmptyReport(),

      id: editReportData._id || editReportData.id || null,

      weekStart: editReportData.weekStart
        ? dateToStr(new Date(editReportData.weekStart))
        : "",

      weekEnd: editReportData.weekEnd
        ? dateToStr(new Date(editReportData.weekEnd))
        : "",

      weekNumber:
        editReportData.weekNumber ||
        getISOWeekNumber(editReportData.weekStart),

      status: editReportData.status || "DRAFT",

      lastSaved: editReportData.lastSaved || null,

      project: projectId,

      tasks: editReportData.tasks || [],

      plannedTasks: editReportData.plannedTasks || [],

      blockers: editReportData.blockers || [],

      achievements: editReportData.achievements || [],

      hours:
        editReportData.hours?.length > 0
          ? editReportData.hours.map((item) => ({
              ...item,
              id: item.id || item._id || createClientId(),
            }))
          : HOUR_TYPES.map((type) => ({
              id: createClientId(),
              type,
              hours: 0,
            })),

      notes: editReportData.notes || "",

      links: editReportData.links || "",
    };
  });

  const navigate = useNavigate();

  const [assignedProject, setAssignedProject] = useState(null);

  const [projectLoading, setProjectLoading] = useState(true);

  const [projectError, setProjectError] = useState(null);

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserProject = async () => {
      try {
        setProjectLoading(true);
        setProjectError(null);

        const response = await getUserProjectsService();

        if (!response?.success) {
          throw new Error(
            response?.message || "Failed to load your project",
          );
        }

        const projects = Array.isArray(response.data)
          ? response.data
          : response.data?.projects ||
            response.projects ||
            [];

        if (projects.length === 0) {
          setAssignedProject(null);
          return;
        }

        if (projects.length > 1) {
          console.warn(
            "User has multiple projects. Only the first project will be used.",
          );
        }

        const userProject = projects[0];

        const projectId =
          userProject?._id ||
          userProject?.id ||
          userProject?.projectID;

        if (!projectId) {
          throw new Error("Project ID is missing.");
        }

        setAssignedProject(userProject);

        setReport((current) => ({
          ...current,
          project: current.project || projectId,
        }));
      } catch (error) {
        console.error("Fetch user project error:", error);

        setAssignedProject(null);

        setProjectError(
          error?.message || "Failed to load your project",
        );
      } finally {
        setProjectLoading(false);
      }
    };

    fetchUserProject();
  }, []);

  const showToast = useCallback((type, content) => {
    message[type](content);
  }, []);

  const createTask = useCallback(() => {
    return {
      id: createClientId(),

      name: "",

      priority: "Medium",

      plannedPct: 0,

      actualPct: 0,

      status: "Not Started",

      plannedTime: 0,

      timeSpent: 0,

      output: "",
    };
  }, []);

  const handleAddTask = useCallback(() => {
    setReport((current) => ({
      ...current,

      tasks: [...(current.tasks || []), createTask()],
    }));
  }, [createTask]);

  const handleEditTask = useCallback((taskId) => {
    console.log("Edit task:", taskId);
  }, []);

  const handleDeleteTask = useCallback((taskId) => {
    setReport((current) => ({
      ...current,

      tasks: (current.tasks || []).filter(
        (task) => task.id !== taskId,
      ),
    }));
  }, []);

  const handleTaskFieldChange = useCallback(
    (taskId, field, value) => {
      setReport((current) => ({
        ...current,

        tasks: (current.tasks || []).map((task) =>
          task.id === taskId
            ? {
                ...task,
                [field]: value,
              }
            : task,
        ),
      }));
    },
    [],
  );

  const handlePlannedTasksChange = useCallback(
    (plannedTasks) => {
      setReport((current) => ({
        ...current,

        plannedTasks,
      }));
    },
    [],
  );

  const handleAddBlocker = useCallback(() => {
    const newBlocker = {
      id: createClientId(),

      description: "",

      severity: "Medium",

      isKeyIssue: false,
    };

    setReport((current) => ({
      ...current,

      blockers: [...(current.blockers || []), newBlocker],
    }));
  }, []);

  const handleDeleteBlocker = useCallback((blockerId) => {
    setReport((current) => ({
      ...current,

      blockers: (current.blockers || []).filter(
        (blocker) => blocker.id !== blockerId,
      ),
    }));
  }, []);

  const handleBlockerFieldChange = useCallback(
    (blockerId, field, value) => {
      setReport((current) => ({
        ...current,

        blockers: (current.blockers || []).map((blocker) =>
          blocker.id === blockerId
            ? {
                ...blocker,
                [field]: value,
              }
            : blocker,
        ),
      }));
    },
    [],
  );

  const handleKeyIssueChange = useCallback((blockerId) => {
    setReport((current) => ({
      ...current,

      blockers: (current.blockers || []).map((blocker) => ({
        ...blocker,

        isKeyIssue: blocker.id === blockerId,
      })),
    }));
  }, []);

  const handleAddAchievement = useCallback(() => {
    const newAchievement = {
      id: createClientId(),

      description: "",

      isKeyAchievement: false,
    };

    setReport((current) => ({
      ...current,

      achievements: [
        ...(current.achievements || []),
        newAchievement,
      ],
    }));
  }, []);

  const handleDeleteAchievement = useCallback(
    (achievementId) => {
      setReport((current) => ({
        ...current,

        achievements: (current.achievements || []).filter(
          (achievement) => achievement.id !== achievementId,
        ),
      }));
    },
    [],
  );

  const handleAchievementFieldChange = useCallback(
    (achievementId, field, value) => {
      setReport((current) => ({
        ...current,

        achievements: (current.achievements || []).map(
          (achievement) =>
            achievement.id === achievementId
              ? {
                  ...achievement,
                  [field]: value,
                }
              : achievement,
        ),
      }));
    },
    [],
  );

  const handleKeyAchievementChange = useCallback(
    (achievementId) => {
      setReport((current) => ({
        ...current,

        achievements: (current.achievements || []).map(
          (achievement) => ({
            ...achievement,

            isKeyAchievement:
              achievement.id === achievementId,
          }),
        ),
      }));
    },
    [],
  );

  const handleHoursChange = useCallback((hours) => {
    setReport((current) => ({
      ...current,

      hours,
    }));
  }, []);

  const handleNotesChange = useCallback((notes) => {
    setReport((current) => ({
      ...current,

      notes,
    }));
  }, []);

  const handleLinksChange = useCallback((links) => {
    setReport((current) => ({
      ...current,

      links,
    }));
  }, []);

  const handleReportMetaChange = useCallback((updates) => {
    setReport((current) => {
      const next =
        typeof updates === "function"
          ? updates(current)
          : updates;

      return {
        ...current,

        ...next,

        project: current.project,
      };
    });
  }, []);

  const buildReportPayload = useCallback(() => {
    return {
      project: report.project,

      name: report.project?.name,

      weekNumber: report.weekNumber,

      weekStart: report.weekStart,

      weekEnd: report.weekEnd,

      tasks: (report.tasks || []).map((task) => ({
        ...task,

        plannedPct: Number(task.plannedPct) || 0,

        actualPct: Number(task.actualPct) || 0,

        plannedTime: Number(task.plannedTime) || 0,

        timeSpent: Number(task.timeSpent) || 0,
      })),

      plannedTasks: report.plannedTasks || [],

      blockers: report.blockers || [],

      achievements: report.achievements || [],

      hours: (report.hours || []).map((item) => ({
        ...item,

        hours: Number(item.hours) || 0,
      })),

      notes: report.notes || "",

      links: report.links || "",
    };
  }, [report]);

  const handleSaveDraft = useCallback(async () => {
    const hasInvalidTask = report.tasks?.some(
      (task) => !task.name?.trim(),
    );

    if (hasInvalidTask) {
      message.error("Task name is required for all tasks.");

      return;
    }

    if (!report.project) {
      showToast(
        "error",
        "You are not assigned to a project.",
      );

      return;
    }

    try {
      setIsSaving(true);

      const payload = buildReportPayload();

      let response;

      if (isEditMode && report.id) {
        response = await updateReportService(
          report.id,
          payload,
        );
      } else {
        response = await createReportService(payload);
      }

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to save report",
        );
      }

      const savedReport =
        response?.data?.report ||
        response?.data ||
        response?.report ||
        response;

      const savedId =
        savedReport?._id ||
        savedReport?.id ||
        report.id;

      setReport((current) => ({
        ...current,

        id: savedId,

        status:
          savedReport?.status ||
          current.status ||
          "DRAFT",

        lastSaved: new Date().toISOString(),
      }));

      sessionStorage.removeItem("editingReport");

      sessionStorage.removeItem("editReportData");

      message.success(
        isEditMode
          ? "Report updated successfully."
          : "Report created successfully and draft saved.",
      );

      navigate("/manager-home/reports");
    } catch (error) {
      console.error("Save report error:", error);

      showToast(
        "error",
        error?.message || "Failed to save report.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    report.id,
    report.project,
    report.tasks,
    buildReportPayload,
    showToast,
    navigate,
    isEditMode,
  ]);

  const handlePreview = useCallback(() => {
    setShowPreviewModal(true);
  }, []);

  if (projectLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Spin size="large" />

          <p className="text-sm text-gray-500">
            Loading your project...
          </p>
        </div>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4">
        <Card
          bordered={false}
          className="w-full max-w-lg rounded-2xl shadow-sm"
        >
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50">
              <WarningOutlined className="text-4xl text-red-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Unable to Load Project
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {projectError}
            </p>

            <Button
              type="primary"
              size="large"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 h-11 rounded-lg px-6"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!assignedProject) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4">
        <Card
          bordered={false}
          className="w-full max-w-lg rounded-2xl shadow-sm"
        >
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50">
              <FolderOutlined className="text-4xl text-orange-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              No Project Assigned
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
              You have not been assigned to a project yet.
              Please contact your manager to get assigned to a
              project before creating a weekly report.
            </p>

            <Button
              type="primary"
              size="large"
              onClick={() =>
                navigate("/manager-home/reports")
              }
              className="mt-6 h-11 rounded-lg px-6"
            >
              Back to Reports
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-6">
      <ProjectSection
        project={assignedProject}
        loading={projectLoading}
      />

      <ReportMetaBar
        report={{
          ...report,
          status: getDisplayStatus(report.status),
        }}
        project={assignedProject}
        onChange={handleReportMetaChange}
      />

      <TasksCompletedSection
        tasks={report.tasks || []}
        onAdd={handleAddTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onFieldChange={handleTaskFieldChange}
      />

      <PlannedTasksSection
        plannedTasks={report.plannedTasks || []}
        onChange={handlePlannedTasksChange}
      />

      <BlockersSection
        blockers={report.blockers || []}
        onAdd={handleAddBlocker}
        onDelete={handleDeleteBlocker}
        onFieldChange={handleBlockerFieldChange}
        onKeyIssueChange={handleKeyIssueChange}
      />

      <AchievementsSection
        achievements={report.achievements || []}
        onAdd={handleAddAchievement}
        onDelete={handleDeleteAchievement}
        onFieldChange={handleAchievementFieldChange}
        onKeyAchievementChange={handleKeyAchievementChange}
      />

      <HoursWorkedSection
        hours={report.hours || []}
        onChange={handleHoursChange}
      />

      <NotesSection
        notes={report.notes || ""}
        links={report.links || ""}
        onNotesChange={handleNotesChange}
        onLinksChange={handleLinksChange}
      />

      <ActionBar
        onSaveDraft={handleSaveDraft}
        onPreview={handlePreview}
        saving={isSaving}
        disabled={projectLoading || !assignedProject}
      />

      <PreviewModal
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        report={report}
        project={assignedProject}
      />
    </div>
  );
};

export default WeeklyReport;