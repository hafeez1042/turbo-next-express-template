export const fetchBlobFromUrl = async (blobUrl: string) => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return blob;
};
