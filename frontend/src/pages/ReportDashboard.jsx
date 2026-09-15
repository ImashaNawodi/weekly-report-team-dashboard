import React, { useEffect, useState } from "react";

import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  FileTextOutlined,
  FolderOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  EyeOutlined,
  DownOutlined,
} from "@ant-design/icons";
import ReportDetailDrawer from "../components/ReportDetailDrawer";

import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Select,
  Spin,
  Statistic,
  Table,
  Tag,
  Tooltip,
  notification,
} from "antd";

import {
  getMyReportsService,
  submitReportService,
} from "../services/ReportService";

import ReportModal from "../components/ReportModal";
import ReportRow from "../components/ReportRow";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 8;

export default function ReportDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewReport, setViewReport] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMyReportsService();

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch reports");
      }

      setReports(
        response.data?.reports || response.reports || response.data || [],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  /*  const handleCreateReport = () => {
    setEditingReport(null);
    setReportModalOpen(true);
  }; */

  /* const handleEditReport = (report) => {
    setEditingReport(report);
    setReportModalOpen(true);
  }; */
  const handleCreateReport = () => {
    sessionStorage.removeItem("editingReport");
    sessionStorage.removeItem("editReportData");

    navigate("/manager-home/reportForm");
  };
  const handleViewReport = (report) => {
    setViewReport(report);
    setDrawerOpen(true);
  };

  const handleCloseReportModal = () => {
    setReportModalOpen(false);
    setEditingReport(null);
  };

  const handleReportSuccess = async () => {
    setReportModalOpen(false);
    setEditingReport(null);

    await fetchReports();
  };

  const handleSendReport = async (report) => {
    try {
      const response = await submitReportService(report._id);

      if (!response.success) {
        throw new Error(response.message || "Failed to submit report");
      }

      notification.success({
        message: "Report submitted successfully",
        placement: "bottomRight",
      });

      await fetchReports();
    } catch (error) {
      console.error("SUBMIT REPORT ERROR:", error);

      notification.error({
        message: error.message || "Failed to submit report",
        placement: "bottomRight",
      });
    }
  };

  const stats = {
    total: reports.length,

    draft: reports.filter((report) => report.status === "DRAFT").length,

    submitted: reports.filter((report) => report.status === "SUBMITTED").length,

    approved: reports.filter((report) => report.status === "APPROVED").length,

    correction: reports.filter(
      (report) =>
        report.status === "NEEDS_CORRECTION" ||
        report.status === "CORRECTION_REQUIRED",
    ).length,
  };

  const uniqueProjects = Array.from(
    new Map(
      reports
        .map((report) => {
          const project = report.project;

          if (!project) return null;

          const id = project._id || project.projectID || project;

          const name = project.name || project.projectName || "Unknown Project";

          return [
            id,
            {
              id,
              name,
            },
          ];
        })
        .filter(Boolean),
    ).values(),
  );

  const filteredReports = reports.filter((report) => {
    const query = searchQuery.toLowerCase().trim();

    const projectName =
      report.project?.name || report.project?.projectName || "";

    const reportNumber = report.reportNumber || "";

    const workCompleted = report.workCompleted || "";

    const matchesSearch =
      !query ||
      reportNumber.toLowerCase().includes(query) ||
      projectName.toLowerCase().includes(query) ||
      workCompleted.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    const reportProjectId =
      report.project?._id || report.project?.projectID || report.project;

    const matchesProject =
      projectFilter === "all" || reportProjectId === projectFilter;

    return matchesSearch && matchesStatus && matchesProject;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, projectFilter]);

  const renderStatus = (status) => {
    switch (status) {
      case "DRAFT":
        return (
          <Tag
            icon={<EditOutlined />}
            color="default"
            className="rounded-full px-3 py-1"
          >
            Draft
          </Tag>
        );

      case "SUBMITTED":
        return (
          <Tag
            icon={<ClockCircleOutlined />}
            color="processing"
            className="rounded-full px-3 py-1"
          >
            Submitted
          </Tag>
        );

      case "APPROVED":
        return (
          <Tag
            icon={<CheckCircleOutlined />}
            color="success"
            className="rounded-full px-3 py-1"
          >
            Approved
          </Tag>
        );

      case "NEEDS_CORRECTION":
      case "CORRECTION_REQUIRED":
        return (
          <Tag
            icon={<ExclamationCircleOutlined />}
            color="warning"
            className="rounded-full px-3 py-1"
          >
            Needs Correction
          </Tag>
        );

      default:
        return (
          <Tag className="rounded-full px-3 py-1">{status || "Unknown"}</Tag>
        );
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const columns = [
    {
      title: "REPORT",
      key: "report",
      width: 230,

      render: (_, report) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
            <FileTextOutlined className="text-blue-600" />
          </div>

          <div className="min-w-0">
            <p className="m-0 truncate text-sm font-semibold text-slate-800">
              {report.reportNumber || "Weekly Report"}
            </p>
          </div>
        </div>
      ),
    },

    {
      title: "PROJECT",
      key: "project",
      width: 210,

      render: (_, report) => {
        const projectName =
          report.project?.name ||
          report.project?.projectName ||
          "Unknown Project";

        return (
          <div className="flex items-center gap-2">
            <FolderOutlined className="text-slate-400" />

            <Tooltip title={projectName}>
              <span className="max-w-[160px] truncate text-sm text-slate-600">
                {projectName}
              </span>
            </Tooltip>
          </div>
        );
      },
    },

    {
      title: "WEEK",
      key: "week",
      width: 200,

      render: (_, report) => (
        <div className="min-w-0">
          <p className="m-0 truncate text-sm font-semibold text-slate-800">
            {report.weekNumber ? `Week ${report.weekNumber}` : "-"}
          </p>

          <p className="m-0 mt-1 text-xs text-slate-400">
            {formatDate(report.weekStart)}
            {" — "}
            {formatDate(report.weekEnd)}
          </p>
        </div>
      ),
    },

    {
      title: "STATUS",
      key: "status",
      width: 180,

      render: (_, report) => renderStatus(report.status),
    },

    {
      title: "MANAGER FEEDBACK",
      key: "managerFeedback",
      width: 280,

      render: (_, report) => {
        const canViewFeedback =
          report.status === "APPROVED" ||
          report.status === "NEEDS_CORRECTION" ||
          report.status === "CORRECTION_REQUIRED";

        if (!canViewFeedback) {
          return <span className="text-sm text-slate-400">—</span>;
        }

        const feedback = report.managerFeedback;

        if (!feedback) {
          return <span className="text-sm text-slate-400">No feedback</span>;
        }

        return (
          <Tooltip title={feedback}>
            <div className="max-w-[240px] cursor-pointer">
              <p className="m-0 truncate text-sm text-red-600">{feedback}</p>
            </div>
          </Tooltip>
        );
      },
    },

    {
      title: "CREATED",
      key: "createdAt",
      width: 150,

      render: (_, report) => (
        <span className="text-sm text-slate-500">
          {formatDate(report.createdAt)}
        </span>
      ),
    },

    {
      title: "ACTIONS",
      key: "actions",
      width: 100,
      fixed: "right",

      render: (_, report) => (
        <ReportRow
          report={report}
          onView={handleViewReport}
          onEdit={handleEditReport}
          onSend={handleSendReport}
        />
      ),
    },
  ];

  const statusItems = [
    {
      value: "all",
      label: "All Status",
    },
    {
      value: "DRAFT",
      label: "Draft",
    },
    {
      value: "SUBMITTED",
      label: "Submitted",
    },
    {
      value: "APPROVED",
      label: "Approved",
    },
    {
      value: "NEEDS_CORRECTION",
      label: "Needs Correction",
    },
  ];

  const handleEditReport = (report) => {
    sessionStorage.setItem("editingReport", "true");
    sessionStorage.setItem("editReportData", JSON.stringify(report));

    navigate("/manager-home/reportForm");
  };
  const hasActiveFilters =
    searchQuery !== "" || statusFilter !== "all" || projectFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setProjectFilter("all");
  };

  return (
    <div className="space-y-6">
      <ReportModal
        open={reportModalOpen}
        editingReport={editingReport}
        onClose={handleCloseReportModal}
        onSuccess={handleReportSuccess}
      />
      <ReportDetailDrawer
        report={viewReport}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 p-2">
        <Card className="w-full rounded-xl border-slate-200 shadow-sm">
          <Statistic
            title="Total Reports"
            value={stats.total}
            prefix={<FileTextOutlined className="text-cyan-600" />}
          />
        </Card>

        <Card className="w-full rounded-xl border-slate-200 shadow-sm">
          <Statistic
            title="Draft"
            value={stats.draft}
            prefix={<EditOutlined className="text-slate-500" />}
          />

          <p className="mb-0 mt-2 text-sm text-slate-400">Not submitted</p>
        </Card>

        <Card className="w-full rounded-xl border-slate-200 shadow-sm">
          <Statistic
            title="Submitted"
            value={stats.submitted}
            prefix={<ClockCircleOutlined className="text-blue-600" />}
          />

          <p className="mb-0 mt-2 text-sm text-blue-600">Awaiting review</p>
        </Card>

        <Card className="w-full rounded-xl border-slate-200 shadow-sm">
          <Statistic
            title="Approved"
            value={stats.approved}
            prefix={<CheckCircleOutlined className="text-green-600" />}
          />

          <p className="mb-0 mt-2 text-sm text-green-600">
            Successfully approved
          </p>
        </Card>

        <Card className="w-full rounded-xl border-slate-200 shadow-sm">
          <Statistic
            title="Correction"
            value={stats.correction}
            prefix={<ExclamationCircleOutlined className="text-orange-500" />}
          />

          <p className="mb-0 mt-2 text-sm text-orange-500">Action required</p>
        </Card>
      </div>

      <Card
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined />

            <span>Weekly Reports</span>
          </div>
        }
        className="rounded-xl border-slate-200 shadow-sm"
      >
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <Input
              prefix={<SearchOutlined className="text-slate-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              allowClear
              className="h-10 rounded-lg sm:max-w-xs"
            />

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusItems}
              suffixIcon={<DownOutlined className="text-xs text-slate-400" />}
              prefix={<FilterOutlined className="text-slate-400" />}
              className="h-10 min-w-[170px]"
            />

            <Select
              value={projectFilter}
              onChange={setProjectFilter}
              options={[
                {
                  value: "all",
                  label: "All Projects",
                },

                ...uniqueProjects.map((project) => ({
                  value: project.id,
                  label: project.name,
                })),
              ]}
              suffixIcon={<DownOutlined className="text-xs text-slate-400" />}
              prefix={<FolderOutlined className="text-slate-400" />}
              className="h-10 min-w-[180px]"
              placeholder="Project"
            />
          </div>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateReport}
            className="rounded-lg"
          >
            Create Report
          </Button>

          {hasActiveFilters && (
            <Button type="link" onClick={clearFilters} className="!px-0">
              Clear filters
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-center gap-2.5 text-sm text-red-700">
              <ExclamationCircleOutlined />

              <span>{error}</span>
            </div>

            <Button type="link" danger onClick={fetchReports}>
              Retry
            </Button>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Spin size="large" />

              <span className="text-sm text-slate-500">Loading reports...</span>
            </div>
          </div>
        ) : reports.length === 0 ? (
          /* NO REPORTS */

          <div className="flex min-h-[350px] flex-col items-center justify-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-slate-500">
                  You haven't created any reports yet
                </span>
              }
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateReport}
              className="mt-2 rounded-lg"
            >
              Create Your First Report
            </Button>
          </div>
        ) : filteredReports.length === 0 ? (
          /* NO FILTER RESULTS */

          <div className="flex min-h-[350px] flex-col items-center justify-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-slate-500">No matching reports</span>
              }
            />

            {hasActiveFilters && (
              <Button onClick={clearFilters} className="rounded-lg">
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          /* TABLE */

          <Table
            columns={columns}
            dataSource={filteredReports}
            rowKey="_id"
            pagination={{
              current: currentPage,
              pageSize: PAGE_SIZE,
              total: filteredReports.length,
              showSizeChanger: false,

              showTotal: (total, range) =>
                `Showing ${range[0]}–${range[1]} of ${total}`,

              onChange: (page) => setCurrentPage(page),
            }}
            scroll={{ x: 1100 }}
          />
        )}
      </Card>
    </div>
  );
}
