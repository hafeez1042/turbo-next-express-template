export const sanitizeFileName = (fileName: string): string => {
  // Replace non-ISO-8859-1 characters with a safe character or remove them
  return fileName.replace(/[^\x00-\x7F]/g, '_');
}