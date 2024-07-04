import axios from "axios";

export const downloadFile = async (url: string, fileName: string) => {
  try {
    const response = await axios.get(url, {
      responseType: "blob", // Set the response type to blob
    });

    // Create a temporary URL for the blob
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

    // Create a link element
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", fileName);

    // Append the link to the body
    document.body.appendChild(link);

    // Click the link to trigger the download
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);

    // Revoke the blob URL
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Failed to download file:", error);
  }
};
