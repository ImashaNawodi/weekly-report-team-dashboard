import { Plus, Trash2, ClipboardList } from "lucide-react";
import { Button, Input, Select, Empty } from "antd";

import SectionCard from "../ui/SectionsCard";
import Badge from "../ui/Badge";

import {
  PRIORITIES,
  PRIORITY_STYLES,
} from "../../helpers/Constants";

const createTaskId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export default function PlannedTasksSection({
  plannedTasks = [],
  onChange,
}) {
  const safeTasks = Array.isArray(plannedTasks)
    ? plannedTasks
    : [];

  const handleAddTask = () => {
    const newTask = {
      id: createTaskId(),
      description: "",
      priority: "Medium",
      expectedOutcome: "",
    };

    onChange([...safeTasks, newTask]);
  };

  const handleUpdateTask = (index, field, value) => {
    const updatedTasks = safeTasks.map((task, taskIndex) =>
      taskIndex === index
        ? {
            ...task,
            [field]: value,
          }
        : task
    );

    onChange(updatedTasks);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = safeTasks.filter(
      (_, taskIndex) => taskIndex !== index
    );

    onChange(updatedTasks);
  };

  return (
    <SectionCard
      number="3"
      title="Tasks Planned for Next Week"
      description="Define the work you plan to complete next week."
      icon={
        <ClipboardList
          size={16}
          className="text-slate-400"
        />
      }
      actions={
        <Button
          type="primary"
          size="small"
          icon={<Plus size={15} />}
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      }
    >
      {safeTasks.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No planned tasks added yet"
        >
          <Button
            type="primary"
            icon={<Plus size={15} />}
            onClick={handleAddTask}
          >
            Add Planned Task
          </Button>
        </Empty>
      ) : (
        <div className="space-y-4">
          {safeTasks.map((task, index) => (
            <div
              key={task.id || index}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    label={`Task ${index + 1}`}
                    className="bg-blue-50 text-blue-700"
                  />

                  <Badge
                    label={task.priority || "Medium"}
                    className={
                      PRIORITY_STYLES[
                        task.priority || "Medium"
                      ]
                    }
                  />
                </div>

                <Button
                  type="text"
                  danger
                  icon={<Trash2 size={16} />}
                  onClick={() => handleDeleteTask(index)}
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium text-slate-600">
                  Task Description
                </label>

                <Input.TextArea
                  value={task.description || ""}
                  onChange={(event) =>
                    handleUpdateTask(
                      index,
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Describe the task you plan to complete..."
                  rows={3}
                  maxLength={1000}
                  showCount
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-600">
                    Priority
                  </label>

                  <Select
                    value={task.priority || "Medium"}
                    onChange={(value) =>
                      handleUpdateTask(
                        index,
                        "priority",
                        value
                      )
                    }
                    className="!w-full"
                    options={PRIORITIES.map((priority) => ({
                      label: priority,
                      value: priority,
                    }))}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-600">
                    Expected Outcome
                  </label>

                  <Input
                    value={task.expectedOutcome || ""}
                    onChange={(event) =>
                      handleUpdateTask(
                        index,
                        "expectedOutcome",
                        event.target.value
                      )
                    }
                    placeholder="What should be achieved?"
                    maxLength={500}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}