import { db } from "../../lib/db";
import { IndicatorValue } from "../../types";

/**
 * SQL Schema for reference:
 *
 * CREATE TABLE IF NOT EXISTS indicators (
 *   country TEXT NOT NULL,
 *   indicator_type TEXT NOT NULL,
 *   frequency TEXT NOT NULL,
 *   timestamp INTEGER NOT NULL,
 *   actual REAL NOT NULL,
 *   actual_formatted TEXT,
 *   forecast REAL,
 *   forecast_formatted TEXT,
 *   created_at INTEGER DEFAULT (unixepoch()),
 *   updated_at INTEGER DEFAULT (unixepoch()),
 *   PRIMARY KEY (country, indicator_type, timestamp, frequency)
 * );
 */

export const upsertIndicators = async (data: IndicatorValue[]) => {
  if (data.length === 0) return;

  // Batch size limit to avoid SQLite variable limit errors (typically 32766 or 999 depending on build)
  // Let's be safe with chunks of 100 records (100 * 8 args = 800 variables, well within limits)
  const BATCH_SIZE = 100;

  const transaction = await db.transaction("write");

  try {
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);

      // Construct placeholders: (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ...
      const placeholders = batch
        .map(() => `(?, ?, ?, ?, ?, ?, ?, ?)`)
        .join(", ");

      // Flatten args
      const args: (string | number | null)[] = [];
      batch.forEach((item) => {
        args.push(
          item.country,
          item.indicator_type,
          item.frequency,
          item.timestamp,
          item.actual,
          item.actual_formatted || null,
          item.forecast || null,
          item.forecast_formatted || null
        );
      });

      const sql = `
        INSERT INTO indicators (
          country, indicator_type, frequency, timestamp, 
          actual, actual_formatted, forecast, forecast_formatted
        ) VALUES ${placeholders}
        ON CONFLICT(country, indicator_type, frequency, timestamp) 
        DO UPDATE SET 
          actual = excluded.actual,
          actual_formatted = excluded.actual_formatted,
          forecast = excluded.forecast,
          forecast_formatted = excluded.forecast_formatted,
          updated_at = unixepoch()
      `;

      await transaction.execute({ sql, args });
    }

    await transaction.commit();
    console.log(`Successfully upserted ${data.length} records.`);
  } catch (error) {
    transaction.rollback();
    console.error("Error upserting indicators:", error);
    throw error;
  }
};
