import React, { useEffect, useState } from "react";
import {
  ArrowLeftOutlined,
  FolderOutlined,
  CalendarOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  notification,
  Spin,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";

import { getUserProjectsService } from "../services/ProjectService";
import { createReportService } from "../services/ReportService";

const { Text } = Typography;
const { TextArea } = Input;

export default function CreateReport() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      setLoadingProject(true);
      setError(null);

      const response = await getUserProjectsService();

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch project");
      }

      const projectList = response.data || [];

      if (projectList.length === 0) {
        throw new Error("You are not assigned to any project");
      }

      // One user = one project
      setProject(projectList[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setLoadingProject(false);
    }
  };

  const handleSubmit = async (values) => {
  try {
    setSubmitting(true);
    setError(null);

    if (!project?.projectID) {
      throw new Error("Project not found");
    }

    const payload = {
      project: project.projectID,

      weekStart: values.weekStart.startOf("day").toISOString(),

      weekEnd: values.weekEnd.endOf("day").toISOString(),

      workCompleted: values.workCompleted,
      plannedWork: values.plannedWork,
      blockers: values.blockers || "",
    };

    const response = await createReportService(payload);

    if (!response.success) {
      throw new Error(response.message || "Failed to create report");
    }

    notification.success({
      message: response.message || "Report created successfully",
      placement: "bottomRight",
    });

    form.resetFields();

    navigate("/manager-home/reports");
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to create report";

    setError(errorMessage);

    notification.error({
      message: errorMessage,
      placement: "bottomRight",
    });
  } finally {
    setSubmitting(false);
  }
};
  const disabledEndDate = (current) => {
    const weekStart = form.getFieldValue("weekStart");

    if (!weekStart) {
      return false;
    }

    return current && current < weekStart.startOf("day");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/manager-home/reports")}
              className="mb-3 flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
            >
              <ArrowLeftOutlined />
              Back to Reports
            </button>

            <h1 className="text-3xl font-bold text-gray-900">
              Create Weekly Report
            </h1>

            <p className="mt-2 text-gray-500">
              Submit your work summary for this week.
            </p>
          </div>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        <Card
          bordered={false}
          className="mb-6 overflow-hidden rounded-2xl shadow-sm"
          bodyStyle={{ padding: 0 }}
        >
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <FolderOutlined className="text-xl text-blue-600" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">Project</h2>
                <p className="text-sm text-gray-500">Your assigned project</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            {loadingProject ? (
              <div className="flex items-center gap-3 py-3">
                <Spin size="small" />
                <span className="text-gray-500">Loading project...</span>
              </div>
            ) : project ? (
              <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                  <FolderOutlined className="text-xl text-blue-600" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Assigned Project
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {project.name}
                  </p>

                  {project.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="ml-auto">
                  <CheckCircleOutlined className="text-xl text-green-500" />
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                No project assigned.
              </div>
            )}
          </div>
        </Card>

        <Card
          bordered={false}
          className="rounded-2xl shadow-sm"
          bodyStyle={{ padding: 0 }}
        >
          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Weekly Report Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Provide details about your work for the selected week.
            </p>
          </div>

          <div className="p-6">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Form.Item
                  name="weekStart"
                  label={
                    <span className="font-medium text-gray-700">
                      Week Start
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please select the week start date",
                    },
                  ]}
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    format="YYYY-MM-DD"
                    placeholder="Select start date"
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  name="weekEnd"
                  label={
                    <span className="font-medium text-gray-700">Week End</span>
                  }
                  dependencies={["weekStart"]}
                  rules={[
                    {
                      required: true,
                      message: "Please select the week end date",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const start = getFieldValue("weekStart");

                        if (!value || !start) {
                          return Promise.resolve();
                        }

                        if (value.isBefore(start, "day")) {
                          return Promise.reject(
                            new Error("Week end cannot be before week start"),
                          );
                        }

                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    format="YYYY-MM-DD"
                    placeholder="Select end date"
                    disabledDate={disabledEndDate}
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="workCompleted"
                label={
                  <div className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-green-500" />

                    <span className="font-medium text-gray-700">
                      Work Completed
                    </span>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter the work you completed",
                  },
                  {
                    min: 10,
                    message: "Please provide more details about your work",
                  },
                ]}
              >
                <TextArea
                  rows={6}
                  placeholder="Describe the work you completed this week..."
                  showCount
                  maxLength={2000}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="plannedWork"
                label={
                  <div className="flex items-center gap-2">
                    <ClockCircleOutlined className="text-blue-500" />

                    <span className="font-medium text-gray-700">
                      Planned Work
                    </span>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter your planned work",
                  },
                  {
                    min: 10,
                    message:
                      "Please provide more details about your planned work",
                  },
                ]}
              >
                <TextArea
                  rows={5}
                  placeholder="Describe what you plan to work on next week..."
                  showCount
                  maxLength={2000}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="blockers"
                label={
                  <div className="flex items-center gap-2">
                    <WarningOutlined className="text-orange-500" />

                    <span className="font-medium text-gray-700">Blockers</span>

                    <span className="text-xs font-normal text-gray-400">
                      (Optional)
                    </span>
                  </div>
                }
              >
                <TextArea
                  rows={4}
                  placeholder="Mention any blockers, issues, or dependencies..."
                  showCount
                  maxLength={1500}
                  className="rounded-lg"
                />
              </Form.Item>

              <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <ClockCircleOutlined className="text-blue-500" />
                  </div>

                  <div>
                    <p className="font-medium text-blue-900">
                      Before submitting
                    </p>

                    <p className="mt-1 text-sm leading-6 text-blue-700">
                      Make sure your work completed, planned work, and blockers
                      are accurate. Your manager will review the report after
                      submission.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                <Button
                  size="large"
                  onClick={() => navigate("/reports")}
                  disabled={submitting}
                  className="h-11 rounded-lg px-6"
                >
                  Cancel
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={submitting}
                  disabled={loadingProject || !project}
                  icon={<SaveOutlined />}
                  className="h-11 rounded-lg px-6"
                >
                  {submitting ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}
