import { useEffect } from "react";

import {
  SendOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import { Button } from "antd";

export default function SubmitModal({ open, onClose, onConfirm, report }) {
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

  const completedTasks = report.tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const blockedTasks = report.tasks.filter(
    (task) => task.status === "Blocked",
  ).length;

  const keyIssue = report.blockers.find((blocker) => blocker.isKeyIssue);

  const keyAchievement = report.achievements.find(
    (achievement) => achievement.isKeyAchievement,
  );

  const summary = [
    {
      label: "Project",
      value: report.project || "Not selected",
      ok: Boolean(report.project),
    },
    {
      label: "Tasks logged",
      value: `${report.tasks.length} task(s)`,
      ok: report.tasks.length > 0,
    },
    {
      label: "Completed",
      value: `${completedTasks} of ${report.tasks.length}`,
      ok: true,
    },
    {
      label: "Blocked",
      value: `${blockedTasks} task(s)`,
      ok: blockedTasks === 0,
      warn: blockedTasks > 0,
    },
    {
      label: "Planned next week",
      value: `${report.plannedTasks.length} task(s)`,
      ok: report.plannedTasks.length > 0,
    },
    {
      label: "Blockers reported",
      value: `${report.blockers.length}`,
      ok: true,
    },
    {
      label: "Achievements",
      value: `${report.achievements.length}`,
      ok: report.achievements.length > 0,
    },
    {
      label: "Total hours",
      value: `${totalHours.toFixed(1)}h`,
      ok: totalHours > 0,
    },
    {
      label: "Key issue",
      value: keyIssue
        ? `${keyIssue.description.slice(0, 40)}...`
        : "None marked",
      ok: !keyIssue,
      warn: Boolean(keyIssue),
    },
    {
      label: "Key achievement",
      value: keyAchievement
        ? `${keyAchievement.description.slice(0, 40)}...`
        : "None marked",
      ok: Boolean(keyAchievement),
    },
    {
      label: "Notes",
      value: report.notes ? "Added" : "None",
      ok: true,
    },
    {
      label: "Links",
      value: report.links
        ? `${report.links.split("\n").filter(Boolean).length} link(s)`
        : "None",
      ok: true,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-slide-up"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <SendOutlined className="text-lg text-blue-600" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Submit for Review
              </h3>

              <p className="text-xs text-slate-400">
                Review the summary before sending to your manager
              </p>
            </div>
          </div>

          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            className="!flex !items-center !justify-center !text-slate-400 hover:!bg-slate-100 hover:!text-slate-600"
          />
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <ExclamationCircleOutlined className="mt-0.5 shrink-0 text-amber-600" />

            <p className="text-xs text-amber-700">
              Once submitted, you won't be able to edit this report until your
              manager reviews it. Make sure all information is accurate.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {summary.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-lg border border-slate-100 px-3 py-2.5"
              >
                {item.ok && !item.warn ? (
                  <CheckCircleOutlined className="mt-0.5 shrink-0 text-green-500" />
                ) : item.warn ? (
                  <ExclamationCircleOutlined className="mt-0.5 shrink-0 text-amber-500" />
                ) : (
                  <ExclamationCircleOutlined className="mt-0.5 shrink-0 text-slate-300" />
                )}

                <div className="min-w-0">
                  <p className="text-xs text-slate-400">{item.label}</p>

                  <p className="truncate text-sm font-medium text-slate-700">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <Button onClick={onClose}>Cancel</Button>

          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={onConfirm}
            className="!flex !items-center !gap-1"
          >
            Confirm & Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
