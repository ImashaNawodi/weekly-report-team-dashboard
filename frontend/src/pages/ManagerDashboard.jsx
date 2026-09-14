import React, { useEffect, useMemo, useState } from "react";

import {
  SearchOutlined,
  FilterOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Input,
  Row,
  Select,
  Spin,
  Statistic,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
} from "recharts";

import dayjs from "dayjs";

import ReportDetailDrawer from "../components/ReportDetailDrawer";
import ReportModal from "../components/ReportModal";
import ManagerRow from "../components/ManagerRow";

import {
  getAllReportsService,
  approveReportService,
  requestCorrectionService,
} from "../services/ReportService";

const { RangePicker } = DatePicker;

const PAGE_SIZE = 8;

const ManagerDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [teamMemberFilter, setTeamMemberFilter] = useState("all");
  const [weekFilter, setWeekFilter] = useState("all");
  const [dateRange, setDateRange] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [viewReport, setViewReport] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllReportsService();

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch reports",
        );
      }

      const allReports = response.data?.reports || [];

      setReports(allReports);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch reports",
      );
    } finally {
      setLoading(false);
    }
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

  const handleViewReport = (report) => {
    setViewReport(report);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setViewReport(null);
  };

  const handleApproveReport = async (report) => {
    try {
      const response = await approveReportService(report._id);

      if (!response.success) {
        throw new Error(
          response.message || "Failed to approve report",
        );
      }

      message.success(
        response.message || "Report approved successfully",
      );

      await fetchReports();
    } catch (error) {
      message.error(
        error?.message || "Failed to approve report",
      );

      throw error;
    }
  };

  const handleRequestCorrection = async (
    report,
    managerFeedback,
  ) => {
    try {
      const response = await requestCorrectionService(
        report._id,
        managerFeedback,
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to request correction",
        );
      }

      message.success(
        response.message ||
          "Report sent back for correction",
      );

      await fetchReports();
    } catch (error) {
      message.error(
        error?.message ||
          "Failed to request correction",
      );

      throw error;
    }
  };

  const getReportMember = (report) => {
    return (
      report.user ||
      report.member ||
      report.createdBy ||
      report.employee ||
      report.teamMember ||
      report.submittedBy ||
      null
    );
  };

  const getMemberId = (report) => {
    const member = getReportMember(report);

    if (!member) {
      return null;
    }

    if (typeof member === "string") {
      return member;
    }

    return (
      member._id ||
      member.userID ||
      member.userId ||
      member.memberID ||
      member.memberId ||
      member.accountID ||
      member.accountId ||
      null
    );
  };

  const getMemberName = (report) => {
    const member = getReportMember(report);

    if (!member) {
      return "Unknown Member";
    }

    if (typeof member === "string") {
      return member;
    }

    if (member.name) {
      return member.name;
    }

    if (member.fullName) {
      return member.fullName;
    }

    if (member.firstName || member.lastName) {
      return `${member.firstName || ""} ${
        member.lastName || ""
      }`.trim();
    }

    if (member.username) {
      return member.username;
    }

    if (member.email) {
      return member.email;
    }

    return "Unknown Member";
  };

  const getProjectId = (report) => {
    const project = report.project;

    if (!project) {
      return null;
    }

    return (
      project._id ||
      project.projectID ||
      project.projectId ||
      project.id ||
      project
    );
  };

  const getProjectName = (report) => {
    return (
      report.project?.name ||
      report.project?.projectName ||
      "Unknown Project"
    );
  };

  const uniqueProjects = useMemo(() => {
    return Array.from(
      new Map(
        reports
          .map((report) => {
            const project = report.project;

            if (!project) {
              return null;
            }

            const id = getProjectId(report);

            const name = getProjectName(report);

            return [
              String(id),
              {
                id: String(id),
                name,
              },
            ];
          })
          .filter(Boolean),
      ).values(),
    );
  }, [reports]);

  const uniqueTeamMembers = useMemo(() => {
    return Array.from(
      new Map(
        reports
          .map((report) => {
            const memberId = getMemberId(report);

            if (!memberId) {
              return null;
            }

            return [
              String(memberId),
              {
                id: String(memberId),
                name: getMemberName(report),
              },
            ];
          })
          .filter(Boolean),
      ).values(),
    );
  }, [reports]);

  const availableWeeks = useMemo(() => {
    return Array.from(
      new Map(
        reports
          .filter((report) => report.status !== "DRAFT")
          .filter(
            (report) =>
              report.weekNumber !== undefined &&
              report.weekNumber !== null,
          )
          .map((report) => [
            Number(report.weekNumber),
            {
              weekNumber: Number(report.weekNumber),
              weekStart: report.weekStart,
              weekEnd: report.weekEnd,
            },
          ]),
      ).values(),
    ).sort((a, b) => a.weekNumber - b.weekNumber);
  }, [reports]);

  const weekOptions = [
    {
      value: "all",
      label: "All Weeks",
    },
    ...availableWeeks.map((week) => ({
      value: week.weekNumber,
      label: `Week ${week.weekNumber}`,
    })),
  ];

  const selectedWeek = availableWeeks.find(
    (week) =>
      Number(week.weekNumber) === Number(weekFilter),
  );

  const weekScopedReports = useMemo(() => {
    return reports.filter((report) => {
      if (report.status === "DRAFT") {
        return false;
      }

      return (
        weekFilter === "all" ||
        Number(report.weekNumber) === Number(weekFilter)
      );
    });
  }, [reports, weekFilter]);

  const stats = {
    total: weekScopedReports.length,

    submitted: weekScopedReports.filter(
      (report) => report.status === "SUBMITTED",
    ).length,

    approved: weekScopedReports.filter(
      (report) => report.status === "APPROVED",
    ).length,

    correction: weekScopedReports.filter(
      (report) =>
        report.status === "NEEDS_CORRECTION" ||
        report.status === "CORRECTION_REQUIRED",
    ).length,
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (report.status === "DRAFT") {
        return false;
      }

      const query = searchQuery.toLowerCase().trim();

      const projectName = getProjectName(report);

      const reportNumber = String(
        report.reportNumber || "",
      );

      const workCompleted = String(
        report.workCompleted || "",
      );

      const memberName = getMemberName(report);

      const matchesSearch =
        !query ||
        reportNumber.toLowerCase().includes(query) ||
        projectName.toLowerCase().includes(query) ||
        workCompleted.toLowerCase().includes(query) ||
        memberName.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        report.status === statusFilter;

      const reportProjectId = getProjectId(report);

      const matchesProject =
        projectFilter === "all" ||
        String(reportProjectId) === String(projectFilter);

      const reportMemberId = getMemberId(report);

      const matchesTeamMember =
        teamMemberFilter === "all" ||
        String(reportMemberId) ===
          String(teamMemberFilter);

      const matchesWeek =
        weekFilter === "all" ||
        Number(report.weekNumber) ===
          Number(weekFilter);

      let matchesDate = true;

      if (dateRange && dateRange.length === 2) {
        const [startDate, endDate] = dateRange;

        const reportDate = dayjs(report.weekStart);

        if (!reportDate.isValid()) {
          matchesDate = false;
        } else {
          matchesDate =
            reportDate.isSame(startDate, "day") ||
            reportDate.isSame(endDate, "day") ||
            (reportDate.isAfter(
              startDate,
              "day",
            ) &&
              reportDate.isBefore(
                endDate,
                "day",
              ));
        }
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesProject &&
        matchesTeamMember &&
        matchesWeek &&
        matchesDate
      );
    });
  }, [
    reports,
    searchQuery,
    statusFilter,
    projectFilter,
    teamMemberFilter,
    weekFilter,
    dateRange,
  ]);

  const selectedWeekMemberCount = useMemo(() => {
    return new Set(
      weekScopedReports.map((report) =>
        String(getMemberId(report)),
      ),
    ).size;
  }, [weekScopedReports]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    statusFilter,
    projectFilter,
    teamMemberFilter,
    weekFilter,
    dateRange,
  ]);

  const statusChartData = useMemo(() => {
    const dataMap = new Map();

    weekScopedReports.forEach((report) => {
      const memberName = getMemberName(report);

      if (!dataMap.has(memberName)) {
        dataMap.set(memberName, {
          name: memberName,
          submitted: 0,
          approved: 0,
          correction: 0,
        });
      }

      const item = dataMap.get(memberName);

      if (report.status === "SUBMITTED") {
        item.submitted += 1;
      }

      if (report.status === "APPROVED") {
        item.approved += 1;
      }

      if (
        report.status === "NEEDS_CORRECTION" ||
        report.status === "CORRECTION_REQUIRED"
      ) {
        item.correction += 1;
      }
    });

    return Array.from(dataMap.values()).sort(
      (a, b) =>
        b.submitted +
        b.approved +
        b.correction -
        (a.submitted +
          a.approved +
          a.correction),
    );
  }, [weekScopedReports]);

  const reportsTrendData = useMemo(() => {
    const dataMap = new Map();

    reports
      .filter((report) => report.status !== "DRAFT")
      .forEach((report) => {
        const week = Number(report.weekNumber);

        if (!Number.isFinite(week)) {
          return;
        }

        if (!dataMap.has(week)) {
          dataMap.set(week, {
            week,
            submitted: 0,
            approved: 0,
            correction: 0,
          });
        }

        const item = dataMap.get(week);

        if (report.status === "SUBMITTED") {
          item.submitted += 1;
        }

        if (report.status === "APPROVED") {
          item.approved += 1;
        }

        if (
          report.status === "NEEDS_CORRECTION" ||
          report.status === "CORRECTION_REQUIRED"
        ) {
          item.correction += 1;
        }
      });

    return Array.from(dataMap.values())
      .sort((a, b) => a.week - b.week)
      .map((item) => ({
        ...item,
        name: `Week ${item.week}`,
      }));
  }, [reports]);

  const projectWorkloadData = useMemo(() => {
    const dataMap = new Map();

    weekScopedReports.forEach((report) => {
      const projectName = getProjectName(report);

      dataMap.set(
        projectName,
        (dataMap.get(projectName) || 0) + 1,
      );
    });

    return Array.from(dataMap.entries())
      .map(([name, reportsCount]) => ({
        name,
        reports: reportsCount,
      }))
      .sort((a, b) => b.reports - a.reports);
  }, [weekScopedReports]);

  const memberWorkloadData = useMemo(() => {
    const dataMap = new Map();

    weekScopedReports.forEach((report) => {
      const memberName = getMemberName(report);

      dataMap.set(
        memberName,
        (dataMap.get(memberName) || 0) + 1,
      );
    });

    return Array.from(dataMap.entries())
      .map(([name, reportsCount]) => ({
        name,
        reports: reportsCount,
      }))
      .sort((a, b) => b.reports - a.reports);
  }, [weekScopedReports]);

  const recentActivity = useMemo(() => {
    return [...reports]
      .filter((report) => report.status !== "DRAFT")
      .sort((a, b) => {
        const dateA = new Date(
          a.updatedAt || a.createdAt || 0,
        ).getTime();

        const dateB = new Date(
          b.updatedAt || b.createdAt || 0,
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 6);
  }, [reports]);

  const renderStatus = (status) => {
    switch (status) {
      case "SUBMITTED":
        return (
          <Tag
            icon={<ClockCircleOutlined />}
            color="processing"
            className="rounded-md px-2 py-1"
          >
            Submitted
          </Tag>
        );

      case "APPROVED":
        return (
          <Tag
            icon={<CheckCircleOutlined />}
            color="success"
            className="rounded-md px-2 py-1"
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
            className="rounded-md px-2 py-1"
          >
            Needs Correction
          </Tag>
        );

      default:
        return (
          <Tag color="default">
            {status || "Unknown"}
          </Tag>
        );
    }
  };

  const getActivityIcon = (status) => {
    if (status === "APPROVED") {
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50">
          <CheckCircleOutlined className="text-green-500" />
        </div>
      );
    }

    if (
      status === "NEEDS_CORRECTION" ||
      status === "CORRECTION_REQUIRED"
    ) {
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50">
          <ExclamationCircleOutlined className="text-orange-500" />
        </div>
      );
    }

    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
        <FileTextOutlined className="text-blue-500" />
      </div>
    );
  };

  const getActivityText = (report) => {
    const memberName = getMemberName(report);
    const reportNumber =
      report.reportNumber || "Report";
    const weekText = report.weekNumber
      ? `Week ${report.weekNumber}`
      : "";

    if (report.status === "APPROVED") {
      return `${memberName}'s ${weekText} report was approved`;
    }

    if (
      report.status === "NEEDS_CORRECTION" ||
      report.status === "CORRECTION_REQUIRED"
    ) {
      return `${memberName}'s ${weekText} report needs correction`;
    }

    return `${memberName} submitted ${reportNumber}`;
  };

  const formatActivityDate = (report) => {
    const date = report.updatedAt || report.createdAt;

    if (!date) {
      return "Recently";
    }

    const parsed = dayjs(date);

    if (!parsed.isValid()) {
      return "Recently";
    }

    return parsed.format("DD MMM YYYY, hh:mm A");
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
  };

  const columns = [
    {
      title: "REPORT",
      key: "report",
      width: 220,

      render: (_, report) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">
            {report.reportNumber || "—"}
          </span>

          <span className="text-xs text-slate-500">
            {report.weekNumber
              ? `Week ${report.weekNumber}`
              : "—"}
          </span>
        </div>
      ),
    },

    {
      title: "TEAM MEMBER",
      key: "teamMember",
      width: 200,

      render: (_, report) => {
        const memberName = getMemberName(report);

        return (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
              <UserOutlined className="text-purple-500" />
            </div>

            <Tooltip title={memberName}>
              <span className="max-w-[145px] truncate font-medium text-slate-700">
                {memberName}
              </span>
            </Tooltip>
          </div>
        );
      },
    },

    {
      title: "PROJECT",
      key: "project",
      width: 200,

      render: (_, report) => {
        const projectName = getProjectName(report);

        return (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <FileTextOutlined className="text-blue-500" />
            </div>

            <Tooltip title={projectName}>
              <span className="max-w-[150px] truncate font-medium text-slate-700">
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
      width: 180,

      render: (_, report) => (
        <div className="flex flex-col text-sm">
          <span className="font-medium text-slate-700">
            {report.weekNumber
              ? `Week ${report.weekNumber}`
              : "—"}
          </span>

          <span className="text-xs text-slate-400">
            {formatDate(report.weekStart)} -{" "}
            {formatDate(report.weekEnd)}
          </span>
        </div>
      ),
    },

    {
      title: "STATUS",
      key: "status",
      width: 180,

      render: (_, report) =>
        renderStatus(report.status),
    },

    {
      title: "CREATED",
      key: "createdAt",
      width: 140,

      render: (_, report) => (
        <span className="text-sm text-slate-600">
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
        <ManagerRow
          report={report}
          onView={handleViewReport}
          onApprove={handleApproveReport}
          onSendBack={handleRequestCorrection}
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
    {
      value: "CORRECTION_REQUIRED",
      label: "Correction Required",
    },
  ];

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setProjectFilter("all");
    setTeamMemberFilter("all");
    setWeekFilter("all");
    setDateRange(null);
  };

  const hasFilters =
    searchQuery ||
    statusFilter !== "all" ||
    projectFilter !== "all" ||
    teamMemberFilter !== "all" ||
    dateRange;

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center gap-4">
        <ExclamationCircleOutlined className="text-4xl text-red-500" />

        <p className="text-center text-slate-600">
          {error}
        </p>

        <Button
          type="primary"
          onClick={fetchReports}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <Card className="mb-6 rounded-xl border-0 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-blue-500" />

              <h2 className="m-0 text-lg font-semibold text-slate-800">
                Weekly Team Reports
              </h2>
            </div>

            <p className="m-0 text-sm text-slate-500">
              Select a reporting week to view all team
              members' submitted reports.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Select
              size="large"
              value={weekFilter}
              onChange={(value) => {
                setWeekFilter(value);
                setDateRange(null);
              }}
              className="w-full lg:w-[260px]"
              suffixIcon={<CalendarOutlined />}
              options={weekOptions}
              showSearch
              optionFilterProp="label"
            />

            {selectedWeek && (
              <div className="flex flex-1 items-center gap-3 overflow-x-auto whitespace-nowrap">
                <Tag
                  color="blue"
                  className="m-0 rounded-md px-3 py-1"
                >
                  Week {selectedWeek.weekNumber}
                </Tag>

                <span className="text-sm text-slate-500">
                  {formatDate(selectedWeek.weekStart)} -{" "}
                  {formatDate(selectedWeek.weekEnd)}
                </span>

                <span className="text-sm font-medium text-slate-700">
                  {selectedWeekMemberCount} team member
                  {selectedWeekMemberCount !== 1
                    ? "s"
                    : ""}{" "}
                  · {weekScopedReports.length} report
                  {weekScopedReports.length !== 1
                    ? "s"
                    : ""}
                </span>

                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => setWeekFilter("all")}
                  className="flex-shrink-0 text-slate-400 hover:text-red-500"
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      <Row
        gutter={[16, 16]}
        className="mb-6 items-stretch"
      >
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full rounded-xl border-0 shadow-sm">
            <Statistic
              title="Total Reports"
              value={stats.total}
              prefix={
                <FileTextOutlined className="text-blue-500" />
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full rounded-xl border-0 shadow-sm">
            <Statistic
              title="Submitted"
              value={stats.submitted}
              prefix={
                <ClockCircleOutlined className="text-blue-500" />
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full rounded-xl border-0 shadow-sm">
            <Statistic
              title="Approved"
              value={stats.approved}
              prefix={
                <CheckCircleOutlined className="text-green-500" />
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full rounded-xl border-0 shadow-sm">
            <Statistic
              title="Needs Correction"
              value={stats.correction}
              prefix={
                <ExclamationCircleOutlined className="text-orange-500" />
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={14}>
          <Card
            className="h-full rounded-xl border-0 shadow-sm"
            title={
              <div>
                <div className="text-base font-semibold text-slate-800">
                  Report Status by Team Member
                </div>

                <div className="text-xs font-normal text-slate-400">
                  {selectedWeek
                    ? `Week ${selectedWeek.weekNumber} report status`
                    : "Team-wide report status"}
                </div>
              </div>
            }
          >
            {statusChartData.length === 0 ? (
              <div className="flex h-[320px] items-center justify-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No report status data available"
                />
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <BarChart
                  data={statusChartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <ChartTooltip />

                  <Legend />

                  <Bar
                    dataKey="submitted"
                    name="Submitted"
                    stackId="status"
                    fill="#60a5fa"
                  />

                  <Bar
                    dataKey="approved"
                    name="Approved"
                    stackId="status"
                    fill="#4ade80"
                  />

                  <Bar
                    dataKey="correction"
                    name="Needs Correction"
                    stackId="status"
                    fill="#fb923c"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            className="h-full rounded-xl border-0 shadow-sm"
            title={
              <div>
                <div className="text-base font-semibold text-slate-800">
                  Reports Submitted Over Time
                </div>

                <div className="text-xs font-normal text-slate-400">
                  Weekly reporting activity
                </div>
              </div>
            }
          >
            {reportsTrendData.length === 0 ? (
              <div className="flex h-[320px] items-center justify-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No trend data available"
                />
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <LineChart
                  data={reportsTrendData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <ChartTooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="submitted"
                    name="Submitted"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="approved"
                    name="Approved"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="correction"
                    name="Needs Correction"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card
            className="h-full rounded-xl border-0 shadow-sm"
            title={
              <div>
                <div className="text-base font-semibold text-slate-800">
                  Workload by Project
                </div>

                <div className="text-xs font-normal text-slate-400">
                  Number of reports by project
                </div>
              </div>
            }
          >
            {projectWorkloadData.length === 0 ? (
              <div className="flex h-[320px] items-center justify-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No project workload data"
                />
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <BarChart
                  data={projectWorkloadData}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 20,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <ChartTooltip />

                  <Bar
                    dataKey="reports"
                    name="Reports"
                    fill="#6366f1"
                    radius={[0, 5, 5, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            className="h-full rounded-xl border-0 shadow-sm"
            title={
              <div>
                <div className="text-base font-semibold text-slate-800">
                  Team Member Workload
                </div>

                <div className="text-xs font-normal text-slate-400">
                  Report activity by team member
                </div>
              </div>
            }
          >
            {memberWorkloadData.length === 0 ? (
              <div className="flex h-[320px] items-center justify-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No team workload data"
                />
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <BarChart
                  data={memberWorkloadData}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 20,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <ChartTooltip />

                  <Bar
                    dataKey="reports"
                    name="Reports"
                    fill="#8b5cf6"
                    radius={[0, 5, 5, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      <Card
        className="mb-6 rounded-xl border-0 shadow-sm"
        title={
          <div>
            <div className="text-base font-semibold text-slate-800">
              Recent Activity
            </div>

            <div className="text-xs font-normal text-slate-400">
              Recent submissions and review activity
            </div>
          </div>
        }
      >
        {recentActivity.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No recent activity"
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {recentActivity.map((report) => (
              <div
                key={report._id}
                className="flex items-center gap-4 py-4"
              >
                {getActivityIcon(report.status)}

                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate text-sm font-medium text-slate-700">
                    {getActivityText(report)}
                  </p>

                  <p className="m-0 mt-1 text-xs text-slate-400">
                    {getProjectName(report)}
                    {report.reportNumber
                      ? ` · ${report.reportNumber}`
                      : ""}
                  </p>
                </div>

                <div className="hidden sm:block">
                  {renderStatus(report.status)}
                </div>

                <span className="whitespace-nowrap text-xs text-slate-400">
                  {formatActivityDate(report)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card
        className="mb-6 rounded-xl border-0 shadow-sm"
        bodyStyle={{ padding: 16 }}
      >
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Input
                allowClear
                size="large"
                prefix={
                  <SearchOutlined className="text-slate-400" />
                }
                placeholder="Search reports, projects, members..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value,
                  )
                }
                className="rounded-lg"
              />
            </div>

            <div className="lg:col-span-2">
              <Select
                size="large"
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusItems}
                className="w-full"
                suffixIcon={<FilterOutlined />}
              />
            </div>

            <div className="lg:col-span-2">
              <Select
                size="large"
                value={projectFilter}
                onChange={setProjectFilter}
                className="w-full"
                placeholder="Select Project"
                suffixIcon={<FilterOutlined />}
                showSearch
                optionFilterProp="label"
                options={[
                  {
                    value: "all",
                    label: "All Projects",
                  },
                  ...uniqueProjects.map(
                    (project) => ({
                      value: project.id,
                      label: project.name,
                    }),
                  ),
                ]}
              />
            </div>

            <div className="lg:col-span-2">
              <Select
                size="large"
                value={teamMemberFilter}
                onChange={setTeamMemberFilter}
                className="w-full"
                placeholder="Team Member"
                suffixIcon={<UserOutlined />}
                showSearch
                optionFilterProp="label"
                options={[
                  {
                    value: "all",
                    label: "All Team Members",
                  },
                  ...uniqueTeamMembers.map(
                    (member) => ({
                      value: member.id,
                      label: member.name,
                    }),
                  ),
                ]}
              />
            </div>

            <div className="lg:col-span-2">
              <RangePicker
                size="large"
                value={dateRange}
                onChange={(dates) =>
                  setDateRange(dates)
                }
                className="w-full rounded-lg"
                format="DD MMM YYYY"
                placeholder={[
                  "Start Date",
                  "End Date",
                ]}
                suffixIcon={
                  <CalendarOutlined />
                }
                allowClear
              />
            </div>
          </div>

          {hasFilters && (
            <div className="flex justify-end">
              <Button
                size="large"
                onClick={clearFilters}
                className="rounded-lg"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card
        className="rounded-xl border-0 shadow-sm"
        bodyStyle={{ padding: 0 }}
      >
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                {selectedWeek
                  ? `Week ${selectedWeek.weekNumber} Team Reports`
                  : "Team Reports"}
              </h2>

              <p className="text-sm text-slate-500">
                {selectedWeek
                  ? `${formatDate(
                      selectedWeek.weekStart,
                    )} - ${formatDate(
                      selectedWeek.weekEnd,
                    )}`
                  : "Review submitted weekly reports"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {selectedWeek && (
                <Tag
                  color="blue"
                  className="m-0 rounded-md px-3 py-1"
                >
                  {selectedWeekMemberCount} Members
                </Tag>
              )}

              <span className="text-sm text-slate-400">
                {filteredReports.length} report
                {filteredReports.length !== 1
                  ? "s"
                  : ""}
              </span>
            </div>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center px-4">
            <Empty
              image={
                Empty.PRESENTED_IMAGE_SIMPLE
              }
              description={
                weekFilter !== "all"
                  ? `No reports submitted for Week ${weekFilter}`
                  : hasFilters
                    ? "No reports match your filters"
                    : "No reports available"
              }
            />
          </div>
        ) : (
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
              onChange: (page) =>
                setCurrentPage(page),
            }}
            scroll={{ x: 1300 }}
            rowClassName={() =>
              "hover:bg-slate-50"
            }
          />
        )}
      </Card>

      <ReportDetailDrawer
        report={viewReport}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />

      <ReportModal
        open={reportModalOpen}
        editingReport={editingReport}
        onClose={handleCloseReportModal}
        onSuccess={handleReportSuccess}
      />
    </div>
  );
};

export default ManagerDashboard;