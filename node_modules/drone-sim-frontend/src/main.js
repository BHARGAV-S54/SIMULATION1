import * as THREE from 'three';
import { Scene } from './scene/Scene.js';
import { FleetManager } from './drones/FleetManager.js';
import { createUI } from './ui/UI.js';
import { initSimulation, sendTelemetry, getSimulationId } from './api/client.js';

window.THREE = THREE;

const scene = new Scene();
const container = document.getElementById('canvas-container');
scene.init(container);

const fleet = new FleetManager(scene);
fleet.init();

createUI(scene, fleet);

initSimulation('Drone Fleet Mission').then(id => {
  console.log('Connected to simulation:', id || 'offline mode');
});

let lastTime = 0;
let telemetryTimer = 0;

function animate(time) {
  requestAnimationFrame(animate);
  
  const delta = Math.min((time - lastTime) / 1000, 0.1);
  lastTime = time;
  
  fleet.update(delta);
  
  telemetryTimer += delta;
  if (telemetryTimer > 5) {
    telemetryTimer = 0;
    const batch = fleet.getTelemetryBatch();
    batch.forEach(data => sendTelemetry(data));
  }
  
  scene.render();
}

requestAnimationFrame(animate);

window.scene = scene;
window.fleet = fleet;
