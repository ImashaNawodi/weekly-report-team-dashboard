const userModel = require("../models/user.model");

const PROFILE_COLORS = [
  "#2563EB",
  "#7C3AED",
  "#DB2777",
  "#DC2626",
  "#EA580C",
  "#D97706",
  "#16A34A",
  "#059669",
  "#0891B2",
  "#4F46E5",
  "#9333EA",
  "#C026D3",
];

const assignProfileColor = async () => {
  const users = await userModel.find(
    {},
    { profileColor: 1, _id: 0 }
  );

  const usedColors = users
    .map((user) => user.profileColor)
    .filter(Boolean);

  const availableColors = PROFILE_COLORS.filter(
    (color) => !usedColors.includes(color)
  );

  if (availableColors.length > 0) {
    return availableColors[
      Math.floor(Math.random() * availableColors.length)
    ];
  }

  return PROFILE_COLORS[
    Math.floor(Math.random() * PROFILE_COLORS.length)
  ];
};

module.exports = {
  assignProfileColor,
};