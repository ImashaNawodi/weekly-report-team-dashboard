export const TASK_STATUSES = [
  "Not Started",
  "In Progress",
  "Completed",
  "Blocked",
];

export const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export const SEVERITIES = ["Low", "Medium", "High"];

export const REPORT_STATUSES = [
  "Draft",
  "In Review",
  "Approved",
  "Changes Requested",
];

export const PROJECTS = [
  "Atlas Mobile App",
  "Orion Web Platform",
  "Data Pipeline Migration",
  "Customer Portal Redesign",
  "Internal DevOps Tooling",
  "API Gateway Refactor",
  "Security Audit Q3",
];

export const HOUR_TYPES = [
  "Development",
  "Testing",
  "Meetings",
  "Documentation",
  "Other",
];

export const STATUS_STYLES = {
  "Not Started": "bg-slate-100 text-slate-600 border border-slate-200",

  "In Progress": "bg-blue-50 text-blue-700 border border-blue-200",

  Completed: "bg-green-50 text-green-700 border border-green-200",

  Blocked: "bg-red-50 text-red-700 border border-red-200",
};

export const PRIORITY_STYLES = {
  Low: "bg-slate-100 text-slate-600",

  Medium: "bg-blue-50 text-blue-700",

  High: "bg-amber-50 text-amber-700",

  Critical: "bg-red-50 text-red-700",
};

export const SEVERITY_STYLES = {
  Low: "bg-slate-100 text-slate-600",

  Medium: "bg-amber-50 text-amber-700",

  High: "bg-red-50 text-red-700",
};

export const REPORT_STATUS_STYLES = {
  Draft: "bg-slate-100 text-slate-700 border border-slate-200",

  "In Review": "bg-blue-50 text-blue-700 border border-blue-200",

  Approved: "bg-green-50 text-green-700 border border-green-200",

  "Changes Requested": "bg-amber-50 text-amber-700 border border-amber-200",
};
