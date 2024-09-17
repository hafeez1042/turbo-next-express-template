export const isValidFileName = (fileName: string): boolean => {
  // Define a regex pattern for invalid characters (non-ISO-8859-1 and common invalid file name characters)
  const validISO88591Chars = /^[\x00-\xFF]+$/;


  // Test if the file name contains any invalid characters
  return validISO88591Chars.test(fileName);
};
