import { useState, useCallback, useEffect } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
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

const getWeekStart = (date = new Date()) => {
  const currentDate = new Date(date);
  const day = currentDate.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  currentDate.setDate(currentDate.getDate() + diff);
  currentDate.setHours(0, 0, 0, 0);

  return currentDate;
};

const dateToStr = (date) => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getISOWeekNumber = (date) => {
  const target = new Date(date.valueOf());

  const dayNr = (date.getDay() + 6) % 7;

  target.setDate(target.getDate() - dayNr + 3);

  const firstThursday = target.valueOf();

  target.setMonth(0, 1);

  if (target.getDay() !== 4) {
    target.setMonth(
      0,
      1 + ((4 - target.getDay() + 7) % 7)
    );
  }

  return 1 + Math.ceil((firstThursday - target) / 604800000);
};

const createClientId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const createEmptyReport = () => {
  const weekStart = getWeekStart();

  return {
    weekStart: dateToStr(weekStart),
    weekNumber: getISOWeekNumber(weekStart),
    project: "",
    tasksCompleted: [],
    plannedTasks: [],
    blockers: [],
    achievements: [],
    hours: HOUR_TYPES.map((type) => ({
      id: createClientId(),
      type,
      hours: 0,
    })),
    notes: "",
    links: [],
    status: "Draft",
  };
};

const getDisplayStatus = (status) => {
  if (!status) {
    return "Draft";
  }

  const normalizedStatus = String(status).toLowerCase();

  switch (normalizedStatus) {
    case "draft":
      return "Draft";
    case "submitted":
      return "Submitted";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "correction_requested":
    case "correction requested":
      return "Correction Requested";
    default:
      return status;
  }
};

export default function WeeklyReport() {
  const navigate = useNavigate();

  const editingReport =
    sessionStorage.getItem("editingReport") === "true";

  const storedEditReport = sessionStorage.getItem("editReportData");

  let editReportData = null;

  if (storedEditReport) {
    try {
      editReportData = JSON.parse(storedEditReport);
    } catch (error) {
      console.error("Failed to parse edit report data:", error);
    }
  }

  const getInitialReport = () => {
    if (editingReport && editReportData) {
      const emptyReport = createEmptyReport();

      return {
        ...emptyReport,
        ...editReportData,
        tasksCompleted: Array.isArray(editReportData.tasksCompleted)
          ? editReportData.tasksCompleted
          : [],
        plannedTasks: Array.isArray(editReportData.plannedTasks)
          ? editReportData.plannedTasks
          : [],
        blockers: Array.isArray(editReportData.blockers)
          ? editReportData.blockers
          : [],
        achievements: Array.isArray(editReportData.achievements)
          ? editReportData.achievements
          : [],
        hours: Array.isArray(editReportData.hours)
          ? editReportData.hours
          : emptyReport.hours,
        links: Array.isArray(editReportData.links)
          ? editReportData.links
          : [],
        notes: editReportData.notes || "",
      };
    }

    return createEmptyReport();
  };

  const [report, setReport] = useState(getInitialReport);
  const [assignedProject, setAssignedProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getUserProject = useCallback(async () => {
    try {
      setProjectLoading(true);

      const response = await getUserProjectsService();

      const projects = Array.isArray(response)
        ? response
        : response?.projects || response?.data || [];

      if (projects.length > 0) {
        const project = projects[0];

        setAssignedProject(project);

        setReport((current) => ({
          ...current,
          project:
            current.project ||
            project._id ||
            project.id ||
            project.projectID ||
            project.name ||
            "",
        }));
      }
    } catch (error) {
      console.error("Failed to load assigned project:", error);
      message.error("Failed to load assigned project");
    } finally {
      setProjectLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserProject();
  }, [getUserProject]);

  const handleProjectChange = useCallback((value) => {
    setReport((current) => ({
      ...current,
      project: value,
    }));
  }, []);

  const handleTasksCompletedChange = useCallback((tasks) => {
    setReport((current) => ({
      ...current,
      tasksCompleted: Array.isArray(tasks) ? tasks : [],
    }));
  }, []);

  const handlePlannedTasksChange = useCallback((tasks) => {
    setReport((current) => ({
      ...current,
      plannedTasks: Array.isArray(tasks) ? tasks : [],
    }));
  }, []);

  const handleBlockersChange = useCallback((blockers) => {
    setReport((current) => ({
      ...current,
      blockers: Array.isArray(blockers) ? blockers : [],
    }));
  }, []);

  const handleAchievementsChange = useCallback((achievements) => {
    setReport((current) => ({
      ...current,
      achievements: Array.isArray(achievements)
        ? achievements
        : [],
    }));
  }, []);

  const handleHoursChange = useCallback((type, value) => {
    setReport((current) => {
      const currentHours = Array.isArray(current.hours)
        ? current.hours
        : [];

      const existingEntry = currentHours.find(
        (item) => item?.type === type
      );

      if (existingEntry) {
        return {
          ...current,
          hours: currentHours.map((item) =>
            item?.type === type
              ? {
                  ...item,
                  hours: Number(value) || 0,
                }
              : item
          ),
        };
      }

      return {
        ...current,
        hours: [
          ...currentHours,
          {
            id: createClientId(),
            type,
            hours: Number(value) || 0,
          },
        ],
      };
    });
  }, []);

  const handleNotesChange = useCallback((notes) => {
    setReport((current) => ({
      ...current,
      notes: notes || "",
    }));
  }, []);

  const handleLinksChange = useCallback((links) => {
    setReport((current) => ({
      ...current,
      links: Array.isArray(links) ? links : [],
    }));
  }, []);

  const handleMetaChange = useCallback((updates) => {
    setReport((current) => ({
      ...current,
      ...updates,
    }));
  }, []);

  const buildReportPayload = useCallback(() => {
    return {
      ...report,
      project: report.project || "",
      weekStart: report.weekStart,
      weekNumber: report.weekNumber,
      tasksCompleted: Array.isArray(report.tasksCompleted)
        ? report.tasksCompleted
        : [],
      plannedTasks: Array.isArray(report.plannedTasks)
        ? report.plannedTasks
        : [],
      blockers: Array.isArray(report.blockers)
        ? report.blockers
        : [],
      achievements: Array.isArray(report.achievements)
        ? report.achievements
        : [],
      hours: Array.isArray(report.hours)
        ? report.hours.map((item) => ({
            ...item,
            hours: Number(item?.hours) || 0,
          }))
        : [],
      notes: report.notes || "",
      links: Array.isArray(report.links)
        ? report.links
        : [],
      status: report.status || "Draft",
    };
  }, [report]);

  const validateReport = () => {
    if (!report.project) {
      message.error("Please select a project");
      return false;
    }

    if (
      Array.isArray(report.tasksCompleted) &&
      report.tasksCompleted.some(
        (task) =>
          typeof task === "string" && !task.trim()
      )
    ) {
      message.error(
        "Please enter a task name or remove the empty task."
      );

      return false;
    }

    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateReport()) {
      return;
    }

    try {
      setIsSaving(true);

      const payload = buildReportPayload();

      let response;

      if (editingReport && editReportData?._id) {
        response = await updateReportService(
          editReportData._id,
          payload
        );
      } else if (editingReport && editReportData?.id) {
        response = await updateReportService(
          editReportData.id,
          payload
        );
      } else {
        response = await createReportService(payload);
      }

      const savedReport =
        response?.report ||
        response?.data ||
        response;

      setReport((current) => ({
        ...current,
        ...(savedReport || {}),
        hours: Array.isArray(savedReport?.hours)
          ? savedReport.hours
          : current.hours,
      }));

      message.success(
        editingReport
          ? "Report updated successfully"
          : "Report saved as draft successfully"
      );

      sessionStorage.removeItem("editingReport");
      sessionStorage.removeItem("editReportData");

      navigate("/manager-home/reports");
    } catch (error) {
      console.error("Save report error:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save report";

      message.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  const handleCancel = () => {
    sessionStorage.removeItem("editingReport");
    sessionStorage.removeItem("editReportData");

    navigate("/manager-home/reports");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ReportMetaBar
        report={report}
        onChange={handleMetaChange}
        status={getDisplayStatus(report.status)}
        editing={editingReport}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <ProjectSection
            project={report.project}
            assignedProject={assignedProject}
            loading={projectLoading}
            onChange={handleProjectChange}
          />

          <TasksCompletedSection
            tasks={report.tasksCompleted}
            onChange={handleTasksCompletedChange}
          />

          <PlannedTasksSection
            tasks={report.plannedTasks}
            onChange={handlePlannedTasksChange}
          />

          <BlockersSection
            blockers={report.blockers}
            onChange={handleBlockersChange}
          />

          <AchievementsSection
            achievements={report.achievements}
            onChange={handleAchievementsChange}
          />

          <HoursWorkedSection
            hours={
              Array.isArray(report.hours)
                ? report.hours
                : []
            }
            hourTypes={HOUR_TYPES}
            onChange={handleHoursChange}
          />

          <NotesSection
            notes={report.notes}
            onChange={handleNotesChange}
          />
        </div>
      </main>

      <ActionBar
        onSave={handleSaveDraft}
        onPreview={handlePreview}
        onCancel={handleCancel}
        loading={isSaving}
        isEditing={editingReport}
      />

      <PreviewModal
        open={showPreviewModal}
        report={report}
        onClose={() => setShowPreviewModal(false)}
      />
    </div>
  );
}

