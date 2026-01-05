import axios from "axios";

export const downloadExcelFile = async (url: string) => {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 30000,
    });
    return response.data;
  } catch (error: any) {
    console.error(`[RBA] Failed to download file from ${url}:`, error.message);
    return null;
  }
};