# AgriMind - Advanced Multi-Drone Fleet Management System

## Project Overview

AgriMind is an advanced multi-drone fleet management simulation system designed for precision agriculture. The application provides a real-time 3D visualization of autonomous drone operations including crop scanning, disease detection, precision spraying, and pest elimination in agricultural fields.

## Problem Statement

### The Challenge
Modern agriculture faces significant challenges in managing large-scale crops efficiently:

1. **Manual Pesticide Application**: Traditional methods result in excessive pesticide use, environmental contamination, and uneven coverage
2. **Disease Detection**: Manual field inspection is time-consuming, labor-intensive, and often too slow to prevent disease spread
3. **Pest Control**: Identifying and targeting pest infestations requires constant human monitoring across vast areas
4. **Resource Optimization**: Inefficient use of pesticides, batteries, and flight time leads to increased operational costs
5. **Fleet Coordination**: Managing multiple autonomous drones requires sophisticated coordination to prevent collisions and ensure complete field coverage

### Impact
- Crop losses due to undetected diseases can reach 30-40% of yield
- Over-spraying wastes resources and harms ecosystems
- Manual monitoring is impractical for large agricultural operations
- Inefficient fleet operations increase operational costs significantly

## Solution

AgriMind provides a comprehensive solution through:

1. **Autonomous Fleet Operations**: Multi-drone coordination with intelligent patrol patterns
2. **Precision Spraying**: Targeted application only where needed, reducing chemical usage by up to 60%
3. **Real-Time Disease Detection**: Continuous scanning with visual markers for infected plants
4. **Active Pest Elimination**: Autonomous bug detection and elimination using spray technology
5. **Smart Battery Management**: Drones automatically return to base when battery is low
6. **Comprehensive Analytics**: Real-time metrics on coverage, efficiency, and crop health

## Tech Stack

### Frontend
- **Three.js (v0.128.0)**: 3D rendering and visualization
- **Vanilla JavaScript**: No framework dependencies for lightweight performance
- **HTML5 Canvas**: WebGL-based rendering
- **Web Audio API**: Real-time sound effects

### Backend
- **Express.js**: REST API server
- **Node.js**: Runtime environment
- **SQL.js**: In-memory database for simulation data
- **CORS**: Cross-origin resource sharing

### Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Port 5173)                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Three.js 3D Visualization            │   │
│  │   - Drone Fleet Rendering                        │   │
│  │   - Field & Crop Simulation                     │   │
│  │   - Real-time Animation Loop                    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          │ REST API
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend (Port 3001)                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Express API Server                 │   │
│  │   - Simulation Management                       │   │
│  │   - Telemetry Data Storage                      │   │
│  │   - Drone State Management                      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Key Features

### Drone Fleet Management
- **3 Autonomous Drones**: ALPHA-01, BETA-02, GAMMA-03
- **6-Rotor Configuration**: Stable flight with payload capacity
- **Real-time Status Monitoring**: Battery, pesticide levels, operational status
- **Intelligent Patrol Patterns**: Zone-based grid search algorithms

### Precision Agriculture
- **Crop Scanning**: Continuous terrain analysis with 3D cone visualization
- **Disease Detection**: Visual markers for infected plants (red spheres)
- **Targeted Spraying**: Precision application only on diseased plants
- **Recovery Tracking**: Monitor plant health improvement over time

### Pest Control System
- **Bug Types**: Beetles, Locusts, Caterpillars, Aphids
- **Autonomous Targeting**: Drones automatically pursue detected pests
- **Elimination Tracking**: Real-time metrics on pest elimination progress
- **Sound Effects**: Audio feedback for detections and eliminations

### Fleet Coordination
- **Formation Control**: Intelligent swarm behavior
- **Collision Avoidance**: Proximity-based path adjustment
- **Communication Status**: Real-time inter-drone coordination metrics
- **Return to Base**: Autonomous docking when resources depleted

### User Interface
- **Top Bar**: Fleet status, active drones, weather conditions
- **Left Panel**: Individual drone cards with stats
- **Right Panel**: Control buttons and coordination info
- **Bottom HUD**: Environmental data and mission metrics
- **Camera Modes**: Overview, Follow, Top-Down, Cinematic, Side

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/simulations` | List all simulations |
| POST | `/api/simulations` | Create new simulation |
| GET | `/api/simulations/:id` | Get simulation details |
| PUT | `/api/simulations/:id` | Update simulation |
| DELETE | `/api/simulations/:id` | Delete simulation |
| POST | `/api/telemetry` | Submit telemetry data |
| GET | `/api/telemetry/:simId` | Get telemetry for simulation |
| GET | `/api/drones` | Get all drone states |

## Running the Application

### Development
```bash
# Install dependencies
npm install

# Run frontend (Vite dev server)
npm run dev

# Run backend separately
npm run dev:backend

# Build for production
npm run build
```

### Production
```bash
npm run build
npm run start
```

## Future Enhancements

1. **AI-Based Disease Recognition**: Machine learning for plant health assessment
2. **Multi-Zone Support**: Partition large fields into manageable sectors
3. **Weather Integration**: Real-time weather data for flight planning
4. **Mobile App**: Remote fleet monitoring and control
5. **Fleet Scaling**: Support for 10+ drone configurations
6. **Data Analytics**: Historical performance and predictive maintenance

## License

This project is for demonstration purposes.
