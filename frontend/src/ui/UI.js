export function createUI(scene, fleet) {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    font-family: 'Exo 2', sans-serif;
    z-index: 100;
  `;
  document.body.appendChild(container);
  
  container.appendChild(createFleetPanel(fleet));
  container.appendChild(createControlPanel(fleet));
  container.appendChild(createHUD());
  container.appendChild(createStatusBar());
  
  return container;
}

function createFleetPanel(fleet) {
  const panel = document.createElement('div');
  panel.style.cssText = `
    position: absolute;
    top: 20px;
    left: 20px;
    width: 280px;
    background: rgba(10, 20, 40, 0.85);
    border: 1px solid rgba(0, 200, 150, 0.3);
    border-radius: 12px;
    padding: 16px;
    backdrop-filter: blur(10px);
    pointer-events: auto;
  `;
  
  const title = document.createElement('h2');
  title.textContent = 'FLEET STATUS';
  title.style.cssText = `
    color: #00ffaa;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 2px;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(0, 255, 170, 0.3);
    padding-bottom: 8px;
  `;
  panel.appendChild(title);
  
  fleet.getDrones().forEach(drone => {
    const card = document.createElement('div');
    card.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    card.innerHTML = `
      <div>
        <div style="color: #fff; font-weight: 600;">${drone.name}</div>
        <div style="color: #888; font-size: 11px;">${drone.id} | ${drone.type}</div>
      </div>
      <div style="text-align: right;">
        <div style="color: ${drone.battery > 50 ? '#00ff88' : drone.battery > 20 ? '#ffaa00' : '#ff4444'}; font-weight: 600;">
          ${Math.round(drone.battery)}%
        </div>
        <div style="color: #888; font-size: 11px; text-transform: uppercase;">${drone.status}</div>
      </div>
    `;
    panel.appendChild(card);
  });
  
  return panel;
}

function createControlPanel(fleet) {
  const panel = document.createElement('div');
  panel.style.cssText = `
    position: absolute;
    bottom: 80px;
    left: 20px;
    background: rgba(10, 20, 40, 0.85);
    border: 1px solid rgba(0, 200, 150, 0.3);
    border-radius: 12px;
    padding: 16px;
    backdrop-filter: blur(10px);
    pointer-events: auto;
  `;
  
  const buttons = [
    { label: 'START PATROL', action: () => fleet.startAllPatrol() },
    { label: 'STOP PATROL', action: () => fleet.stopAllPatrol() },
    { label: 'LINE FORMATION', action: () => fleet.setFormation('line') },
    { label: 'CIRCLE FORMATION', action: () => fleet.setFormation('circle') }
  ];
  
  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.textContent = btn.label;
    button.style.cssText = `
      display: block;
      width: 100%;
      padding: 10px 16px;
      margin: 6px 0;
      background: rgba(0, 255, 170, 0.15);
      border: 1px solid rgba(0, 255, 170, 0.4);
      border-radius: 6px;
      color: #00ffaa;
      font-family: 'Exo 2', sans-serif;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.2s;
    `;
    button.onmouseenter = () => {
      button.style.background = 'rgba(0, 255, 170, 0.3)';
      button.style.borderColor = '#00ffaa';
    };
    button.onmouseleave = () => {
      button.style.background = 'rgba(0, 255, 170, 0.15)';
      button.style.borderColor = 'rgba(0, 255, 170, 0.4)';
    };
    button.onclick = btn.action;
    panel.appendChild(button);
  });
  
  return panel;
}

function createHUD() {
  const hud = document.createElement('div');
  hud.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    width: 200px;
    background: rgba(10, 20, 40, 0.85);
    border: 1px solid rgba(0, 200, 150, 0.3);
    border-radius: 12px;
    padding: 16px;
    backdrop-filter: blur(10px);
  `;
  
  hud.innerHTML = `
    <h3 style="color: #00ffaa; font-size: 12px; margin-bottom: 12px; letter-spacing: 1px;">ENVIRONMENT</h3>
    <div style="color: #fff; font-size: 13px; margin: 6px 0;">
      <span style="color: #888;">Temp:</span> <span id="hud-temp">24°C</span>
    </div>
    <div style="color: #fff; font-size: 13px; margin: 6px 0;">
      <span style="color: #888;">Humidity:</span> <span id="hud-humidity">65%</span>
    </div>
    <div style="color: #fff; font-size: 13px; margin: 6px 0;">
      <span style="color: #888;">Wind:</span> <span id="hud-wind">12 km/h NW</span>
    </div>
    <div style="color: #fff; font-size: 13px; margin: 6px 0;">
      <span style="color: #888;">Pesticide:</span> <span id="hud-pesticide" style="color: #00ff88;">OK</span>
    </div>
  `;
  
  return hud;
}

function createStatusBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(10, 20, 40, 0.85);
    border: 1px solid rgba(0, 200, 150, 0.3);
    border-radius: 20px;
    padding: 10px 30px;
    backdrop-filter: blur(10px);
    color: #00ffaa;
    font-size: 12px;
    letter-spacing: 1px;
  `;
  bar.textContent = 'AGRI DRONE FLEET MANAGEMENT SYSTEM v1.0';
  return bar;
}
