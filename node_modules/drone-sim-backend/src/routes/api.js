import { Router } from 'express';
import * as simulations from '../services/simulations.js';
import * as telemetry from '../services/telemetry.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.post('/simulations', (req, res) => {
  try {
    const sim = simulations.createSimulation(req.body.name);
    res.status(201).json(sim);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/simulations', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    res.json(simulations.listSimulations(limit));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/simulations/:id', (req, res) => {
  try {
    const sim = simulations.getSimulation(req.params.id);
    if (!sim) return res.status(404).json({ error: 'Not found' });
    res.json(sim);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/simulations/:id', (req, res) => {
  try {
    res.json(simulations.updateSimulation(req.params.id, req.body));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/simulations/:id', (req, res) => {
  try {
    res.json(simulations.deleteSimulation(req.params.id));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/telemetry', (req, res) => {
  try {
    res.status(201).json(telemetry.storeTelemetry(req.body));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/telemetry/:simId', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 1000;
    res.json(telemetry.getTelemetry(req.params.simId, limit));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/telemetry/:simId/stats', (req, res) => {
  try {
    res.json(telemetry.getTelemetryStats(req.params.simId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/drones', (req, res) => {
  res.json([
    { id: 'ALPHA-01', name: 'Alpha', type: 'scout', capacity: 5 },
    { id: 'BETA-02', name: 'Beta', type: 'sprayer', capacity: 15 },
    { id: 'GAMMA-03', name: 'Gamma', type: 'hybrid', capacity: 10 }
  ]);
});

export default router;
