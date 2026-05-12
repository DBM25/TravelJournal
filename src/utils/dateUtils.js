import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";


export const formatDate = (dateString, formatStr = "MMM d, yyyy") => {
  try {
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};


export const formatDateTime = (dateString) => {
  return formatDate(dateString, "MMM d, yyyy 'at' h:mm a");
};


export const getRelativeTime = (dateString) => {
  try {
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error getting relative time:", error);
    return "Unknown time";
  }
};


export const getSmartDateFormat = (dateString) => {
  try {
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;

    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`;
    }

    if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")}`;
    }

    return formatDateTime(dateString);
  } catch (error) {
    console.error("Error formatting smart date:", error);
    return "Invalid date";
  }
};
