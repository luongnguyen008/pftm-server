import { db } from "../../lib/db";
import {
  Currency,
  INDICATOR_TYPE,
  IndicatorValue,
  COUNTRY_CODE,
  FREQUENCY,
  UNIT,
} from "../../types";

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

  let insertedCount = 0;
  let updatedCount = 0;

  try {
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);

      // Construct placeholders: (?, ?, ?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ...
      const placeholders = batch.map(() => `(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).join(", ");

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
          item.forecast_formatted || null,
          item.unit || null,
          item.currency || null
        );
      });

      const sql = `
        INSERT INTO indicators (
          country, indicator_type, frequency, timestamp, 
          actual, actual_formatted, forecast, forecast_formatted,
          unit, currency
        ) VALUES ${placeholders}
        ON CONFLICT(country, indicator_type, frequency, timestamp) 
        DO UPDATE SET 
          actual = excluded.actual,
          actual_formatted = excluded.actual_formatted,
          forecast = excluded.forecast,
          forecast_formatted = excluded.forecast_formatted,
          unit = excluded.unit,
          currency = excluded.currency,
          updated_at = unixepoch()
        RETURNING created_at, updated_at
      `;

      const resultSet = await transaction.execute({ sql, args });

      // Count inserts vs updates
      // Logic: If created_at == updated_at, it's an insert. If they differ, it was an update.
      // (Assuming the update happened at least >1s after creation)
      for (const row of resultSet.rows) {
        const createdAt = Number(row.created_at);
        const updatedAt = Number(row.updated_at);
        if (createdAt === updatedAt) {
          insertedCount++;
        } else {
          updatedCount++;
        }
      }
    }

    await transaction.commit();
    console.log(
      `Successfully processed ${data.length} records. (Inserted: ${insertedCount}, Updated: ${updatedCount})`
    );
  } catch (error) {
    transaction.rollback();
    console.error("Error upserting indicators:", error);
    throw error;
  }
};

export const getIndicatorsByType = async (
  { country, indicatorType }: { country: COUNTRY_CODE, indicatorType: INDICATOR_TYPE }
): Promise<IndicatorValue[]> => {
  try {
    const result = await db.execute({
      sql: `SELECT * FROM indicators WHERE country = ? AND indicator_type = ? ORDER BY timestamp ASC`,
      args: [country, indicatorType],
    });

    return result.rows.map((row) => ({
      country: row.country as COUNTRY_CODE,
      indicator_type: row.indicator_type as INDICATOR_TYPE,
      frequency: row.frequency as FREQUENCY,
      timestamp: Number(row.timestamp),
      actual: Number(row.actual),
      actual_formatted: (row.actual_formatted as string) || undefined,
      forecast: row.forecast ? Number(row.forecast) : undefined,
      forecast_formatted: (row.forecast_formatted as string) || undefined,
      unit: (row.unit as UNIT) || undefined,
      currency: (row.currency as Currency) || undefined,
    }));
  } catch (error) {
    console.error("Error getting indicators:", error);
    return [];
  }
};
