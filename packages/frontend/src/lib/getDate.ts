export const getDate = (date: Date): string =>
  date.toLocaleDateString("en-US").split("/").map(formatToTwoDigits).join("/");

const formatToTwoDigits = (value: string) => {
  // Convert the value to a string
  let strValue = value.toString();

  // Pad with leading zero if necessary
  if (strValue.length < 2) {
    strValue = "0" + strValue;
  }

  return strValue;
};
