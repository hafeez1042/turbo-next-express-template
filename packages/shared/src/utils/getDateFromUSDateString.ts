export const getDateFromUSDateString = (usDate: string): Date => {
  // Split the date string into month, day, and year parts
  const [month, day, year] = usDate.split("/").map(Number);

  if (!month || !day || !year) throw Error("Invalid date");

  // Create a new Date object (Note: months in JavaScript Date are zero-indexed)
  return new Date(year, month - 1, day);
};
