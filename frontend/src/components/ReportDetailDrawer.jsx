import {
  Calendar,
  FileText,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  MessageSquare,
  X,
  BriefcaseBusiness,
  ListChecks,
  ClipboardList,
  Link as LinkIcon,
  Flag,
} from "lucide-react";

import { Drawer, Button, Tag, Typography, Divider } from "antd";

import StatusBadge from "./StatusBadge";

const { Text } = Typography;

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getText = (value, fallback = "-") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "object") {
    return value.name || value.title || fallback;
  }

  return String(value);
};

const getProjectName = (project) => {
  if (!project) {
    return "No project selected";
  }

  if (typeof project === "object") {
    return project.name || project.title || "No project selected";
  }

  return project;
};

function ReportSection({
  icon: Icon,
  iconBg = "bg-blue-50",
  iconColor = "text-blue-600",
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
        >
          <Icon size={18} className={iconColor} />
        </div>

        <div className="min-w-0">
          <h3 className="m-0 text-sm font-semibold text-slate-900">{title}</h3>

          {description && (
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          )}
        </div>
      </div>

      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

function EmptyText({ children = "No information available." }) {
  return <p className="m-0 text-sm italic text-slate-400">{children}</p>;
}

function PriorityTag({ priority }) {
  if (!priority) return null;

  const value = String(priority).toLowerCase();

  let color = "default";

  switch (value) {
    case "low":
      color = "green";
      break;

    case "medium":
      color = "gold";
      break;

    case "high":
      color = "red";
      break;

    case "urgent":
      color = "volcano";
      break;

    default:
      color = "default";
  }

  return (
    <Tag color={color} className="!m-0">
      {priority}
    </Tag>
  );
}

function TaskStatusTag({ status }) {
  if (!status) return null;

  const value = String(status).toLowerCase();

  let color = "default";

  switch (value) {
    case "completed":
      color = "success";
      break;

    case "in progress":
      color = "processing";
      break;

    case "not started":
      color = "default";
      break;

    case "blocked":
      color = "error";
      break;

    default:
      color = "default";
  }

  return (
    <Tag color={color} className="!m-0">
      {status}
    </Tag>
  );
}

function SeverityTag({ severity }) {
  if (!severity) return null;

  const value = String(severity).toLowerCase();

  let color = "default";

  switch (value) {
    case "low":
      color = "green";
      break;

    case "medium":
      color = "gold";
      break;

    case "high":
      color = "orange";
      break;

    case "critical":
      color = "red";
      break;

    default:
      color = "default";
  }

  return (
    <Tag color={color} className="!m-0">
      {severity}
    </Tag>
  );
}

export default function ReportDetailDrawer({ report, open, onClose }) {
  if (!report) {
    return null;
  }

  const tasks = Array.isArray(report.tasks) ? report.tasks : [];

  const plannedTasks = Array.isArray(report.plannedTasks)
    ? report.plannedTasks
    : [];

  const blockers = Array.isArray(report.blockers) ? report.blockers : [];

  const achievements = Array.isArray(report.achievements)
    ? report.achievements
    : [];

  const hours = Array.isArray(report.hours) ? report.hours : [];

  const projectName = getProjectName(report.project);

  const totalHours = hours.reduce(
    (sum, hour) => sum + (Number(hour?.hours) || 0),
    0,
  );

  const keyIssue = blockers.find((blocker) => blocker?.isKeyIssue);

  const keyAchievement = achievements.find(
    (achievement) => achievement?.isKeyAchievement,
  );

  const weekStart = formatDate(report.weekStart);
  const weekEnd = formatDate(report.weekEnd);

  const links = report.links
    ? String(report.links)
        .split("\n")
        .map((link) => link.trim())
        .filter(Boolean)
    : [];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={560}
      closable={false}
      styles={{
        body: {
          padding: 0,
          background: "#f8fafc",
        },
        header: {
          display: "none",
        },
      }}
    >
      <div className="flex h-full flex-col">
        <div className="shrink-0 border-b border-slate-200 bg-white">
          <div className="flex items-start justify-between gap-4 px-6 py-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <FileText size={20} className="text-blue-600" />
              </div>

              <div className="min-w-0">
                <Typography.Title
                  level={5}
                  className="!m-0 !text-base !font-semibold !text-slate-900"
                >
                  Weekly Report
                </Typography.Title>

                <Text className="!text-xs !text-slate-500">
                  {report.reportNumber || "Report"}
                </Text>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {report.status && <StatusBadge status={report.status} />}

              <Button
                type="text"
                onClick={onClose}
                icon={<X size={19} />}
                className="!flex !h-9 !w-9 !min-w-9 !items-center !justify-center !rounded-lg !text-slate-400 hover:!bg-slate-100 hover:!text-slate-700"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Calendar size={15} className="text-slate-400" />

              <span>
                {weekStart} — {weekEnd}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-4">
            <ReportSection
              icon={BriefcaseBusiness}
              iconBg="bg-indigo-50"
              iconColor="text-indigo-600"
              title="Project"
              description="Project associated with this weekly report"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="m-0 truncate text-sm font-semibold text-slate-800">
                    {projectName}
                  </p>
                </div>
              </div>
            </ReportSection>

            <ReportSection
              icon={ListChecks}
              iconBg="bg-green-50"
              iconColor="text-green-600"
              title="Tasks Completed"
              description={`${tasks.length} task${
                tasks.length === 1 ? "" : "s"
              }`}
            >
              {tasks.length === 0 ? (
                <EmptyText>No completed tasks added.</EmptyText>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <div
                      key={task?._id || task?.id || index}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="m-0 text-sm font-medium text-slate-800">
                            {getText(task?.name, `Task ${index + 1}`)}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                          <PriorityTag priority={task?.priority} />

                          <TaskStatusTag status={task?.status} />
                        </div>
                      </div>

                      {(task?.timeSpent !== undefined ||
                        task?.plannedTime !== undefined) && (
                        <div className="mt-3 flex flex-wrap gap-4 border-t border-slate-200 pt-3">
                          {task?.timeSpent !== undefined && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Clock3 size={14} />
                              <span>
                                Time spent:{" "}
                                <strong className="text-slate-700">
                                  {task.timeSpent}h
                                </strong>
                              </span>
                            </div>
                          )}

                          {task?.plannedTime !== undefined && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Calendar size={14} />
                              <span>
                                Planned:{" "}
                                <strong className="text-slate-700">
                                  {task.plannedTime}h
                                </strong>
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ReportSection>

            <ReportSection
              icon={ClipboardList}
              iconBg="bg-purple-50"
              iconColor="text-purple-600"
              title="Planned Tasks"
              description={`${plannedTasks.length} planned task${
                plannedTasks.length === 1 ? "" : "s"
              }`}
            >
              {plannedTasks.length === 0 ? (
                <EmptyText>No planned tasks added.</EmptyText>
              ) : (
                <div className="space-y-3">
                  {plannedTasks.map((task, index) => (
                    <div
                      key={task?._id || task?.id || index}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 gap-3">
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700">
                            {index + 1}
                          </div>

                          <p className="m-0 text-sm leading-6 text-slate-700">
                            {getText(
                              task?.description || task?.name || task?.task,
                              "No description",
                            )}
                          </p>
                        </div>

                        <PriorityTag priority={task?.priority} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ReportSection>

            <ReportSection
              icon={AlertTriangle}
              iconBg="bg-red-50"
              iconColor="text-red-600"
              title="Blockers"
              description={`${blockers.length} blocker${
                blockers.length === 1 ? "" : "s"
              }`}
            >
              {blockers.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 size={17} />
                  <span>No blockers reported.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {blockers.map((blocker, index) => (
                    <div
                      key={blocker?._id || blocker?.id || index}
                      className={`rounded-lg border p-4 ${
                        blocker?.isKeyIssue
                          ? "border-red-200 bg-red-50"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 gap-3">
                          <AlertTriangle
                            size={17}
                            className="mt-0.5 shrink-0 text-red-500"
                          />

                          <p className="m-0 text-sm leading-6 text-slate-700">
                            {getText(
                              blocker?.description || blocker?.blocker,
                              `Blocker ${index + 1}`,
                            )}
                          </p>
                        </div>

                        <SeverityTag severity={blocker?.severity} />
                      </div>

                      {blocker?.isKeyIssue && (
                        <div className="mt-3 flex items-center gap-1.5 border-t border-red-200 pt-3 text-xs font-medium text-red-600">
                          <Flag size={13} />
                          Key Issue
                        </div>
                      )}
                    </div>
                  ))}

                  {keyIssue && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                      <p className="m-0 text-xs font-semibold uppercase tracking-wide text-red-600">
                        Key Issue
                      </p>

                      <p className="mt-1 text-sm text-red-800">
                        {getText(keyIssue?.description || keyIssue?.blocker)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </ReportSection>

            <ReportSection
              icon={CheckCircle2}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
              title="Achievements"
              description={`${achievements.length} achievement${
                achievements.length === 1 ? "" : "s"
              }`}
            >
              {achievements.length === 0 ? (
                <EmptyText>No achievements added.</EmptyText>
              ) : (
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div
                      key={achievement?._id || achievement?.id || index}
                      className={`rounded-lg border p-4 ${
                        achievement?.isKeyAchievement
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2
                          size={18}
                          className="mt-0.5 shrink-0 text-emerald-600"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="m-0 text-sm leading-6 text-slate-700">
                            {getText(
                              achievement?.description ||
                                achievement?.achievement,
                              `Achievement ${index + 1}`,
                            )}
                          </p>

                          {achievement?.isKeyAchievement && (
                            <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                              <Flag size={13} />
                              Key Achievement
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {keyAchievement && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <p className="m-0 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                        Key Achievement
                      </p>

                      <p className="mt-1 text-sm text-emerald-800">
                        {getText(
                          keyAchievement?.description ||
                            keyAchievement?.achievement,
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </ReportSection>

            <ReportSection
              icon={Clock3}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
              title="Hours"
              description="Time logged during the week"
            >
              {hours.length === 0 ? (
                <EmptyText>No working hours added.</EmptyText>
              ) : (
                <div className="space-y-2">
                  {hours.map((hour, index) => (
                    <div
                      key={hour?._id || hour?.id || index}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <div>
                        <p className="m-0 text-sm font-medium text-slate-700">
                          {getText(hour?.type, `Hour entry ${index + 1}`)}
                        </p>
                      </div>

                      <div className="text-sm font-semibold text-slate-800">
                        {Number(hour?.hours) || 0}h
                      </div>
                    </div>
                  ))}

                  <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3">
                    <span className="text-sm font-medium text-white">
                      Total Hours
                    </span>

                    <span className="text-base font-bold text-white">
                      {totalHours}h
                    </span>
                  </div>
                </div>
              )}
            </ReportSection>

            <ReportSection
              icon={MessageSquare}
              iconBg="bg-sky-50"
              iconColor="text-sky-600"
              title="Notes"
              description="Additional information"
            >
              {report.notes ? (
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="m-0 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {report.notes}
                  </p>
                </div>
              ) : (
                <EmptyText>No additional notes.</EmptyText>
              )}
            </ReportSection>

            <ReportSection
              icon={LinkIcon}
              iconBg="bg-cyan-50"
              iconColor="text-cyan-600"
              title="Links"
              description="Related resources"
            >
              {links.length === 0 ? (
                <EmptyText>No links added.</EmptyText>
              ) : (
                <div className="space-y-2">
                  {links.map((link, index) => (
                    <a
                      key={`${link}-${index}`}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                    >
                      <LinkIcon size={15} className="shrink-0" />

                      <span className="min-w-0 truncate">{link}</span>
                    </a>
                  ))}
                </div>
              )}
            </ReportSection>

            {report.managerFeedback && (
              <ReportSection
                icon={MessageSquare}
                iconBg="bg-violet-50"
                iconColor="text-violet-600"
                title="Manager Feedback"
                description="Feedback provided during review"
              >
                <div className="rounded-lg border border-violet-100 bg-violet-50 p-4">
                  <p className="m-0 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {report.managerFeedback}
                  </p>
                </div>
              </ReportSection>
            )}

            <div className="h-2" />
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-4">
          <Button
            block
            size="large"
            onClick={onClose}
            className="!h-10 !rounded-lg !font-medium"
          >
            Close Report
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
