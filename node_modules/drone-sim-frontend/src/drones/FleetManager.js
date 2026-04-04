import { Drone } from './Drone.js';

export class FleetManager {
  constructor(scene) {
    this.scene = scene;
    this.drones = [];
    this.formation = 'line';
  }
  
  init() {
    const droneConfigs = [
      { id: 'ALPHA-01', name: 'Alpha', type: 'scout', color: 0x4488ff, pos: { x: -50, y: 25, z: 0 } },
      { id: 'BETA-02', name: 'Beta', type: 'sprayer', color: 0xff4444, pos: { x: 0, y: 25, z: 50 } },
      { id: 'GAMMA-03', name: 'Gamma', type: 'hybrid', color: 0x44ff44, pos: { x: 50, y: 25, z: -50 } }
    ];
    
    droneConfigs.forEach(config => {
      const drone = new Drone(
        config.id,
        config.name,
        config.type,
        config.color,
        new window.THREE.Vector3(config.pos.x, config.pos.y, config.pos.z)
      );
      this.drones.push(drone);
      this.scene.getScene().add(drone.mesh);
    });
    
    this.setupDefaultWaypoints();
  }
  
  setupDefaultWaypoints() {
    const waypoints = [
      { x: -100, y: 20, z: -80 },
      { x: 100, y: 20, z: -80 },
      { x: 100, y: 20, z: 80 },
      { x: -100, y: 20, z: 80 }
    ];
    
    this.drones.forEach((drone, i) => {
      const offset = (i - 1) * 15;
      drone.setWaypoints(waypoints.map(wp => ({
        x: wp.x + offset,
        y: wp.y,
        z: wp.z
      })));
    });
  }
  
  update(delta) {
    this.drones.forEach(drone => drone.update(delta, this.scene));
  }
  
  setFormation(type) {
    this.formation = type;
    const spacing = type === 'line' ? 20 : type === 'triangle' ? 25 : 15;
    
    this.drones.forEach((drone, i) => {
      const angle = (i / this.drones.length) * Math.PI * 2;
      const radius = spacing;
      drone.waypoints = [{
        x: Math.cos(angle) * radius,
        y: 25,
        z: Math.sin(angle) * radius
      }];
    });
  }
  
  startAllPatrol() {
    this.drones.forEach(drone => drone.startPatrol());
  }
  
  stopAllPatrol() {
    this.drones.forEach(drone => drone.stopPatrol());
  }
  
  getDrones() {
    return this.drones;
  }
  
  getTelemetryBatch() {
    return this.drones.map(drone => drone.getTelemetry());
  }
}
