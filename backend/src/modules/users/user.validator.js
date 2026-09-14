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

  email: z
    .string()
    .trim()
    .lowercase()
    .email("Please provide a valid email address"),
});

const updateRoleSchema = z.object({
  role: z
    .string()
    .transform((value) => value.toUpperCase())
    .pipe(
      z.enum(["TEAM_MEMBER", "MANAGER", "ADMIN"], {
        message: "Invalid role",
      }),
    ),
});

const updateUserStatusSchema = z.object({
  userAccountID: z.string(),
  isActive: z.boolean({
    message: "isActive must be true or false",
  }),
});

module.exports = {
  updateProfileSchema,
  updateRoleSchema,
  updateUserStatusSchema,
};
