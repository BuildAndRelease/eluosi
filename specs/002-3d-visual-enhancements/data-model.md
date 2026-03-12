# Data Model: 3D Visual Enhancements

**Feature**: 002-3d-visual-enhancements
**Date**: 2026-03-12
**Status**: Complete

## Overview

This document defines the data structures and state models for 3D rendering, particle explosion system, and animation management. All models follow immutability principles from the constitution.

---

## Core Entities

### 1. Particle

Represents a single particle in an explosion effect.

```typescript
interface Particle {
  // Position (world coordinates in pixels)
  x: number;
  y: number;

  // Velocity (pixels per frame at 60fps)
  vx: number;  // Horizontal velocity
  vy: number;  // Vertical velocity

  // Lifecycle (0.0 = dead, 1.0 = just spawned)
  life: number;

  // Visual properties
  color: string;  // Hex color code (inherited from source block)
  size: number;   // Particle radius in pixels (4-8px)

  // 3D properties (inherited from source block)
  depth: number;  // Z-order for rendering (0-1, higher = front)
}
```

**Validation Rules**:
- `x`, `y`: Any number (can go off-screen before culling)
- `vx`: -10 to 10 pixels/frame
- `vy`: -15 to 10 pixels/frame (negative = upward)
- `life`: 0.0 to 1.0 (clamped)
- `color`: Valid hex color string (e.g., "#ff0000")
- `size`: 4 to 8 pixels
- `depth`: 0.0 to 1.0

**State Transitions**:
1. **Spawned**: `life = 1.0`, random velocity, positioned at source block
2. **Active**: `life` decreases over time, position updated by velocity + gravity
3. **Dead**: `life <= 0`, returned to object pool

**Immutability**: Particles are updated by creating new particle objects, not mutating existing ones.

---

### 2. ParticleEmitter

Manages a group of particles for a single explosion event.

```typescript
interface ParticleEmitter {
  // Unique identifier
  id: string;  // e.g., "row-clear-5-1234567890"

  // Source information
  sourceX: number;  // Grid X coordinate
  sourceY: number;  // Grid Y coordinate
  sourceColor: string;  // Block color

  // Particle collection
  particles: Particle[];

  // Lifecycle
  startTime: number;  // Timestamp (performance.now())
  duration: number;   // Total duration in milliseconds (500-1000ms)
  active: boolean;    // Is emitter still spawning/updating particles?
}
```

**Validation Rules**:
- `id`: Non-empty string, unique across active emitters
- `sourceX`: 0 to GRID_WIDTH-1
- `sourceY`: 0 to GRID_HEIGHT-1
- `sourceColor`: Valid hex color
- `particles`: Array of 10-15 particles per block
- `startTime`: Valid timestamp
- `duration`: 500 to 1000 milliseconds
- `active`: Boolean

**State Transitions**:
1. **Created**: Emitter spawned with initial particles
2. **Active**: Particles updated each frame, new particles may spawn
3. **Complete**: All particles dead, emitter marked inactive
4. **Removed**: Emitter removed from active list

---

### 3. Animation

Represents a generic animation with lifecycle management.

```typescript
interface Animation {
  // Unique identifier
  id: string;  // e.g., "fast-drop-acceleration"

  // Timing
  startTime: number;  // Timestamp (performance.now())
  duration: number;   // Total duration in milliseconds

  // Lifecycle callbacks
  onUpdate: (progress: number) => void;  // Called each frame (progress: 0-1)
  onComplete: () => void;                // Called when animation finishes

  // Control flags
  interruptible: boolean;  // Can be stopped by game over?
  paused: boolean;         // Is animation paused?
}
```

**Validation Rules**:
- `id`: Non-empty string, unique across active animations
- `startTime`: Valid timestamp
- `duration`: Positive number (milliseconds)
- `onUpdate`: Function accepting number (0-1)
- `onComplete`: Function with no parameters
- `interruptible`: Boolean
- `paused`: Boolean

**State Transitions**:
1. **Started**: Animation registered with manager
2. **Running**: `onUpdate` called each frame with progress
3. **Paused**: Updates suspended (if `paused = true`)
4. **Completed**: `onComplete` called, animation removed
5. **Interrupted**: Stopped early (if `interruptible = true`)

---

### 4. Isometric3DBlock

Represents a block with 3D visual properties for isometric rendering.

```typescript
interface Isometric3DBlock {
  // Grid position
  gridX: number;
  gridY: number;

  // Isometric screen coordinates (calculated)
  isoX: number;
  isoY: number;

  // Color for each face
  topColor: string;    // Lightest (100% brightness)
  leftColor: string;   // Medium (70% brightness)
  rightColor: string;  // Darkest (50% brightness)

  // Depth for rendering order
  depth: number;  // gridX + gridY (higher = render later)

  // Visual state
  highlighted: boolean;  // Is block part of clearing row?
  flashIntensity: number;  // 0-1 for lock flash effect
}
```

**Validation Rules**:
- `gridX`: 0 to GRID_WIDTH-1
- `gridY`: 0 to GRID_HEIGHT-1
- `isoX`, `isoY`: Calculated from grid position
- `topColor`, `leftColor`, `rightColor`: Valid hex colors
- `depth`: Non-negative number
- `highlighted`: Boolean
- `flashIntensity`: 0.0 to 1.0

**Derived Properties**:
```typescript
// Isometric transformation
isoX = (gridX - gridY) * (CELL_SIZE / 2)
isoY = (gridX + gridY) * (CELL_SIZE / 4)

// Depth for painter's algorithm
depth = gridX + gridY
```

---

### 5. FastDropState

Tracks fast drop acceleration state.

```typescript
interface FastDropState {
  // Activation state
  active: boolean;

  // Timing
  startTime: number;  // Timestamp when spacebar pressed
  rampDuration: number;  // 200ms (0.2 seconds)

  // Speed multiplier
  currentMultiplier: number;  // 1.0 to 8.0
  maxMultiplier: number;      // 8.0

  // Visual feedback
  showTrail: boolean;  // Show motion blur trail?
  trailOpacity: number;  // 0-1 for trail fade
}
```

**Validation Rules**:
- `active`: Boolean
- `startTime`: Valid timestamp (or 0 if inactive)
- `rampDuration`: 200 milliseconds (constant)
- `currentMultiplier`: 1.0 to 8.0
- `maxMultiplier`: 8.0 (constant)
- `showTrail`: Boolean
- `trailOpacity`: 0.0 to 1.0

**State Transitions**:
1. **Inactive**: `active = false`, `currentMultiplier = 1.0`
2. **Ramping Up**: `active = true`, multiplier increases linearly
3. **Max Speed**: `currentMultiplier = 8.0`, maintained while spacebar held
4. **Deactivated**: Returns to inactive state

**Calculation**:
```typescript
const elapsed = currentTime - startTime;
const progress = Math.min(1.0, elapsed / rampDuration);
currentMultiplier = 1.0 + (maxMultiplier - 1.0) * progress;
```

---

## Relationships

```
GameState (V1)
  └─> Renderer (V1, modified)
        ├─> Renderer3D (NEW)
        │     └─> Isometric3DBlock[] (NEW)
        └─> EffectsManager (NEW)
              └─> ParticleEmitter[] (NEW)
                    └─> Particle[] (NEW)

InputHandler (V1, modified)
  └─> FastDropState (NEW)

AnimationManager (NEW)
  └─> Animation[] (NEW)
        ├─> ParticleEmitter animations
        ├─> FastDrop acceleration animation
        └─> Row clear flash animation
```

---

## State Management Principles

### Immutability

All state updates create new objects:

```typescript
// ❌ BAD: Mutation
particle.life -= deltaTime;

// ✅ GOOD: Immutable update
const updatedParticle = {
  ...particle,
  life: particle.life - deltaTime
};
```

### Pure Functions

All state transformations are pure functions:

```typescript
// Pure function: no side effects, deterministic
function updateParticle(particle: Particle, deltaTime: number, gravity: number): Particle {
  return {
    ...particle,
    x: particle.x + particle.vx,
    y: particle.y + particle.vy,
    vy: particle.vy + gravity,
    life: particle.life - deltaTime / 1000
  };
}
```

### Object Pooling (Performance Exception)

Particle objects are pooled for performance, but updates remain immutable:

```typescript
class ParticlePool {
  private pool: Particle[] = [];

  // Reuse object from pool, but initialize with new values
  acquire(x: number, y: number, color: string): Particle {
    const particle = this.pool.pop() || this.createNew();
    // Reinitialize all properties (effectively immutable from caller's perspective)
    return this.initialize(particle, x, y, color);
  }

  // Return to pool for reuse
  release(particle: Particle): void {
    this.pool.push(particle);
  }
}
```

---

## Data Flow

### Row Clear Animation Flow

```
1. Game detects completed row
     ↓
2. EffectsManager.createRowClearExplosion(rowIndex)
     ↓
3. For each block in row:
   - Create ParticleEmitter
   - Spawn 10-15 particles with random velocities
     ↓
4. AnimationManager registers particle update animation
     ↓
5. Each frame:
   - Update particle positions (velocity + gravity)
   - Decrease particle life
   - Render particles with fade-out
     ↓
6. When all particles dead:
   - Complete animation
   - Remove emitter
   - Trigger row removal in game logic
```

### Fast Drop Acceleration Flow

```
1. User presses spacebar
     ↓
2. InputHandler.activateFastDrop()
     ↓
3. FastDropState.active = true, startTime = now
     ↓
4. Each frame:
   - Calculate elapsed time
   - Compute speed multiplier (linear interpolation)
   - Apply multiplier to drop speed
   - Render motion blur trail (optional)
     ↓
5. User releases spacebar
     ↓
6. FastDropState.active = false, multiplier = 1.0
```

### 3D Rendering Flow

```
1. Renderer.render(gameState)
     ↓
2. For each block in grid:
   - Create Isometric3DBlock
   - Calculate isometric coordinates
   - Determine face colors (top/left/right)
     ↓
3. Sort blocks by depth (painter's algorithm)
     ↓
4. Renderer3D.renderBlock(block)
   - Draw right face (darkest)
   - Draw left face (medium)
   - Draw top face (lightest)
   - Add highlights and shadows
     ↓
5. Render particles on top of blocks
```

---

## Performance Considerations

### Memory Budget

- **Particle Pool**: 200 pre-allocated particles (~10KB)
- **Active Particles**: Max 150 concurrent (~7.5KB)
- **Emitters**: Max 4 concurrent (one per row in Tetris) (~2KB)
- **Animations**: Max 10 concurrent (~5KB)
- **Total New Memory**: ~25KB (well within 80MB budget)

### Computational Complexity

- **Particle Update**: O(n) where n = active particles (max 150)
- **3D Transform**: O(m) where m = visible blocks (max 200)
- **Sorting**: O(m log m) for depth sorting (max 200 blocks)
- **Rendering**: O(n + m) for particles + blocks

**Frame Budget**: 16.67ms at 60fps
- Particle update: 5ms (150 particles)
- 3D transforms: 2ms (200 blocks)
- Sorting: 0.5ms
- Rendering: 6ms
- **Total**: 13.5ms (3.17ms buffer)

---

## Validation & Error Handling

### Input Validation

```typescript
function validateParticle(p: Particle): boolean {
  return (
    typeof p.x === 'number' &&
    typeof p.y === 'number' &&
    p.life >= 0 && p.life <= 1 &&
    p.size >= 4 && p.size <= 8 &&
    /^#[0-9A-Fa-f]{6}$/.test(p.color)
  );
}
```

### Error Recovery

- **Invalid particle**: Skip rendering, log warning
- **Pool exhausted**: Create new particle (GC acceptable in rare case)
- **Animation timing error**: Reset to start time, log error
- **3D transform NaN**: Fall back to 2D rendering, log error

---

**Data Model Status**: ✅ Complete
**Next**: contracts/ (Renderer3D API, Effects API)
