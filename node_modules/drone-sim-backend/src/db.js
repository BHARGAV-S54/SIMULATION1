import initSqlJs from 'sql.js';

let db = null;
let SQL = null;

async function getDb() {
  if (!db) {
    SQL = await initSqlJs();
    db = new SQL.Database();
    initSchema();
  }
  return db;
}

function initSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS simulations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'active',
      config TEXT DEFAULT '{}'
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS telemetry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      simulation_id TEXT NOT NULL,
      drone_id TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      position TEXT,
      battery REAL,
      status TEXT,
      FOREIGN KEY (simulation_id) REFERENCES simulations(id)
    )
  `);
  
  db.run(`CREATE INDEX IF NOT EXISTS idx_telemetry_sim ON telemetry(simulation_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_telemetry_time ON telemetry(timestamp)`);
}

export { getDb };
