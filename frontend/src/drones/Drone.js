import * as THREE from 'three';

export class Drone {
  constructor(id, name, type, color, position) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.mesh = this.createMesh(color);
    this.mesh.position.copy(position);
    this.velocity = new THREE.Vector3();
    this.targetPosition = position.clone();
    this.battery = 100;
    this.status = 'idle';
    this.waypoints = [];
    this.currentWaypoint = 0;
    this.speed = 15;
    this.isPatrolling = false;
    this.scanCone = null;
    this.sprayParticles = [];
  }
  
  createMesh(color) {
    const group = new THREE.Group();
    
    const bodyGeo = new THREE.BoxGeometry(2, 0.6, 2);
    const bodyMat = new THREE.MeshStandardMaterial({ color, metalness: 0.5, roughness: 0.3 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    group.add(body);
    
    const armGeo = new THREE.BoxGeometry(3, 0.15, 0.3);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    
    for (let i = 0; i < 4; i++) {
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.rotation.y = (i * Math.PI) / 2;
      arm.position.set(Math.cos((i * Math.PI) / 2) * 1.5, 0, Math.sin((i * Math.PI) / 2) * 1.5);
      group.add(arm);
      
      const propGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16);
      const propMat = new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.7 });
      const prop = new THREE.Mesh(propGeo, propMat);
      const offset = 1.8;
      prop.position.set(Math.cos((i * Math.PI) / 2) * offset, 0.2, Math.sin((i * Math.PI) / 2) * offset);
      prop.userData.propellerIndex = i;
      group.add(prop);
    }
    
    const sensorGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const sensorMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x004400 });
    const sensor = new THREE.Mesh(sensorGeo, sensorMat);
    sensor.position.set(0, -0.4, 0.5);
    group.add(sensor);
    
    this.createScanCone(group);
    
    return group;
  }
  
  createScanCone(parent) {
    const coneGeo = new THREE.ConeGeometry(8, 15, 16, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00, 
      transparent: true, 
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    this.scanCone = new THREE.Mesh(coneGeo, coneMat);
    this.scanCone.rotation.x = Math.PI;
    this.scanCone.position.y = -7.5;
    parent.add(this.scanCone);
  }
  
  setWaypoints(points) {
    this.waypoints = points.map(p => new THREE.Vector3(p.x, p.y || 20, p.z));
    this.currentWaypoint = 0;
  }
  
  update(delta, scene) {
    this.mesh.children.forEach(child => {
      if (child.userData.propellerIndex !== undefined) {
        child.rotation.y += delta * 20;
      }
    });
    
    if (this.isPatrolling && this.waypoints.length > 0) {
      const target = this.waypoints[this.currentWaypoint];
      const direction = target.clone().sub(this.mesh.position);
      const distance = direction.length();
      
      if (distance < 2) {
        this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length;
      } else {
        direction.normalize();
        this.velocity.lerp(direction.multiplyScalar(this.speed), 0.02);
        this.mesh.position.add(this.velocity.clone().multiplyScalar(delta));
        this.mesh.lookAt(target.x, this.mesh.position.y, target.z);
        
        this.battery -= delta * 0.5;
        if (this.battery < 20) {
          this.status = 'low-battery';
        }
      }
    }
    
    if (this.scanCone) {
      this.scanCone.rotation.y += delta * 0.5;
    }
  }
  
  startPatrol() {
    this.isPatrolling = true;
    this.status = 'patrolling';
  }
  
  stopPatrol() {
    this.isPatrolling = false;
    this.status = 'idle';
  }
  
  returnToBase(basePosition) {
    this.targetPosition.copy(basePosition);
    this.isPatrolling = false;
    this.status = 'returning';
  }
  
  getTelemetry() {
    return {
      droneId: this.id,
      position: {
        x: this.mesh.position.x,
        y: this.mesh.position.y,
        z: this.mesh.position.z
      },
      battery: this.battery,
      status: this.status
    };
  }
}
