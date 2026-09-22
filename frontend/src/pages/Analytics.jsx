import React, { useCallback, useEffect, useMemo, useState } from "react";

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
  notification,
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

import { getAllReportsService } from "../services/ReportService";

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsed = dayjs(date);

  if (!parsed.isValid()) {
    return "—";
  }

  return parsed.format("DD MMM YYYY");
};

const Analytics = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weekFilter, setWeekFilter] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  console.log(reports);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllReportsService();

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch reports");
      }

      const allReports = response.data?.reports || [];

      setReports(allReports);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const availableWeeks = useMemo(() => {
    return Array.from(
      new Map(
        reports
          .filter((report) => report.status !== "DRAFT")
          .filter(
            (report) =>
              report.weekNumber !== undefined && report.weekNumber !== null,
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
    (week) => Number(week.weekNumber) === Number(weekFilter),
  );

  const weekScopedReports = useMemo(() => {
    return reports.filter((report) => {
      if (report.status === "DRAFT") {
        return false;
      }

      return (
        weekFilter === "all" || Number(report.weekNumber) === Number(weekFilter)
      );
    });
  }, [reports, weekFilter]);

  const selectedWeekMemberCount = useMemo(() => {
    return new Set(
      weekScopedReports.map((report) => String(report?.user?._id)),
    ).size;
  }, [weekScopedReports]);

  const getCompletionData = (weekReports) => {
    const dataMap = new Map();

    weekReports.forEach((report) => {
      const memberId = report?.user?._id;
      const memberName =
        `${report?.user?.firstName || ""} ${report?.user?.lastName || ""}`.trim();

      const tasks = Array.isArray(report.tasks) ? report.tasks : [];

      if (!dataMap.has(String(memberId))) {
        dataMap.set(String(memberId), {
          name: memberName || "Unknown Member",
          planned: 0,
          actual: 0,
          count: 0,
        });
      }

      const member = dataMap.get(String(memberId));

      tasks.forEach((task) => {
        member.planned += Number(task.plannedPct) || 0;
        member.actual += Number(task.actualPct) || 0;
        member.count += 1;
      });
    });

    return Array.from(dataMap.values()).map((member) => ({
      name: member.name,
      plannedPct: member.count ? Math.round(member.planned / member.count) : 0,
      actualPct: member.count ? Math.round(member.actual / member.count) : 0,
    }));
  };
  const completionChartData = useMemo(() => {
    return getCompletionData(weekScopedReports);
  }, [weekScopedReports]);

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

        <p className="text-center text-slate-600">{error}</p>

        <Button type="primary" onClick={fetchReports}>
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
              Select a reporting week to view all team members' submitted
              reports.
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
                <Tag color="blue" className="m-0 rounded-md px-3 py-1">
                  Week {selectedWeek.weekNumber}
                </Tag>

                <span className="text-sm text-slate-500">
                  {formatDate(selectedWeek.weekStart)} -{" "}
                  {formatDate(selectedWeek.weekEnd)}
                </span>

                <span className="text-sm font-medium text-slate-700">
                  {selectedWeekMemberCount} team member
                  {selectedWeekMemberCount !== 1 ? "s" : ""} ·{" "}
                  {weekScopedReports.length} report
                  {weekScopedReports.length !== 1 ? "s" : ""}
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

      {weekFilter === "all" ? (
        <div className="space-y-6">
          {availableWeeks.map((week) => {
            const weekReports = reports.filter(
              (report) =>
                report.status !== "DRAFT" &&
                Number(report.weekNumber) === Number(week.weekNumber),
            );

            const chartData = getCompletionData(weekReports);

            return (
              <Card
                key={week.weekNumber}
                className="rounded-xl border-0 shadow-sm"
                title={`Week ${week.weekNumber} - Team Completion`}
              >
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    <XAxis dataKey="name" />

                    <YAxis
                      domain={[0, 100]}
                      ticks={[0, 20, 40, 60, 80, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />

                    <ChartTooltip formatter={(value) => `${value}%`} />

                    <Legend />

                    <Bar dataKey="plannedPct" name="Planned %" fill="#60a5fa" />

                    <Bar dataKey="actualPct" name="Actual %" fill="#4ade80" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card
          className="rounded-xl border-0 shadow-sm"
          title={`Week ${selectedWeek?.weekNumber} - Team Completion`}
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={completionChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis dataKey="name" />

              <YAxis
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                tickFormatter={(value) => `${value}%`}
              />

              <ChartTooltip formatter={(value) => `${value}%`} />

              <Legend />

              <Bar dataKey="plannedPct" name="Planned %" fill="#60a5fa" />

              <Bar dataKey="actualPct" name="Actual %" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
