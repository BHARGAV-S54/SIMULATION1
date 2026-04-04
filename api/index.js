import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

const simulations = new Map();
const telemetry = new Map();

function backupData() {
  console.log('Data backup:', { simCount: simulations.size, telemetryCount: telemetry.size });
}

app.post('/api/simulations', (req, res) => {
  const id = uuidv4();
  const sim = {
    id,
    name: req.body.name || `Simulation ${new Date().toLocaleString()}`,
    created_at: new Date().toISOString(),
    status: 'active',
    config: {}
  };
  simulations.set(id, sim);
  res.status(201).json(sim);
});

app.get('/api/simulations', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const list = Array.from(simulations.values())
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
  res.json(list);
});

app.get('/api/simulations/:id', (req, res) => {
  const sim = simulations.get(req.params.id);
  if (!sim) return res.status(404).json({ error: 'Not found' });
  res.json(sim);
});

app.put('/api/simulations/:id', (req, res) => {
  const sim = simulations.get(req.params.id);
  if (!sim) return res.status(404).json({ error: 'Not found' });
  Object.assign(sim, req.body);
  res.json(sim);
});

app.delete('/api/simulations/:id', (req, res) => {
  telemetry.delete(req.params.id);
  simulations.delete(req.params.id);
  res.json({ deleted: true });
});

app.post('/api/telemetry', (req, res) => {
  const { simulationId, droneId, position, battery, status } = req.body;
  if (!simulationId || !droneId) {
    return res.status(400).json({ error: 'simulationId and droneId required' });
  }
  
  if (!telemetry.has(simulationId)) {
    telemetry.set(simulationId, []);
  }
  
  telemetry.get(simulationId).push({
    id: telemetry.get(simulationId).length + 1,
    simulation_id: simulationId,
    drone_id: droneId,
    timestamp: new Date().toISOString(),
    position: JSON.stringify(position || {}),
    battery,
    status: status || 'active'
  });
  
  if (Math.random() < 0.01) backupData();
  res.status(201).json({ success: true });
});

app.get('/api/telemetry/:simId', (req, res) => {
  const data = telemetry.get(req.params.simId) || [];
  const limit = parseInt(req.query.limit) || 1000;
  res.json(data.slice(-limit));
});

app.get('/api/telemetry/:simId/stats', (req, res) => {
  const data = telemetry.get(req.params.simId) || [];
  const byDrone = {};
  
  data.forEach(t => {
    if (!byDrone[t.drone_id]) {
      byDrone[t.drone_id] = { count: 0, totalBattery: 0 };
    }
    byDrone[t.drone_id].count++;
    byDrone[t.drone_id].totalBattery += t.battery || 0;
  });
  
  const byDroneArray = Object.entries(byDrone).map(([id, stats]) => ({
    drone_id: id,
    count: stats.count,
    avgBattery: stats.count ? (stats.totalBattery / stats.count).toFixed(1) : 0
  }));
  
  res.json({ totalRecords: data.length, byDrone: byDroneArray });
});

app.get('/api/drones', (req, res) => {
  res.json([
    { id: 'ALPHA-01', name: 'Alpha', type: 'scout', capacity: 5 },
    { id: 'BETA-02', name: 'Beta', type: 'sprayer', capacity: 15 },
    { id: 'GAMMA-03', name: 'Gamma', type: 'hybrid', capacity: 10 }
  ]);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Drone Fleet Simulation API',
    version: '1.0.0',
    endpoints: ['GET /api/health', 'GET/POST /api/simulations', 'GET/PUT/DELETE /api/simulations/:id', 'POST /api/telemetry', 'GET /api/telemetry/:simId', 'GET /api/drones']
  });
});

export default app;
