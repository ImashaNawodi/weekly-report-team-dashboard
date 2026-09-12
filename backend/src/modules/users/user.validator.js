const { z } = require("zod");

const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .optional(),
});

const updateRoleSchema = z.object({
  role: z.enum(["TEAM_MEMBER", "MANAGER", "ADMIN"], {
    message: "Invalid role",
  }),
});

const updateUserStatusSchema = z.object({
  isActive: z.boolean({
    message: "isActive must be true or false",
  }),
});

module.exports = {
  updateProfileSchema,
  updateRoleSchema,
  updateUserStatusSchema,
};