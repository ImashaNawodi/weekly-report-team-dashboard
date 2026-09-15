import { useEffect } from "react";

import {
  CloseOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  PushpinOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import { Badge, Button, Tag } from "antd";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusColor(status) {
  switch (status) {
    case "Draft":
      return "default";
    case "In Review":
      return "processing";
    case "Approved":
      return "success";
    case "Rejected":
      return "error";
    default:
      return "default";
  }
}

function getPriorityColor(priority) {
  switch (priority?.toLowerCase()) {
    case "low":
      return "green";
    case "medium":
      return "gold";
    case "high":
      return "red";
    case "urgent":
      return "volcano";
    default:
      return "default";
  }
}

function getStatusBadgeColor(status) {
  switch (status?.toLowerCase()) {
    case "completed":
      return "success";
    case "in progress":
      return "processing";
    case "not started":
      return "default";
    case "blocked":
      return "error";
    default:
      return "default";
  }
}

function getSeverityColor(severity) {
  switch (severity?.toLowerCase()) {
    case "low":
      return "green";
    case "medium":
      return "gold";
    case "high":
      return "orange";
    case "critical":
      return "red";
    default:
      return "default";
  }
}

export default function PreviewModal({ open, onClose, report }) {
  useEffect(() => {
    if (!open) return;

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  const totalHours = report.hours.reduce(
    (sum, hour) => sum + (Number(hour.hours) || 0),
    0,
  );

  const keyIssue = report.blockers.find((blocker) => blocker.isKeyIssue);

  const keyAchievement = report.achievements.find(
    (achievement) => achievement.isKeyAchievement,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <FileTextOutlined className="text-lg text-slate-600" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Report Preview
              </h3>

              <p className="text-xs text-slate-400">
                {formatDate(report.weekStart)} — {formatDate(report.weekEnd)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tag
              color={getStatusColor(report.status)}
              className="!m-0 !rounded-full"
            >
              <Badge
                status={getStatusColor(report.status)}
                text={report.status}
              />
            </Tag>

            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
              className="!flex !items-center !justify-center !text-slate-400 hover:!bg-slate-100 hover:!text-slate-600"
            />
          </div>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-5">
          <div>
            <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Project / Category
            </h4>

            <p className="text-sm font-medium text-slate-700">
              {report.project || "No project selected"}
            </p>
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <CheckCircleOutlined />
              Tasks Completed
            </h4>

            {report.tasks.length === 0 ? (
              <p className="text-sm italic text-slate-400">No tasks logged</p>
            ) : (
              <div className="space-y-2">
                {report.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <span className="min-w-0 flex-1 text-sm font-medium text-slate-700">
                      {task.name || "Untitled"}
                    </span>

                    <Tag
                      color={getPriorityColor(task.priority)}
                      className="!m-0"
                    >
                      {task.priority}
                    </Tag>

                    <Tag
                      color={getStatusBadgeColor(task.status)}
                      className="!m-0"
                    >
                      {task.status}
                    </Tag>

                    <span className="text-xs tabular-nums text-slate-400">
                      {task.timeSpent || 0}h / {task.plannedTime || 0}h
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <CalendarOutlined />
              Tasks Planned for Next Week
            </h4>

            {report.plannedTasks.length === 0 ? (
              <p className="text-sm italic text-slate-400">No planned tasks</p>
            ) : (
              <ul className="space-y-1.5">
                {report.plannedTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />

                    <span className="min-w-0 flex-1">
                      {task.description || "Untitled"}
                    </span>

                    <Tag
                      color={getPriorityColor(task.priority)}
                      className="!m-0"
                    >
                      {task.priority}
                    </Tag>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <ExclamationCircleOutlined />
              Blockers / Challenges
            </h4>

            {report.blockers.length === 0 ? (
              <p className="text-sm italic text-slate-400">
                No blockers reported
              </p>
            ) : (
              <div className="space-y-2">
                {report.blockers.map((blocker) => (
                  <div
                    key={blocker.id}
                    className={`flex items-start gap-2 rounded-lg border px-3 py-2 ${
                      blocker.isKeyIssue
                        ? "border-amber-200 bg-amber-50/30"
                        : "border-slate-100"
                    }`}
                  >
                    <span className="flex-1 text-sm text-slate-600">
                      {blocker.description || "No description"}
                    </span>

                    <Tag
                      color={getSeverityColor(blocker.severity)}
                      className="!m-0"
                    >
                      {blocker.severity}
                    </Tag>

                    {blocker.isKeyIssue && (
                      <span className="text-[10px] font-semibold uppercase text-amber-700">
                        Key
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {keyIssue && (
              <p className="mt-1.5 text-xs text-amber-600">
                Key Issue: {keyIssue.description}
              </p>
            )}
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <TrophyOutlined />
              Achievements / Highlights
            </h4>

            {report.achievements.length === 0 ? (
              <p className="text-sm italic text-slate-400">
                No achievements reported
              </p>
            ) : (
              <div className="space-y-2">
                {report.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-start gap-2 rounded-lg border px-3 py-2 ${
                      achievement.isKeyAchievement
                        ? "border-green-200 bg-green-50/30"
                        : "border-slate-100"
                    }`}
                  >
                    <span className="flex-1 text-sm text-slate-600">
                      {achievement.description || "No description"}
                    </span>

                    {achievement.isKeyAchievement && (
                      <span className="text-[10px] font-semibold uppercase text-green-700">
                        Key
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {keyAchievement && (
              <p className="mt-1.5 text-xs text-green-600">
                Key Achievement: {keyAchievement.description}
              </p>
            )}
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <ClockCircleOutlined />
              Hours Worked
            </h4>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {report.hours.map((hour) => (
                <div
                  key={hour.type}
                  className="rounded-lg border border-slate-100 px-3 py-2 text-center"
                >
                  <p className="text-xs text-slate-400">{hour.type}</p>

                  <p className="text-sm font-semibold tabular-nums text-slate-700">
                    {hour.hours || 0}h
                  </p>
                </div>
              ))}

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center">
                <p className="text-xs font-medium text-slate-500">Total</p>

                <p className="text-sm font-bold tabular-nums text-slate-900">
                  {totalHours.toFixed(1)}h
                </p>
              </div>
            </div>
          </div>

          {(report.notes || report.links) && (
            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <PushpinOutlined />
                Additional Notes
              </h4>

              {report.notes && (
                <p className="mb-2 whitespace-pre-wrap text-sm text-slate-600">
                  {report.notes}
                </p>
              )}

              {report.links && (
                <ul className="space-y-1">
                  {report.links
                    .split("\n")
                    .filter(Boolean)
                    .map((link, index) => (
                      <li key={index}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-sm text-blue-600 hover:underline"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end border-t border-slate-200 px-6 py-4">
          <Button type="primary" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
