import { getDb } from '../db.js';

export function storeTelemetry(data) {
  const db = getDb();
  const { simulationId, droneId, position, battery, status } = data;
  const now = new Date().toISOString();
  
  db.run(`
    INSERT INTO telemetry (simulation_id, drone_id, timestamp, position, battery, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [simulationId, droneId, now, JSON.stringify(position || {}), battery, status || 'active']);
  
  return { success: true };
}

export function getTelemetry(simulationId, limit = 1000) {
  const db = getDb();
  const result = db.exec(`
    SELECT * FROM telemetry 
    WHERE simulation_id = ? 
    ORDER BY timestamp DESC 
    LIMIT ${limit}
  `, [simulationId]);
  
  if (result.length === 0) return [];
  
  const columns = result[0].columns;
  return result[0].values.map(row => {
    const obj = Object.fromEntries(columns.map((col, i) => [col, row[i]]));
    if (obj.position) obj.position = JSON.parse(obj.position);
    return obj;
  });
}

export function getTelemetryStats(simulationId) {
  const db = getDb();
  
  const totalResult = db.exec('SELECT COUNT(*) as count FROM telemetry WHERE simulation_id = ?', [simulationId]);
  const total = totalResult[0]?.values[0]?.[0] || 0;
  
  const byDroneResult = db.exec(`
    SELECT drone_id, COUNT(*) as count, AVG(battery) as avgBattery 
    FROM telemetry 
    WHERE simulation_id = ? 
    GROUP BY drone_id
  `, [simulationId]);
  
  const byDrone = byDroneResult.length > 0 
    ? byDroneResult[0].values.map(row => ({
        drone_id: row[0],
        count: row[1],
        avgBattery: row[2] ? parseFloat(row[2]).toFixed(1) : 0
      }))
    : [];
  
  return { totalRecords: total, byDrone };
}
