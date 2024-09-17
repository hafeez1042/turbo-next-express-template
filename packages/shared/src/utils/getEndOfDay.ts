import { endOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

export const getEndOfDay = (date: Date, timeZone: string): Date => {
  return fromZonedTime(endOfDay(date), timeZone);
};
