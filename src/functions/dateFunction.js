export const convertMyDate = (date) => {
  const options = { day: "2-digit", month: "short", year: "numeric" };

  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
  return formattedDate;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formatted = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
  return formatted.replace(" ", ", ");
};

export const isUpcomingBatch = (batchOrDate) => {
  const rawDate =
    typeof batchOrDate === "object" && batchOrDate !== null
      ? batchOrDate.start_date
      : batchOrDate;
  if (!rawDate) return false;

  const datePart = String(rawDate).split("T")[0].split(" ")[0];
  const parts = datePart.split("-").map(Number);
  let batchTime;
  if (parts.length === 3 && !parts.some(isNaN)) {
    batchTime = new Date(parts[0], parts[1] - 1, parts[2]).getTime();
  } else {
    const parsed = new Date(rawDate);
    if (isNaN(parsed.getTime())) return false;
    batchTime = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()).getTime();
  }

  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return batchTime >= todayMidnight;
};

export const filterUpcomingDates = (dates = []) => {
  if (!Array.isArray(dates)) return [];
  return dates.filter(isUpcomingBatch);
};
