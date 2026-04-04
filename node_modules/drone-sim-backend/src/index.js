import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ 
    name: 'Drone Fleet Simulation API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      simulations: 'GET/POST /api/simulations',
      simulation: 'GET/PUT/DELETE /api/simulations/:id',
      telemetry: 'POST /api/telemetry, GET /api/telemetry/:simId',
      drones: 'GET /api/drones'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Drone Sim API running on port ${PORT}`);
});

export default app;
