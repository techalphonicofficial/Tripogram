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
