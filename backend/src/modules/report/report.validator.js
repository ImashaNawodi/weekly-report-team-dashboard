const { z } = require("zod");

const createReportSchema = z.object({
  project: z
    .string()
    .min(1, "Project is required"),

  weekStart: z
    .string()
    .min(1, "Week start is required"),

  weekEnd: z
    .string()
    .min(1, "Week end is required"),

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
  project: z
    .string()
    .min(1)
    .optional(),

  weekStart: z
    .string()
    .min(1)
    .optional(),

  weekEnd: z
    .string()
    .min(1)
    .optional(),

  workCompleted: z
    .string()
    .trim()
    .min(1)
    .max(5000)
    .optional(),

  plannedWork: z
    .string()
    .trim()
    .min(1)
    .max(5000)
    .optional(),

  blockers: z
    .string()
    .trim()
    .max(3000)
    .optional(),
});

const reviewReportSchema = z.object({
  feedback: z
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