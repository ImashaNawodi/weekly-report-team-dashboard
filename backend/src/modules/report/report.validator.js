const { z } = require("zod");

const createReportSchema = z.object({
  project: z.string().min(1, "Project is required"),
  weekNumber: z.coerce
    .number()
    .int()
    .min(1, "Week number must be at least 1")
    .max(10, "Week number cannot exceed 10"),
  weekStart: z.string().min(1, "Week start is required"),

  weekEnd: z.string().min(1, "Week end is required"),

  workCompleted: z
    .string()
    .trim()
    .min(1, "Work completed is required")
    .max(5000, "Work completed cannot exceed 5000 characters"),

  plannedWork: z
    .string()
    .trim()
    .min(1, "Planned work is required")
    .max(5000, "Planned work cannot exceed 5000 characters"),

  blockers: z
    .string()
    .trim()
    .max(3000, "Blockers cannot exceed 3000 characters")
    .optional(),
});

const updateReportSchema = z.object({
  reportID: z.string().min(1, "Report ID is required"),

  project: z.string().min(1).optional(),

  weekNumber: z.coerce.number().int().min(1).max(10).optional(),
  weekStart: z.string().min(1).optional(),

  weekEnd: z.string().min(1).optional(),

  workCompleted: z.string().trim().min(1).max(5000).optional(),

  plannedWork: z.string().trim().min(1).max(5000).optional(),

  blockers: z.string().trim().max(3000).optional(),
});

const reviewReportSchema = z.object({
  reportID: z.string().min(1, "Report ID is required"),
  managerFeedback: z
    .string()
    .trim()
    .max(3000, "Feedback cannot exceed 3000 characters")
    .optional(),
});

module.exports = {
  createReportSchema,
  updateReportSchema,
  reviewReportSchema,
};
