import SectionCard from "../ui/SectionsCard";

import {
  CheckSquareOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { Button, Input, InputNumber, Select, Tooltip } from "antd";

export default function TasksCompletedSection({
  tasks = [],
  onAdd,
  onEdit,
  onDelete,
  onFieldChange,
  taskStatuses = ["Not Started", "In Progress", "Completed"],
  priorities = ["Low", "Medium", "High"],
}) {
  const handleNumberKeyDown = (event) => {
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

    if (/^[0-9]$/.test(event.key)) {
      return;
    }

    if (event.key === ".") {
      return;
    }

    event.preventDefault();
  };

  const handleNumberPaste = (event) => {
    const pastedText = event.clipboardData.getData("text");

    if (!/^\d*\.?\d*$/.test(pastedText)) {
      event.preventDefault();
    }
  };

  const getNumberValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return 0;
    }

    const number = Number(value);

    return Number.isNaN(number) ? 0 : number;
  };

  return (
    <SectionCard
      number={2}
      title="Tasks Assigned"
      description="Log tasks worked on this week with progress and time tracking"
      icon={<CheckSquareOutlined className="text-base text-slate-400" />}
      actions={
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={onAdd}
          className="!flex !items-center !gap-1"
        >
          Add Task
        </Button>
      }
    >
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <CheckSquareOutlined className="text-2xl text-slate-300" />
          </div>

          <p className="text-sm font-medium text-slate-600">
            No tasks added yet
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Click "Add Task" to log your first task
          </p>
        </div>
      ) : (
        <>
          <div className="-mx-6 hidden overflow-x-auto px-6 lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Task Name <span className="text-red-500">*</span>
                  </th>

                  <th className="px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Priority
                  </th>

                  <th className="px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Planned %
                  </th>

                  <th className="px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actual %
                  </th>

                  <th className="px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-2 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Planned Time
                  </th>

                  <th className="px-2 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Time Spent
                  </th>

                  <th className="px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Output / Deliverable
                  </th>

                  <th className="px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="group border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="px-2 py-2.5">
                      <Input
                        variant="borderless"
                        value={task.name}
                        onChange={(event) =>
                          onFieldChange(task.id, "name", event.target.value)
                        }
                        placeholder="Task name..."
                        className="!px-1.5 !font-medium !text-slate-800"
                      />
                    </td>

                    <td className="px-2 py-2.5">
                      <Select
                        value={task.priority}
                        onChange={(value) =>
                          onFieldChange(task.id, "priority", value)
                        }
                        size="small"
                        className="!min-w-[100px]"
                        options={priorities.map((priority) => ({
                          label: priority,
                          value: priority,
                        }))}
                      />
                    </td>

                    <td className="px-2 py-2.5 text-center">
                      <InputNumber
                        min={0}
                        max={100}
                        step={1}
                        precision={0}
                        value={Number(task.plannedPct) || 0}
                        size="small"
                        className="!w-16"
                        controls
                        onKeyDown={handleNumberKeyDown}
                        onPaste={handleNumberPaste}
                        parser={(value) =>
                          String(value ?? "").replace(/[^0-9]/g, "")
                        }
                        onChange={(value) => {
                          const number = getNumberValue(value);

                          const safeValue = Math.min(Math.max(number, 0), 100);

                          onFieldChange(task.id, "plannedPct", safeValue);
                        }}
                      />
                    </td>

                    <td className="px-2 py-2.5 text-center">
                      <InputNumber
                        min={0}
                        max={100}
                        step={1}
                        precision={0}
                        value={Number(task.actualPct) || 0}
                        size="small"
                        className="!w-16"
                        controls
                        onKeyDown={handleNumberKeyDown}
                        onPaste={handleNumberPaste}
                        parser={(value) =>
                          String(value ?? "").replace(/[^0-9]/g, "")
                        }
                        onChange={(value) => {
                          const number = getNumberValue(value);

                          const safeValue = Math.min(Math.max(number, 0), 100);

                          onFieldChange(task.id, "actualPct", safeValue);
                        }}
                      />
                    </td>

                    <td className="px-2 py-2.5">
                      <Select
                        value={task.status}
                        onChange={(value) =>
                          onFieldChange(task.id, "status", value)
                        }
                        size="small"
                        className="!min-w-[120px]"
                        options={taskStatuses.map((status) => ({
                          label: status,
                          value: status,
                        }))}
                      />
                    </td>

                    <td className="px-2 py-2.5 text-right">
                      <InputNumber
                        min={0}
                        step={0.5}
                        value={Number(task.plannedTime) || 0}
                        size="small"
                        className="!w-20"
                        controls
                        onKeyDown={handleNumberKeyDown}
                        onPaste={handleNumberPaste}
                        parser={(value) =>
                          String(value ?? "").replace(/[^0-9.]/g, "")
                        }
                        onChange={(value) =>
                          onFieldChange(
                            task.id,
                            "plannedTime",
                            getNumberValue(value),
                          )
                        }
                      />
                    </td>

                    <td className="px-2 py-2.5 text-right">
                      <InputNumber
                        min={0}
                        step={0.5}
                        value={Number(task.timeSpent) || 0}
                        size="small"
                        className="!w-20"
                        controls
                        onKeyDown={handleNumberKeyDown}
                        onPaste={handleNumberPaste}
                        parser={(value) =>
                          String(value ?? "").replace(/[^0-9.]/g, "")
                        }
                        onChange={(value) =>
                          onFieldChange(
                            task.id,
                            "timeSpent",
                            getNumberValue(value),
                          )
                        }
                      />
                    </td>

                    <td className="px-2 py-2.5">
                      <Input
                        variant="borderless"
                        value={task.output}
                        onChange={(event) =>
                          onFieldChange(task.id, "output", event.target.value)
                        }
                        placeholder="Deliverable..."
                        className="!px-1.5 !text-xs !text-slate-600"
                      />
                    </td>

                    <td className="px-2 py-2.5">
                      <div className="flex items-center justify-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Tooltip title="Edit">
                          <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(task.id)}
                            className="!flex !items-center !justify-center !text-slate-400 hover:!bg-blue-50 hover:!text-blue-600"
                          />
                        </Tooltip>

                        <Tooltip title="Delete">
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => onDelete(task.id)}
                            className="!flex !items-center !justify-center"
                          />
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 lg:hidden">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/30 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <Input
                    value={task.name}
                    onChange={(event) =>
                      onFieldChange(task.id, "name", event.target.value)
                    }
                    placeholder="Task name..."
                    className="flex-1"
                  />

                  <div className="flex gap-1">
                    <Tooltip title="Edit">
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(task.id)}
                        className="!text-slate-400 hover:!bg-blue-50 hover:!text-blue-600"
                      />
                    </Tooltip>

                    <Tooltip title="Delete">
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(task.id)}
                      />
                    </Tooltip>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-slate-400">
                      Priority
                    </label>

                    <Select
                      value={task.priority}
                      onChange={(value) =>
                        onFieldChange(task.id, "priority", value)
                      }
                      className="!w-full"
                      size="small"
                      options={priorities.map((priority) => ({
                        label: priority,
                        value: priority,
                      }))}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-slate-400">
                      Status
                    </label>

                    <Select
                      value={task.status}
                      onChange={(value) =>
                        onFieldChange(task.id, "status", value)
                      }
                      className="!w-full"
                      size="small"
                      options={taskStatuses.map((status) => ({
                        label: status,
                        value: status,
                      }))}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-slate-400">
                      Planned %
                    </label>

                    <InputNumber
                      min={0}
                      max={100}
                      step={1}
                      precision={0}
                      value={Number(task.plannedPct) || 0}
                      className="!w-full"
                      controls
                      onKeyDown={handleNumberKeyDown}
                      onPaste={handleNumberPaste}
                      parser={(value) =>
                        String(value ?? "").replace(/[^0-9]/g, "")
                      }
                      onChange={(value) => {
                        const number = getNumberValue(value);

                        const safeValue = Math.min(Math.max(number, 0), 100);

                        onFieldChange(task.id, "plannedPct", safeValue);
                      }}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-slate-400">
                      Actual %
                    </label>

                    <InputNumber
                      min={0}
                      max={100}
                      step={1}
                      precision={0}
                      value={Number(task.actualPct) || 0}
                      className="!w-full"
                      controls
                      onKeyDown={handleNumberKeyDown}
                      onPaste={handleNumberPaste}
                      parser={(value) =>
                        String(value ?? "").replace(/[^0-9]/g, "")
                      }
                      onChange={(value) => {
                        const number = getNumberValue(value);

                        const safeValue = Math.min(Math.max(number, 0), 100);

                        onFieldChange(task.id, "actualPct", safeValue);
                      }}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-slate-400">
                      Planned Time (h)
                    </label>

                    <InputNumber
                      min={0}
                      step={0.5}
                      value={Number(task.plannedTime) || 0}
                      className="!w-full"
                      controls
                      onKeyDown={handleNumberKeyDown}
                      onPaste={handleNumberPaste}
                      parser={(value) =>
                        String(value ?? "").replace(/[^0-9.]/g, "")
                      }
                      onChange={(value) =>
                        onFieldChange(
                          task.id,
                          "plannedTime",
                          getNumberValue(value),
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-slate-400">
                      Time Spent (h)
                    </label>

                    <InputNumber
                      min={0}
                      step={0.5}
                      value={Number(task.timeSpent) || 0}
                      className="!w-full"
                      controls
                      onKeyDown={handleNumberKeyDown}
                      onPaste={handleNumberPaste}
                      parser={(value) =>
                        String(value ?? "").replace(/[^0-9.]/g, "")
                      }
                      onChange={(value) =>
                        onFieldChange(
                          task.id,
                          "timeSpent",
                          getNumberValue(value),
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-400">
                    Output / Deliverable
                  </label>

                  <Input
                    value={task.output}
                    onChange={(event) =>
                      onFieldChange(task.id, "output", event.target.value)
                    }
                    placeholder="Deliverable..."
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </SectionCard>
  );
}
