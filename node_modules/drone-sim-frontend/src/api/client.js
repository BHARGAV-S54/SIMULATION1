const API_BASE = '/api';

async function fetchJSON(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  health: () => fetchJSON('/health'),
  
  simulations: {
    list: (limit = 20) => fetchJSON(`/simulations?limit=${limit}`),
    get: (id) => fetchJSON(`/simulations/${id}`),
    create: (name) => fetchJSON('/simulations', { method: 'POST', body: JSON.stringify({ name }) }),
    update: (id, data) => fetchJSON(`/simulations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchJSON(`/simulations/${id}`, { method: 'DELETE' })
  },
  
  telemetry: {
    store: (data) => fetchJSON('/telemetry', { method: 'POST', body: JSON.stringify(data) }),
    get: (simId, limit = 1000) => fetchJSON(`/telemetry/${simId}?limit=${limit}`),
    stats: (simId) => fetchJSON(`/telemetry/${simId}/stats`)
  },
  
  drones: () => fetchJSON('/drones')
};

let simulationId = null;
let telemetryBuffer = [];
const TELEMETRY_INTERVAL = 5000;

export async function initSimulation(name) {
  try {
    const sim = await api.simulations.create(name);
    simulationId = sim.id;
    console.log('Simulation started:', simulationId);
    return simulationId;
  } catch (e) {
    console.warn('API not available, running offline');
    return null;
  }
}

export async function sendTelemetry(droneData) {
  if (!simulationId) return;
  
  telemetryBuffer.push({
    simulationId,
    ...droneData,
    timestamp: new Date().toISOString()
  });
  
  if (telemetryBuffer.length >= 10) {
    const batch = [...telemetryBuffer];
    telemetryBuffer = [];
    
    for (const data of batch) {
      try {
        await api.telemetry.store(data);
      } catch (e) {
        console.warn('Telemetry send failed:', e.message);
      }
    }
  }
}

export function getSimulationId() {
  return simulationId;
}
