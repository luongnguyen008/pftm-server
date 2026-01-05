import { db } from "../src/lib/db";

async function createTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS indicators (
      country TEXT NOT NULL,
      indicator_type TEXT NOT NULL,
      frequency TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      actual REAL NOT NULL,
      actual_formatted TEXT,
      forecast REAL,
      forecast_formatted TEXT,
      unit TEXT,
      currency TEXT,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch()),
      PRIMARY KEY (country, indicator_type, timestamp, frequency, actual)
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS macro_scorecards (
        country TEXT NOT NULL,
        indicator_type TEXT NOT NULL,
        frequency TEXT NOT NULL,
        timestamp INTEGER NOT NULL,

        -- CẬP NHẬT Ở ĐÂY: Lưu số thực để vẽ biểu đồ
        score_value REAL NOT NULL,   
        
        -- Vẫn nên giữ lại cột text này để hiển thị trên UI (Tooltip) nếu cần
        score_label TEXT,            -- Ví dụ: "+5 to +8 (Growing)"
        
        bias TEXT,
        created_at INTEGER DEFAULT (unixepoch()),
        updated_at INTEGER DEFAULT (unixepoch()),

        PRIMARY KEY (country, indicator_type, frequency, timestamp)
    );
  `);
  console.log("Table created successfully!");
}

async function seed() {
  await createTable();
  console.log("Table checked/created.");
}

seed().catch((err) => console.error(err));
