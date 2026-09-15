import { useEffect, useMemo, useRef, useState } from "react";

import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { Badge, Button, Tag } from "antd";
import dayjs from "dayjs";

const generateWeeks = (projectStartDate) => {
  if (!projectStartDate) {
    return [];
  }

  const startDate = dayjs(projectStartDate).startOf("day");

  if (!startDate.isValid()) {
    return [];
  }

  return Array.from({ length: 10 }, (_, index) => {
    const weekStart = startDate.add(index * 7, "day");
    const weekEnd = weekStart.add(6, "day");

    return {
      weekNumber: index + 1,
      weekStart: weekStart.format("YYYY-MM-DD"),
      weekEnd: weekEnd.format("YYYY-MM-DD"),
      label: `${weekStart.format("DD MMM YYYY")} - ${weekEnd.format(
        "DD MMM YYYY",
      )}`,
    };
  });
};

const getStatusColor = (status) => {
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
};

export default function ReportMetaBar({ report, onChange, project }) {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const projectStartDate =
    project?.createdAt || project?.startDate || project?.projectStartDate;

  const weeks = useMemo(() => {
    return generateWeeks(projectStartDate);
  }, [projectStartDate]);

  const selectedWeek = useMemo(() => {
    if (!report?.weekStart || !report?.weekEnd) {
      return null;
    }

    return weeks.find(
      (week) =>
        week.weekStart === report.weekStart && week.weekEnd === report.weekEnd,
    );
  }, [weeks, report?.weekStart, report?.weekEnd]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectWeek = (week) => {
    onChange((prev) => ({
      ...prev,
      weekStart: week.weekStart,
      weekEnd: week.weekEnd,
      weekNumber: week.weekNumber,
    }));

    setOpen(false);
  };

  const renderStatusMessage = () => {
    if (report?.status === "Draft") {
      return (
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <ExclamationCircleOutlined />
          Not yet submitted
        </span>
      );
    }

    if (report?.status === "In Review") {
      return (
        <span className="flex items-center gap-1 text-xs text-blue-600">
          <ClockCircleOutlined />
          Awaiting manager review
        </span>
      );
    }

    if (report?.status === "Approved") {
      return (
        <span className="flex items-center gap-1 text-xs text-green-600">
          <CheckCircleOutlined />
          Approved by manager
        </span>
      );
    }

    if (report?.status === "Rejected") {
      return (
        <span className="flex items-center gap-1 text-xs text-red-600">
          <ExclamationCircleOutlined />
          Changes requested
        </span>
      );
    }

    return null;
  };

  const statusColor = getStatusColor(report?.status);

  return (
    <div className="animate-fade-in rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          <div className="relative" ref={dropdownRef}>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Reporting Period
            </label>

            <Button
              type="default"
              onClick={() => setOpen((prev) => !prev)}
              disabled={weeks.length === 0}
              className="!flex !h-auto !min-w-[300px] !items-center !gap-2.5 !rounded-lg !border-slate-300 !px-3.5 !py-2 !text-left !text-sm !font-medium"
            >
              <CalendarOutlined className="shrink-0 text-blue-600" />

              <span
                className={
                  selectedWeek
                    ? "flex-1 text-slate-700"
                    : "flex-1 text-slate-400"
                }
              >
                {selectedWeek
                  ? `Week ${selectedWeek.weekNumber} — ${selectedWeek.label}`
                  : "Select reporting week"}
              </span>

              <DownOutlined
                className={`text-xs text-slate-400 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </Button>

            {open && weeks.length > 0 && (
              <div className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[300px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 px-3.5 py-2.5">
                  <span className="text-xs font-medium text-slate-400">
                    Select reporting week
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {weeks.map((week) => {
                    const isSelected =
                      week.weekStart === report?.weekStart &&
                      week.weekEnd === report?.weekEnd;

                    const today = dayjs();

                    const isCurrentWeek =
                      !today.isBefore(dayjs(week.weekStart), "day") &&
                      !today.isAfter(dayjs(week.weekEnd), "day");

                    return (
                      <button
                        key={week.weekNumber}
                        type="button"
                        onClick={() => handleSelectWeek(week)}
                        className={`flex w-full cursor-pointer items-center justify-between px-3.5 py-3 text-left transition-colors ${
                          isSelected
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span
                            className={`text-sm ${
                              isSelected ? "font-semibold" : "font-medium"
                            }`}
                          >
                            Week {week.weekNumber}
                          </span>

                          <span className="mt-0.5 text-xs text-slate-400">
                            {week.label}
                          </span>
                        </div>

                        {isCurrentWeek && (
                          <span className="ml-3 whitespace-nowrap text-[10px] font-semibold uppercase text-blue-600">
                            This Week
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Report Status
            </label>

            <div className="flex items-center gap-2">
              <Tag color={statusColor} className="!m-0 !rounded-full">
                <Badge
                  status={statusColor}
                  text={report?.status || "Draft"}
                  className="!text-xs"
                />
              </Tag>

              {renderStatusMessage()}
            </div>
          </div>

          <div className="lg:ml-auto">
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Last Saved
            </label>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ClockCircleOutlined className="text-slate-400" />

              <span>
                {report?.lastSaved
                  ? dayjs(report.lastSaved).format("MMM D, h:mm A")
                  : "Never — unsaved changes"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
