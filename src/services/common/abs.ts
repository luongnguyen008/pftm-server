import xlsx from "xlsx";
import dayjs from "dayjs";
import pc from "picocolors";
import { downloadExcelFile } from "../../lib/excel";
import { excelTimestampToUnix, formatMonthyear } from "../../lib/time";
import {
  COUNTRY_CODE,
  Currency,
  FREQUENCY,
  INDICATOR_TYPE,
  IndicatorValue,
  UNIT,
} from "../../types";
import { numberFormatter } from "../../lib/number-formatter";

interface TargetSeries {
  pathName: string;
  fileName: string;
  seriesId: string;
  frequency: FREQUENCY;
  country: COUNTRY_CODE;
  indicatorType: INDICATOR_TYPE;
  unit?: UNIT;
  currency?: Currency;
}

export const getDataABS = async (targetSeries: TargetSeries): Promise<IndicatorValue[]> => {
  try {
    const excelData = await findExcelFileABS(
      targetSeries.pathName,
      targetSeries.fileName,
    );
    if (!excelData) return [];

    const result = await readExcelFileABS(excelData, targetSeries);
    return result || [];
  } catch (error) {
    console.error("Error downloading or reading the Excel file:", error);
    return [];
  }
};

/**
 * Function to find the Excel file by iterating backwards through months
 */
async function findExcelFileABS(
  filePath: string,
  excelFileName: string
): Promise<Buffer | null> {
  const baseUrl = "https://www.abs.gov.au/statistics";
  let currentDate = dayjs();

  for (let i = 0; i < 12; i++) {
    const formattedDate = formatMonthyear(currentDate);
    const fileUrl = `${baseUrl}/${filePath}/${formattedDate}/${excelFileName}`;

    const fileData = await downloadExcelFile(fileUrl);
    if (fileData) {
      console.log(pc.green(`Successfully downloaded file for ${formattedDate} from ${fileUrl}`));
      return fileData;
    }

    currentDate = currentDate.subtract(1, "month");
  }

  console.log("No available files found for the specified months.");
  return null;
}

/**
 * Function to read the ABS Excel file and extract series data
 */
async function readExcelFileABS(data: Buffer, metadata: TargetSeries): Promise<IndicatorValue[]> {
  try {
    if (!data) return [];
    const { seriesId, country, indicatorType, frequency, unit } = metadata;

    // Create a workbook from the downloaded data
    const workbook = xlsx.read(data, { type: "buffer" });

    // Get the second sheet (usually Data1 in ABS files)
    const secondSheetName = workbook.SheetNames[1];
    if (!secondSheetName) {
      console.warn("[ABS] Second sheet (Data1) not found in workbook");
      return [];
    }

    const worksheet = workbook.Sheets[secondSheetName];

    // Convert the worksheet to JSON (array of arrays for easier header management)
    const jsonDataRaw = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    if (!jsonDataRaw || jsonDataRaw.length === 0) {
      console.warn("[ABS] Excel file is empty");
      return [];
    }

    // In ABS Data sheets, Series IDs are typically in row 10 (index 9)
    // We search for a row that contains our target seriesId.
    let seriesIdRow: any[] | undefined;
    let dataStartIndex = -1;

    // Typically headers are in the first 50 rows
    const searchLimit = Math.min(jsonDataRaw.length, 50);
    for (let i = 0; i < searchLimit; i++) {
      const row = jsonDataRaw[i];
      // ABS header rows usually have "Series ID" in the first column or contain the seriesId in the row
      if (row && (row[0] === "Series ID" || row.includes(seriesId))) {
        seriesIdRow = row;
        dataStartIndex = i + 1;
        break;
      }
    }

    if (!seriesIdRow) {
      console.warn(`[ABS] Series ID ${seriesId} header row not found`);
      return [];
    }

    const columnIndex = seriesIdRow.indexOf(seriesId);
    if (columnIndex === -1) {
      console.warn(`[ABS] Series ID ${seriesId} not found in header row`);
      return [];
    }

    const result: IndicatorValue[] = [];

    // Process from the start index to the end
    for (let i = dataStartIndex; i < jsonDataRaw.length; i++) {
      const row = jsonDataRaw[i];
      if (!row || row.length <= columnIndex) continue;

      const rawDate = row[0];
      const value = row[columnIndex];

      // Data rows have numeric Excel dates in the first column
      if (typeof rawDate === "number" && value !== null && value !== undefined && value !== "") {
        const numericValue = Number(value);
        if (!isNaN(numericValue)) {
          result.push({
            country,
            indicator_type: indicatorType,
            frequency,
            unit,
            timestamp: excelTimestampToUnix(rawDate),
            actual: Number(numericValue.toFixed(1)),
            actual_formatted: numberFormatter(numericValue, { decimals: 1 }),
          });
        }
      }
    }

    return result;
  } catch (error) {
    console.error(
      "[ABS] Error reading Excel file:",
      error instanceof Error ? error.message : error
    );
    return [];
  }
}
