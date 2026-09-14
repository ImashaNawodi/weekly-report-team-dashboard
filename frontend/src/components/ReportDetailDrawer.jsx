import {
  Calendar,
  FileText,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  MessageSquare,
  X,
  BriefcaseBusiness,
} from "lucide-react";

import { Drawer, Button, Typography } from "antd";
import StatusBadge from "./StatusBadge";

const { Text, Paragraph } = Typography;

export default function ReportDetailDrawer({ report, open, onClose }) {
  if (!report) return null;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const weekStart = formatDate(report.weekStart);
  const weekEnd = formatDate(report.weekEnd);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={480}
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
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white">
          <div className="flex items-start justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <FileText size={19} className="text-blue-600" />
              </div>

              <div>
                <Typography.Title
                  level={5}
                  className="!m-0 !text-base !font-semibold !text-slate-900"
                >
                  Weekly Report
                </Typography.Title>

                <Text className="!text-xs !text-slate-500">
                  {report.reportNumber}
                </Text>
              </div>
            </div>

            <Button
              type="text"
              onClick={onClose}
              icon={<X size={19} />}
              className="
                !flex
                !h-9
                !w-9
                !min-w-9
                !items-center
                !justify-center
                !rounded-lg
                !text-slate-400
                hover:!bg-slate-100
                hover:!text-slate-700
              "
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Status
              </p>

              <StatusBadge status={report.status} />
            </div>

            <div className="h-px bg-slate-100" />

            <div className="grid grid-cols-2 gap-5 pt-4">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                    <BriefcaseBusiness size={15} className="text-indigo-600" />
                  </div>

                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Project
                  </span>
                </div>

                <p className="truncate text-sm font-semibold text-slate-800">
                  {report.project?.name || "No project"}
                </p>
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                    <Calendar size={15} className="text-violet-600" />
                  </div>

                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Report Week
                  </span>
                </div>

                <p className="text-sm font-semibold leading-5 text-slate-800">
                  {weekStart}
                  <span className="mx-1 text-slate-400">–</span>
                  {weekEnd}
                </p>
              </div>
            </div>
          </div>

          <ReportSection
            icon={<CheckCircle2 size={18} className="text-emerald-600" />}
            iconBg="bg-emerald-50"
            title="Work Completed"
            description="What was accomplished during this week"
          >
            <div className="rounded-xl border border-slate-100 bg-white p-4">
              <Paragraph className="!m-0 !text-sm !leading-7 !text-slate-600">
                {report.workCompleted || "No work completed recorded."}
              </Paragraph>
            </div>
          </ReportSection>

          <ReportSection
            icon={<Clock3 size={18} className="text-blue-600" />}
            iconBg="bg-blue-50"
            title="Planned Work"
            description="Tasks planned for the upcoming week"
          >
            <div className="rounded-xl border border-slate-100 bg-white p-4">
              <Paragraph className="!m-0 !text-sm !leading-7 !text-slate-600">
                {report.plannedWork || "No planned work recorded."}
              </Paragraph>
            </div>
          </ReportSection>

          <ReportSection
            icon={<AlertTriangle size={18} className="text-amber-600" />}
            iconBg="bg-amber-50"
            title="Blockers"
            description="Issues or challenges affecting progress"
          >
            <div
              className={
                report.blockers
                  ? "rounded-xl border border-amber-100 bg-amber-50/60 p-4"
                  : "rounded-xl border border-slate-100 bg-white p-4"
              }
            >
              <Paragraph className="!m-0 !text-sm !leading-7 !text-slate-600">
                {report.blockers || "No blockers reported."}
              </Paragraph>
            </div>
          </ReportSection>

          {report.managerFeedback && (
            <ReportSection
              icon={<MessageSquare size={18} className="text-orange-600" />}
              iconBg="bg-orange-50"
              title="Manager Feedback"
              description="Feedback provided during the review"
            >
              <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4">
                <Paragraph className="!m-0 !text-sm !leading-7 !text-slate-700">
                  {report.managerFeedback}
                </Paragraph>
              </div>
            </ReportSection>
          )}

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-100/70 p-4">
            <p className="text-center text-xs leading-5 text-slate-500">
              This report contains the weekly progress, planned activities, and
              blockers for the selected project.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white px-6 py-4">
          <Button
            block
            onClick={onClose}
            className="
              !h-10
              !rounded-lg
              !border-slate-200
              !font-medium
              !text-slate-700
              hover:!border-slate-300
              hover:!bg-slate-50
            "
          >
            Close Report
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

/* Reusable Section */

function ReportSection({ icon, iconBg, title, description, children }) {
  return (
    <section className="mb-7">
      <div className="mb-3 flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>

          <p className="mt-0.5 text-xs text-slate-400">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}
