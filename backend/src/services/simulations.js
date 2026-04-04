import { getDb } from '../db.js';
import { randomUUID } from 'crypto';

export function createSimulation(name) {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  db.run('INSERT INTO simulations (id, name, created_at) VALUES (?, ?, ?)', [id, name || `Simulation ${now}`, now]);
  return getSimulation(id);
}

export function getSimulation(id) {
  const db = getDb();
  const result = db.exec('SELECT * FROM simulations WHERE id = ?', [id]);
  if (result.length === 0 || result[0].values.length === 0) return null;
  
  const row = result[0].values[0];
  const columns = result[0].columns;
  const sim = Object.fromEntries(columns.map((col, i) => [col, row[i]]));
  if (sim.config) sim.config = JSON.parse(sim.config);
  return sim;
}

export function listSimulations(limit = 20) {
  const db = getDb();
  const result = db.exec(`SELECT * FROM simulations ORDER BY created_at DESC LIMIT ${limit}`);
  if (result.length === 0) return [];
  
  const columns = result[0].columns;
  return result[0].values.map(row => Object.fromEntries(columns.map((col, i) => [col, row[i]])));
}

export function updateSimulation(id, updates) {
  const db = getDb();
  const fields = [];
  const values = [];
  
  if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }
  if (updates.config !== undefined) { fields.push('config = ?'); values.push(JSON.stringify(updates.config)); }
  
  if (fields.length === 0) return getSimulation(id);
  
  values.push(id);
  db.run(`UPDATE simulations SET ${fields.join(', ')} WHERE id = ?`, values);
  return getSimulation(id);
}

export function deleteSimulation(id) {
  const db = getDb();
  db.run('DELETE FROM telemetry WHERE simulation_id = ?', [id]);
  db.run('DELETE FROM simulations WHERE id = ?', [id]);
  return { deleted: true };
}
