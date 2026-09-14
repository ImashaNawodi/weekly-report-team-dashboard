import React from "react";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BarChartOutlined,
  PieChartOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Card, Button, Tag, Table, Statistic, Row, Col } from "antd";

export default function DashboardPage() {
  const reports = [
    {
      key: "1",
      name: "John Smith",
      project: "Project Alpha",
      week: "Sep 08",
      hours: "40h",
      status: "Reviewed",
    },
    {
      key: "2",
      name: "Sarah Johnson",
      project: "Project Beta",
      week: "Sep 08",
      hours: "38h",
      status: "Pending",
    },
    {
      key: "3",
      name: "Michael Brown",
      project: "Project Alpha",
      week: "Sep 08",
      hours: "42h",
      status: "Reviewed",
    },
    {
      key: "4",
      name: "Emily Davis",
      project: "Project Gamma",
      week: "Sep 08",
      hours: "40h",
      status: "Pending",
    },
    {
      key: "5",
      name: "David Wilson",
      project: "Project Beta",
      week: "Sep 08",
      hours: "39h",
      status: "Reviewed",
    },
  ];

  const columns = [
    {
      title: "TEAM MEMBER",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
            {name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </div>

          <div>
            <p className="m-0 text-sm font-medium text-slate-900">{name}</p>
            <p className="m-0 text-xs text-slate-500">{record.project}</p>
          </div>
        </div>
      ),
    },
    {
      title: "WEEK",
      dataIndex: "week",
      key: "week",
      render: (week) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <CalendarOutlined className="text-slate-400" />
          {week}
        </div>
      ),
    },
    {
      title: "HOURS",
      dataIndex: "hours",
      key: "hours",
      responsive: ["md"],
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === "Reviewed" ? "success" : "warning"}
          className="rounded-md"
        >
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="rounded-xl border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="m-0 text-xl font-bold text-slate-900">
              Welcome back, John
            </h2>

            <p className="mt-1 mb-0 text-sm text-slate-500">
              Here's how your team is doing this week.
            </p>
          </div>

          <Button
            type="primary"
            icon={<FileTextOutlined />}
            className="flex items-center rounded-lg"
          >
            <span className="hidden sm:inline">New Report</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl border-slate-200 shadow-sm">
            <Statistic
              title="Reports This Week"
              value="6 / 8"
              prefix={<FileTextOutlined />}
            />

            <p className="mt-2 mb-0 text-sm text-green-600">75%</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl border-slate-200 shadow-sm">
            <Statistic
              title="Reviewed"
              value="2"
              prefix={<CheckCircleOutlined className="text-green-600" />}
            />

            <p className="mt-2 mb-0 text-sm text-green-600">+1</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl border-slate-200 shadow-sm">
            <Statistic
              title="Pending"
              value="4"
              prefix={<ClockCircleOutlined className="text-amber-600" />}
            />

            <p className="mt-2 mb-0 text-sm text-green-600">-1</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl border-slate-200 shadow-sm">
            <Statistic
              title="Team Members"
              value="8"
              prefix={<TeamOutlined className="text-cyan-600" />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <BarChartOutlined />
                <span>Weekly Report Submissions</span>
              </div>
            }
            extra={<Button type="link">View analytics</Button>}
            className="rounded-xl border-slate-200 shadow-sm"
          >
            <div className="flex h-64 items-end justify-around gap-4 px-4">
              {[40, 65, 50, 80, 60, 90, 70].map((height, index) => (
                <div
                  key={index}
                  className="flex h-full flex-1 items-end justify-center"
                >
                  <div
                    className="w-full max-w-12 rounded-t-md bg-blue-500"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-around text-xs text-slate-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <PieChartOutlined />
                <span>Team by Project</span>
              </div>
            }
            className="h-full rounded-xl border-slate-200 shadow-sm"
          >
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[25px] border-blue-500">
                <div className="absolute inset-0 rounded-full border-[25px] border-green-400 border-l-transparent border-b-transparent" />

                <span className="text-2xl font-bold text-slate-700">8</span>
              </div>

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500" />
                  Project Alpha
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                  Project Beta
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-slate-300" />
                  Project Gamma
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Reports */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined />
            <span>Recent Reports</span>
          </div>
        }
        extra={<Button type="link">View all</Button>}
        className="rounded-xl border-slate-200 shadow-sm"
      >
        <Table
          columns={columns}
          dataSource={reports}
          pagination={false}
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
}
