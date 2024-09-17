import { startOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

export const getStartOfDay = (date: Date, timeZone: string): Date => {
  return fromZonedTime(startOfDay(date), timeZone);
};
