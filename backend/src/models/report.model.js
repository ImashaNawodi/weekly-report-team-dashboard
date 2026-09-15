const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    plannedPct: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    actualPct: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed", "Blocked"],
      default: "Not Started",
    },

    plannedTime: {
      type: Number,
      min: 0,
      default: 0,
    },

    timeSpent: {
      type: Number,
      min: 0,
      default: 0,
    },

    output: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: true,
  },
);

const plannedTaskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    expectedOutcome: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: true,
  },
);

const blockerSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },

    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    isKeyIssue: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  },
);

const achievementSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },

    isKeyAchievement: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  },
);

const hoursEntrySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },

    hours: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const reportVersionSchema = new mongoose.Schema(
  {
    versionNumber: {
      type: Number,
      required: true,
    },

    submittedAt: {
      type: Date,
      required: true,
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tasks: {
      type: [taskSchema],
      default: [],
    },

    plannedTasks: {
      type: [plannedTaskSchema],
      default: [],
    },

    blockers: {
      type: [blockerSchema],
      default: [],
    },

    achievements: {
      type: [achievementSchema],
      default: [],
    },

    hours: {
      type: [hoursEntrySchema],
      default: [],
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    links: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["SUBMITTED", "APPROVED", "NEEDS_CORRECTION"],
      required: true,
    },
  },
  {
    _id: false,
  },
);

const reportSchema = new mongoose.Schema(
  {
    reportNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    weekNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    weekStart: {
      type: Date,
      required: true,
    },

    weekEnd: {
      type: Date,
      required: true,
    },

    tasks: {
      type: [taskSchema],
      default: [],
    },

    plannedTasks: {
      type: [plannedTaskSchema],
      default: [],
    },

    blockers: {
      type: [blockerSchema],
      default: [],
    },

    achievements: {
      type: [achievementSchema],
      default: [],
    },

    hours: {
      type: [hoursEntrySchema],
      default: [],
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    links: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "NEEDS_CORRECTION", "APPROVED"],
      default: "DRAFT",
    },

    managerFeedback: {
      type: String,
      trim: true,
      default: "",
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    versions: {
      type: [reportVersionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

reportSchema.index(
  {
    user: 1,
    weekStart: 1,
  },
  {
    unique: true,
  },
);

reportSchema.index({
  user: 1,
  weekStart: -1,
});

reportSchema.index({
  project: 1,
  weekStart: -1,
});

reportSchema.index({
  status: 1,
});

module.exports = mongoose.model("Report", reportSchema);
