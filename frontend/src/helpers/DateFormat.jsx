const generateWeeks = (projectStartDate) => {
  const startDate = dayjs(projectStartDate).startOf("day");

  if (!startDate.isValid()) {
    return [];
  }

  return Array.from({ length: 10 }, (_, index) => {
    const weekStart = startDate.add(index * 7, "day");
    const weekEnd = weekStart.add(6, "day");

    return {
      weekNumber: index + 1,
      weekStart,
      weekEnd,
      label: `${weekStart.format("DD MMM YYYY")} - ${weekEnd.format(
        "DD MMM YYYY"
      )}`,
    };
  });
};