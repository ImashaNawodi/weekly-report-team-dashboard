import SectionCard from "../ui/SectionsCard";

import { ClockCircleOutlined } from "@ant-design/icons";
import { InputNumber, Progress, Tag } from "antd";

export default function HoursWorkedSection({
  hours = [],
  onChange,
  hourTypes = [
    "Development",
    "Meetings",
    "Testing",
    "Documentation",
    "Research",
    "Other",
  ],
}) {
  const safeHours = Array.isArray(hours) ? hours : [];

  const total = safeHours.reduce(
    (sum, entry) => sum + (Number(entry?.hours) || 0),
    0
  );

  const maxRow = Math.max(
    ...safeHours.map((entry) => Number(entry?.hours) || 0),
    1
  );

  const progressPercent = Math.min((total / 40) * 100, 100);

  // Allow numbers, decimal point and navigation/control keys only
  const handleKeyDown = (event) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "Enter",
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Allow numbers 0-9
    if (/^[0-9]$/.test(event.key)) {
      return;
    }

    // Allow only one decimal point
    if (event.key === ".") {
      if (event.currentTarget.value.includes(".")) {
        event.preventDefault();
      }

      return;
    }

    // Block everything else
    event.preventDefault();
  };

  return (
    <SectionCard
      number={6}
      title="Hours Worked"
      description="Break down your hours by activity type"
      icon={<ClockCircleOutlined className="text-base text-slate-400" />}
    >
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        {hourTypes.map((type) => {
          const entry = safeHours.find(
            (item) => item?.type === type
          );

          const value = Number(entry?.hours) || 0;

          const inputValue =
            entry?.hours === null ||
            entry?.hours === undefined ||
            entry?.hours === ""
              ? undefined
              : Number(entry.hours);

          const rowPercent = Math.min(
            (value / maxRow) * 100,
            100
          );

          return (
            <div key={type}>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-slate-600">
                  {type}
                </label>

                <span className="text-xs text-slate-400">
                  hours
                </span>
              </div>

              <div className="relative">
                <InputNumber
                  min={0}
                  max={168}
                  step={0.5}
                  value={inputValue}
                  placeholder="0"
                  controls
                  className="!w-full"
                  onKeyDown={handleKeyDown}
                  parser={(inputValue) => {
                    if (
                      inputValue === null ||
                      inputValue === undefined
                    ) {
                      return "";
                    }

                    // Remove letters and special characters
                    let cleaned = String(inputValue).replace(
                      /[^0-9.]/g,
                      ""
                    );

                    // Allow only one decimal point
                    const firstDot = cleaned.indexOf(".");

                    if (firstDot !== -1) {
                      cleaned =
                        cleaned.slice(0, firstDot + 1) +
                        cleaned
                          .slice(firstDot + 1)
                          .replace(/\./g, "");
                    }

                    return cleaned;
                  }}
                  onChange={(newValue) => {
                    // Empty input becomes 0
                    if (
                      newValue === null ||
                      newValue === undefined ||
                      newValue === ""
                    ) {
                      const updatedHours = safeHours.some(
                        (item) => item?.type === type
                      )
                        ? safeHours.map((item) =>
                            item?.type === type
                              ? {
                                  ...item,
                                  hours: 0,
                                }
                              : item
                          )
                        : [
                            ...safeHours,
                            {
                              type,
                              hours: 0,
                            },
                          ];

                      onChange(updatedHours);

                      return;
                    }

                    const numericValue = Number(newValue);

                    // Ignore invalid values
                    if (Number.isNaN(numericValue)) {
                      return;
                    }

                    // Keep value between 0 and 168
                    const safeValue = Math.min(
                      Math.max(numericValue, 0),
                      168
                    );

                    // Update existing activity
                    // or add a new activity
                    const updatedHours = safeHours.some(
                      (item) => item?.type === type
                    )
                      ? safeHours.map((item) =>
                          item?.type === type
                            ? {
                                ...item,
                                hours: safeValue,
                              }
                            : item
                        )
                      : [
                          ...safeHours,
                          {
                            type,
                            hours: safeValue,
                          },
                        ];

                    // Send the complete array to the parent
                    onChange(updatedHours);
                  }}
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  h
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${rowPercent}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Hours */}
      <div className="mt-6 border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-slate-700">
              Total Hours This Week
            </span>

            <p className="mt-0.5 text-xs text-slate-400">
              {total > 40
                ? `${(total - 40).toFixed(
                    1
                  )}h over standard 40h week`
                : `${(40 - total).toFixed(
                    1
                  )}h below standard 40h week`}
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold tabular-nums text-slate-900">
              {total.toFixed(1)}
            </span>

            <span className="ml-1 text-sm text-slate-400">
              h
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-3">
          <Progress
            percent={progressPercent}
            showInfo={false}
            strokeColor={
              total > 40 ? "#f59e0b" : "#3b82f6"
            }
            trailColor="#f1f5f9"
            strokeWidth={8}
          />
        </div>

        {/* Status */}
        <div className="mt-3 flex justify-end">
          {total > 40 ? (
            <Tag
              color="warning"
              className="!m-0"
            >
              Over 40 hours
            </Tag>
          ) : total === 40 ? (
            <Tag
              color="success"
              className="!m-0"
            >
              40 hour target reached
            </Tag>
          ) : (
            <Tag
              color="blue"
              className="!m-0"
            >
              {`${(40 - total).toFixed(
                1
              )}h remaining`}
            </Tag>
          )}
        </div>
      </div>
    </SectionCard>
  );
}