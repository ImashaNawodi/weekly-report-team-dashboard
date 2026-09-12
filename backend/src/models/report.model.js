const mongoose = require("mongoose");

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

    workCompleted: {
      type: String,
      required: true,
    },

    plannedWork: {
      type: String,
      required: true,
    },

    blockers: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
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

    weekStart: {
      type: Date,
      required: true,
    },

    weekEnd: {
      type: Date,
      required: true,
    },

    workCompleted: {
      type: String,
      required: true,
      trim: true,
    },

    plannedWork: {
      type: String,
      required: true,
      trim: true,
    },

    blockers: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "DRAFT",
        "SUBMITTED",
        "NEEDS_CORRECTION",
        "APPROVED",
      ],
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
  }
);

reportSchema.index({
  user: 1,
  weekStart: 1,
});

reportSchema.index({
  project: 1,
  weekStart: 1,
});

reportSchema.index({
  status: 1,
});

module.exports = mongoose.model("Report", reportSchema);