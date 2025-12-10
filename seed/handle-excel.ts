import * as XLSX from "xlsx";
import { toTimestamp } from "../src/lib/time";

export async function handleExcel(url: string) {
  console.log(`Downloading Excel file from: ${url}`);
  try {
    console.log("Starting to download Excel file...");
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    // Converting to Buffer to maintain compatibility with 'buffer' type if needed,
    // but XLSX supports 'array' for ArrayBuffer.
    // However, to be safe and close to original behavior (which used Buffer from axios):
    const buffer = Buffer.from(arrayBuffer);
    const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
    const sheet = workbook.Sheets["FaceValue"];

    // Parse with header: 'A' to access columns by letter key (e.g. 'AL')
    const data = XLSX.utils.sheet_to_json(sheet, { header: "A" });

    const alColumn = (data as any[]).map((row) => row["AL"]);
    const aColumn = (data as any[]).map((row) => {
      const val = row["A"];
      if (val instanceof Date) {
        const offset = val.getTimezoneOffset() * 60000;
        const localDate = new Date(val.getTime() - offset);
        return toTimestamp(localDate);
      }
      return val;
    });
    console.log("AL Column Data:", alColumn);
    console.log("A Column Data:", aColumn);
  } catch (error) {
    console.error("Error handling Excel file:", error);
  }
}
