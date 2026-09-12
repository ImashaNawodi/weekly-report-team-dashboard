const { z } = require("zod");

const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  teamMembers: z
    .array(z.string())
    .optional(),
});

module.exports = {
  createProjectSchema,
};