import * as THREE from 'three';

export class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.fieldSize = { width: 400, depth: 320 };
    this.cropRows = 24;
    this.cropCols = 40;
  }
  
  init(container) {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(0, 200, 300);
    this.camera.lookAt(0, 0, 0);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);
    
    this.createLights();
    this.createGround();
    this.createCrops();
    this.createBoundary();
    this.createChargingStation();
    
    window.addEventListener('resize', () => this.onResize());
  }
  
  createLights() {
    const ambient = new THREE.AmbientLight(0x404060, 0.4);
    this.scene.add(ambient);
    
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(100, 200, 50);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 500;
    sun.shadow.camera.left = -250;
    sun.shadow.camera.right = 250;
    sun.shadow.camera.top = 200;
    sun.shadow.camera.bottom = -200;
    this.scene.add(sun);
    
    const fill = new THREE.DirectionalLight(0x88aaff, 0.3);
    fill.position.set(-50, 100, -50);
    this.scene.add(fill);
  }
  
  createGround() {
    const groundGeo = new THREE.PlaneGeometry(this.fieldSize.width + 100, this.fieldSize.depth + 100);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x2d4a1c, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    this.scene.add(ground);
    
    const fieldGeo = new THREE.PlaneGeometry(this.fieldSize.width, this.fieldSize.depth);
    const fieldMat = new THREE.MeshStandardMaterial({ color: 0x3d6b2a, roughness: 0.8 });
    const field = new THREE.Mesh(fieldGeo, fieldMat);
    field.rotation.x = -Math.PI / 2;
    field.receiveShadow = true;
    this.scene.add(field);
  }
  
  createCrops() {
    this.crops = [];
    const startX = -this.fieldSize.width / 2 + 15;
    const startZ = -this.fieldSize.depth / 2 + 10;
    const spacingX = (this.fieldSize.width - 30) / (this.cropCols - 1);
    const spacingZ = (this.fieldSize.depth - 20) / (this.cropRows - 1);
    
    for (let row = 0; row < this.cropRows; row++) {
      for (let col = 0; col < this.cropCols; col++) {
        const x = startX + col * spacingX;
        const z = startZ + row * spacingZ;
        const crop = this.createCrop(x, z, row, col);
        this.crops.push(crop);
        this.scene.add(crop);
      }
    }
  }
  
  createCrop(x, z, row, col) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    
    const height = 3 + Math.random() * 2;
    const stemGeo = new THREE.CylinderGeometry(0.1, 0.15, height, 6);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x228822 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = height / 2;
    stem.castShadow = true;
    group.add(stem);
    
    const foliageGeo = new THREE.SphereGeometry(1.2, 8, 6);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x44aa44 });
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.y = height + 0.5;
    foliage.scale.y = 0.7;
    foliage.castShadow = true;
    group.add(foliage);
    
    const isDiseased = Math.random() < 0.05;
    if (isDiseased) {
      group.userData.isDiseased = true;
      foliage.material.color.setHex(0xaa6622);
    }
    
    group.userData.row = row;
    group.userData.col = col;
    return group;
  }
  
  createBoundary() {
    const posts = [];
    const postGeo = new THREE.CylinderGeometry(0.5, 0.5, 15, 8);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
    
    const corners = [
      [-this.fieldSize.width / 2 - 5, 7.5, -this.fieldSize.depth / 2 - 5],
      [this.fieldSize.width / 2 + 5, 7.5, -this.fieldSize.depth / 2 - 5],
      [-this.fieldSize.width / 2 - 5, 7.5, this.fieldSize.depth / 2 + 5],
      [this.fieldSize.width / 2 + 5, 7.5, this.fieldSize.depth / 2 + 5]
    ];
    
    corners.forEach(pos => {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(...pos);
      post.castShadow = true;
      posts.push(post);
      this.scene.add(post);
    });
    
    const wireGeo = new THREE.TorusGeometry(200, 0.2, 8, 64);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x888888 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.rotation.x = Math.PI / 2;
    wire.position.y = 12;
    this.scene.add(wire);
  }
  
  createChargingStation() {
    const station = new THREE.Group();
    station.position.set(180, 0, 140);
    
    const baseGeo = new THREE.BoxGeometry(30, 1, 20);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.5;
    base.castShadow = true;
    base.receiveShadow = true;
    station.add(base);
    
    const panelGeo = new THREE.BoxGeometry(25, 15, 0.5);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1a2a4a, metalness: 0.8 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 9, -9);
    panel.rotation.x = -0.4;
    panel.castShadow = true;
    station.add(panel);
    
    for (let i = 0; i < 6; i++) {
      const padGeo = new THREE.CylinderGeometry(2, 2.5, 0.3, 16);
      const padMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x004422 });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(-10 + (i % 3) * 10, 1.15, -6 + Math.floor(i / 3) * 8);
      station.add(pad);
    }
    
    this.scene.add(station);
    return station;
  }
  
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  
  getScene() {
    return this.scene;
  }
  
  getCamera() {
    return this.camera;
  }
  
  getCrops() {
    return this.crops;
  }
}
