import xlsx from "xlsx";
import { getDateNowString, excelTimestampToUnix } from "../../lib/time";
import { COUNTRY_CODE, INDICATOR_TYPE, FREQUENCY, UNIT, IndicatorValue } from "../../types";
import { numberFormatter } from "../../lib/number-formatter";
import { downloadExcelFile } from "../../lib/excel";

interface IRBAData {
  fileName: string;
  seriesId: string;
  country: COUNTRY_CODE;
  indicatorType: INDICATOR_TYPE;
  frequency: FREQUENCY;
  unit: UNIT;
}

export const fetchRBAData = async (data: IRBAData): Promise<IndicatorValue[]> => {
  try {
    const { fileName } = data;
    const url = `https://www.rba.gov.au/statistics/tables/xls/${fileName}?v=${getDateNowString()}`;
    const excelData = await downloadExcelFile(url);

    if (!excelData) {
      return [];
    }

    return await readExcelFileRBA(excelData, data);
  } catch (error) {
    console.error("[RBA] Error in fetchRBAData:", error instanceof Error ? error.message : error);
    return [];
  }
};

type ExcelRow = (number | string | null)[];

async function readExcelFileRBA(data: Buffer, metadata: IRBAData): Promise<IndicatorValue[]> {
  try {
    const { seriesId, country, indicatorType, frequency, unit } = metadata;
    const workbook = xlsx.read(data, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonDataRaw = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as ExcelRow[];

    if (!jsonDataRaw || jsonDataRaw.length === 0) {
      console.warn("[RBA] Excel file is empty");
      return [];
    }

    // Performance: We only need to find the header row and then process data.
    let seriesIdRow: ExcelRow | undefined;
    let dataStartIndex = -1;

    // Typically headers are in the first 50 rows
    const searchLimit = Math.min(jsonDataRaw.length, 50);
    for (let i = 0; i < searchLimit; i++) {
      const row = jsonDataRaw[i];
      if (row && row[0] === "Series ID") {
        seriesIdRow = row;
        // In RBA files, data usually starts after a fixed number of header rows (e.g., 11 rows after filtering)
        // However, a more robust way is to skip non-numeric rows after finding headers.
        dataStartIndex = i + 1;
        break;
      }
    }

    if (!seriesIdRow) {
      console.warn("[RBA] Series ID row not found in data");
      return [];
    }

    const columnIndex = seriesIdRow.indexOf(seriesId);
    if (columnIndex === -1) {
      console.warn(`[RBA] Series ID ${seriesId} not found in header row`);
      return [];
    }

    const seriesData: IndicatorValue[] = [];

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
          seriesData.push({
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

    return seriesData;
  } catch (error) {
    console.error(
      "[RBA] Error reading Excel file:",
      error instanceof Error ? error.message : error
    );
    return [];
  }
}
