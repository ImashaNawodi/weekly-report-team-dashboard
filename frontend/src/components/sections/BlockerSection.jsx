import SectionCard from "../ui/SectionsCard";

import {
  AlertOutlined,
  PlusOutlined,
  DeleteOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";

import { Button, Input, Radio, Tag, Tooltip, Empty } from "antd";

const { TextArea } = Input;

export default function BlockersSection({
  blockers,
  onAdd,
  onDelete,
  onFieldChange,
  onKeyIssueChange,
  severities = ["Low", "Medium", "High", "Critical"],
}) {
  const getSeverityColor = (severity) => {
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
  };

  return (
    <SectionCard
      number={4}
      title="Blockers / Challenges"
      description="Report obstacles that impacted your work this week"
      icon={<AlertOutlined className="text-base text-slate-400" />}
      actions={
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={onAdd}
          className="!flex !items-center !gap-1"
        >
          Add Blocker
        </Button>
      }
    >
      {blockers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <AlertOutlined className="text-2xl text-slate-300" />
          </div>

          <p className="text-sm font-medium text-slate-600">
            No blockers reported
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Add any challenges that slowed your progress
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            <StarFilled className="text-amber-500" />

            <span>
              Mark one blocker as the{" "}
              <strong className="font-semibold">Key Issue</strong> to highlight
              it to your manager.
            </span>
          </div>

          {blockers.map((blocker, index) => (
            <div
              key={blocker.id}
              className={`rounded-lg border p-4 transition-all ${
                blocker.isKeyIssue
                  ? "border-amber-300 bg-amber-50/30 ring-1 ring-amber-200"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">
                    Blocker {index + 1}
                  </span>

                  {blocker.isKeyIssue && (
                    <Tag
                      color="warning"
                      icon={<StarFilled />}
                      className="!m-0 !flex !items-center !gap-1 !rounded-full !text-[10px] !font-semibold !uppercase"
                    >
                      Key Issue
                    </Tag>
                  )}
                </div>

                <Tooltip title="Remove blocker">
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(blocker.id)}
                    className="!flex !items-center !justify-center"
                  />
                </Tooltip>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Description
                  </label>

                  <TextArea
                    value={blocker.description}
                    onChange={(event) =>
                      onFieldChange(
                        blocker.id,
                        "description",
                        event.target.value,
                      )
                    }
                    placeholder="Describe the blocker or challenge..."
                    rows={3}
                    maxLength={1000}
                    showCount
                    className="!resize-none"
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex-1">
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                      Severity
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {severities.map((severity) => {
                        const isSelected = blocker.severity === severity;

                        return (
                          <Button
                            key={severity}
                            size="small"
                            type={isSelected ? "primary" : "default"}
                            danger={
                              isSelected &&
                              severity.toLowerCase() === "critical"
                            }
                            onClick={() =>
                              onFieldChange(blocker.id, "severity", severity)
                            }
                            className={`!rounded-full !px-3 ${
                              isSelected
                                ? "!font-medium"
                                : "!border-slate-200 !text-slate-500 hover:!border-slate-300"
                            }`}
                          >
                            {severity}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <Radio
                    checked={blocker.isKeyIssue}
                    onChange={() => onKeyIssueChange(blocker.id)}
                    className="!text-sm !text-slate-600"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {blocker.isKeyIssue ? (
                        <StarFilled className="text-amber-500" />
                      ) : (
                        <StarOutlined className="text-slate-400" />
                      )}

                      <span>Mark as Key Issue</span>
                    </span>
                  </Radio>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
