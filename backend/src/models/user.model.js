const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema(
  {
    userID: {
      type: Number,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["TEAM_MEMBER", "MANAGER", "ADMIN"],
      set: (value) => value.toUpperCase(),
      default: "TEAM_MEMBER",
    },
    profileColor: {
      type: String,
      default: "#2563EB",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(AutoIncrement, { inc_field: "userID" });

module.exports = mongoose.model("User", userSchema);
