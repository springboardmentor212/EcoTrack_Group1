const DAY_MS = 24 * 60 * 60 * 1000;

export const CATEGORIES = [
  "transportation",
  "energy",
  "food",
  "waste",
  "water",
];

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

export const toInputDate = (value) =>
  value ? new Date(value).toISOString().slice(0, 10) : "";

export const getDurationLabel = (challenge) => {
  const days = Math.max(
    1,
    Math.ceil(
      (new Date(challenge.endDate) - new Date(challenge.startDate)) / DAY_MS,
    ),
  );
  return `${days} ${days === 1 ? "day" : "days"}`;
};
