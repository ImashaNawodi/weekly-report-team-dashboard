import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Modal,
  Form,
  Input,
  Button,
  Typography,
  Alert,
  message,
  Select,
} from "antd";
import dayjs from "dayjs";

import {
  createReportService,
  updateReportService,
} from "../services/ReportService";

import { getUserProjectsService } from "../services/ProjectService";

const { Text } = Typography;
const { TextArea } = Input;

const generateWeeks = (projectStartDate) => {
  const startDate = dayjs(projectStartDate).startOf("day");

  if (!startDate.isValid()) {
    return [];
  }

  return Array.from({ length: 10 }, (_, index) => {
    const weekStart = startDate.add(index * 7, "day");
    const weekEnd = weekStart.add(6, "day");

    return {
      weekNumber: index + 1,
      weekStart,
      weekEnd,
      label: `${weekStart.format("DD MMM YYYY")} - ${weekEnd.format(
        "DD MMM YYYY",
      )}`,
    };
  });
};

export default function ReportModal({
  open,
  onClose,
  onSuccess,
  editingReport,
}) {
  const [form] = Form.useForm();

  const [project, setProject] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [loadingProject, setLoadingProject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = Boolean(editingReport);

  const fetchProject = async () => {
    try {
      setLoadingProject(true);
      setError(null);

      const response = await getUserProjectsService();

      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to load project");
      }

      let projectList = [];

      if (Array.isArray(response.data)) {
        projectList = response.data;
      } else if (Array.isArray(response.data?.projects)) {
        projectList = response.data.projects;
      } else if (Array.isArray(response.projects)) {
        projectList = response.projects;
      }

      if (projectList.length === 0) {
        throw new Error("You are not assigned to any project");
      }

      const currentProject = projectList[0];

      const projectStartDate =
        currentProject.createdAt ||
        currentProject.startDate ||
        currentProject.projectStartDate;

      if (!projectStartDate) {
        throw new Error("Project start date is missing");
      }

      const generatedWeeks = generateWeeks(projectStartDate);

      if (generatedWeeks.length === 0) {
        throw new Error("Unable to generate reporting weeks");
      }

      setProject(currentProject);
      setWeeks(generatedWeeks);

      return generatedWeeks;
    } catch (err) {
      console.error("Fetch project error:", err);

      setProject(null);
      setWeeks([]);

      setError(err instanceof Error ? err.message : "Failed to load project");

      return [];
    } finally {
      setLoadingProject(false);
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const initializeModal = async () => {
      setError(null);

      const generatedWeeks = await fetchProject();

      if (editingReport) {
        const reportWeekStart = editingReport.weekStart
          ? dayjs(editingReport.weekStart)
          : null;

        const matchingWeek = generatedWeeks.find(
          (week) =>
            reportWeekStart && reportWeekStart.isSame(week.weekStart, "day"),
        );

        form.setFieldsValue({
          week: matchingWeek ? matchingWeek.weekNumber : undefined,

          workCompleted: editingReport.workCompleted || "",

          plannedWork: editingReport.plannedWork || "",

          blockers: editingReport.blockers || "",
        });
      } else {
        form.resetFields();

        form.setFieldsValue({
          week: undefined,
          workCompleted: "",
          plannedWork: "",
          blockers: "",
        });
      }
    };

    initializeModal();
  }, [open, editingReport, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const selectedWeek = weeks.find(
        (week) => week.weekNumber === values.week,
      );

      if (!selectedWeek) {
        throw new Error("Please select a valid reporting week");
      }

      const reportData = {
        weekStart: selectedWeek.weekStart.startOf("day").toISOString(),
        weekNumber: selectedWeek.weekNumber,

        weekEnd: selectedWeek.weekEnd.endOf("day").toISOString(),

        workCompleted: values.workCompleted?.trim() || "",

        plannedWork: values.plannedWork?.trim() || "",

        blockers: values.blockers?.trim() || "",
      };

      let response;

      if (editingReport) {
        const reportID = editingReport._id || editingReport.id;

        if (!reportID) {
          throw new Error("Report ID is missing");
        }

        response = await updateReportService(reportID, reportData);
      } else {
        if (!project) {
          throw new Error("Project information is not available");
        }

        const projectID = project._id || project.id || project.projectID;

        if (!projectID) {
          throw new Error("Project ID is missing");
        }
        console.log(selectedWeek);

        const createData = {
          project: projectID,
          weekNumber: reportData.weekNumber,
          weekStart: reportData.weekStart,
          weekEnd: reportData.weekEnd,
          workCompleted: reportData.workCompleted,
          plannedWork: reportData.plannedWork,
          blockers: reportData.blockers,
        };

        response = await createReportService(createData);
      }

      if (!response || !response.success) {
        message.error(
          response?.message ||
            (editingReport
              ? "Failed to update report"
              : "Failed to create report"),
        );

        return;
      }

      message.success(
        editingReport
          ? "Report updated successfully"
          : "Report created successfully",
      );

      const savedReport =
        response.data?.report ||
        response.data?.data ||
        response.data ||
        response.report;

      onSuccess?.(savedReport);

      form.resetFields();
      setError(null);
      onClose();
    } catch (err) {
      console.error("Report create/update error:", err);

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        (editingReport
          ? "Something went wrong while updating the report"
          : "Something went wrong while creating the report");

      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    form.resetFields();
    setError(null);
    setProject(null);
    setWeeks([]);

    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      centered
      width={700}
      footer={null}
      closable={false}
      maskClosable={!loading}
      keyboard={!loading}
      styles={{
        content: {
          padding: 0,
          borderRadius: 16,
          overflow: "hidden",
        },

        mask: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
        },
      }}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <Typography.Title
            level={5}
            className="!m-0 !font-bold !text-slate-900"
          >
            {isEditing ? "Edit Weekly Report" : "Create Weekly Report"}
          </Typography.Title>

          <Text type="secondary" className="!text-sm">
            {isEditing
              ? "Update your weekly report details"
              : "Submit your work completed for this week"}
          </Text>
        </div>

        <Button
          type="text"
          onClick={handleClose}
          disabled={loading}
          icon={<X size={20} />}
          className="flex !h-9 !w-9 !min-w-9 items-center justify-center !rounded-lg !text-slate-400"
        />
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="max-h-[calc(90vh-82px)] overflow-y-auto px-6 py-5"
      >
        {error && (
          <Alert type="error" showIcon message={error} className="mb-5" />
        )}

        <Form.Item label="Project">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            {loadingProject ? (
              <Text type="secondary">Loading project...</Text>
            ) : project ? (
              <div>
                <Text className="!font-semibold !text-slate-800">
                  {project.name || project.projectName || "Assigned Project"}
                </Text>

                {project.description && (
                  <Text type="secondary" className="!mt-1 !block !text-xs">
                    {project.description}
                  </Text>
                )}

                {project.createdAt && (
                  <Text type="secondary" className="!mt-2 !block !text-xs">
                    Project started:{" "}
                    {dayjs(
                      project.createdAt ||
                        project.startDate ||
                        project.projectStartDate,
                    ).format("DD MMM YYYY")}
                  </Text>
                )}
              </div>
            ) : (
              <Text type="secondary">No project assigned</Text>
            )}
          </div>
        </Form.Item>

        <Form.Item
          label="Reporting Week"
          name="week"
          rules={[
            {
              required: true,
              message: "Please select a reporting week",
            },
          ]}
        >
          <Select
            size="large"
            placeholder="Select reporting week"
            loading={loadingProject}
            disabled={loadingProject || weeks.length === 0}
          >
            {weeks.map((week) => (
              <Select.Option key={week.weekNumber} value={week.weekNumber}>
                Week {week.weekNumber} — {week.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Work Completed"
          name="workCompleted"
          rules={[
            {
              required: true,
              message: "Please enter the work you completed",
            },
          ]}
        >
          <TextArea
            rows={5}
            placeholder="Describe the work you completed this week..."
            maxLength={2000}
            showCount
            className="resize-none"
          />
        </Form.Item>

        <Form.Item
          label="Planned Work"
          name="plannedWork"
          rules={[
            {
              required: true,
              message: "Please enter your planned work",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Describe what you plan to work on next..."
            maxLength={2000}
            showCount
            className="resize-none"
          />
        </Form.Item>

        <Form.Item label="Blockers" name="blockers">
          <TextArea
            rows={3}
            placeholder="Mention any blockers or challenges... (Optional)"
            maxLength={1000}
            showCount
            className="resize-none"
          />
        </Form.Item>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Button
            onClick={handleClose}
            size="large"
            disabled={loading}
            className="!rounded-lg !font-medium"
          >
            Cancel
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={
              loadingProject || (!project && !isEditing) || weeks.length === 0
            }
            size="large"
            className="!rounded-lg !font-semibold"
          >
            {isEditing ? "Save Changes" : "Create Report"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
