import { format } from "date-fns";

export const getReadableDate = (date: Date) => {
  return format(date, "MMM dd, yyyy, hh:mm a");
};
