# Effects API Contract

**Feature**: 002-3d-visual-enhancements
**Module**: `src/render/Effects.ts`
**Purpose**: Particle explosion system for row clear animations

---

## Public API

### Class: `EffectsManager`

Manages particle explosions and visual effects for game events.

#### Constructor

```typescript
constructor(ctx: CanvasRenderingContext2D)
```

**Parameters**:
- `ctx`: Canvas 2D rendering context

**Throws**:
- `Error` if `ctx` is null

**Example**:
```typescript
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const effectsManager = new EffectsManager(ctx);
```

---

#### Method: `createRowClearExplosion`

Creates a particle explosion effect for a cleared row.

```typescript
createRowClearExplosion(
  rowIndex: number,
  gridWidth: number,
  cellSize: number,
  blockColors: string[]
): string
```

**Parameters**:
- `rowIndex`: Y coordinate of the cleared row (0-based)
- `gridWidth`: Number of blocks in the row (typically 10)
- `cellSize`: Size of each block in pixels (e.g., 30)
- `blockColors`: Array of colors for each block in the row (length = gridWidth)

**Returns**:
- Emitter ID (string) for tracking/cancellation

**Behavior**:
1. Creates a `ParticleEmitter` for the row
2. For each block in the row:
   - Spawns 10-15 particles at block center
   - Assigns random velocities (scatter pattern)
   - Inherits block color
3. Registers emitter with animation system
4. Returns unique emitter ID

**Example**:
```typescript
const rowIndex = 19;  // Bottom row
const colors = ['#ff0000', '#00ff00', '#0000ff', ...];  // 10 colors
const emitterId = effectsManager.createRowClearExplosion(
  rowIndex,
  10,
  30,
  colors
);
```

---

#### Method: `createMultiRowExplosion`

Creates simultaneous explosions for multiple cleared rows.

```typescript
createMultiRowExplosion(
  rowIndices: number[],
  gridWidth: number,
  cellSize: number,
  blockColors: string[][]
): string[]
```

**Parameters**:
- `rowIndices`: Array of row Y coordinates
- `gridWidth`: Number of blocks per row
- `cellSize`: Size of each block in pixels
- `blockColors`: 2D array of colors (rows × columns)

**Returns**:
- Array of emitter IDs (one per row)

**Behavior**:
- Calls `createRowClearExplosion` for each row
- All explosions start simultaneously (per spec requirement)

**Example**:
```typescript
const rowIndices = [18, 19];  // Two rows
const colors = [
  ['#ff0000', '#00ff00', ...],  // Row 18 colors
  ['#0000ff', '#ff00ff', ...]   // Row 19 colors
];
const emitterIds = effectsManager.createMultiRowExplosion(
  rowIndices,
  10,
  30,
  colors
);
```

---

#### Method: `update`

Updates all active particle emitters and particles.

```typescript
update(deltaTime: number): void
```

**Parameters**:
- `deltaTime`: Time elapsed since last update in milliseconds

**Behavior**:
1. For each active emitter:
   - Update all particles (position, velocity, life)
   - Apply gravity to particle velocities
   - Remove dead particles (life <= 0)
   - Mark emitter as complete if all particles dead
2. Remove completed emitters from active list

**Performance**:
- O(n) where n = total active particles (max 150)
- Target: <5ms for 150 particles

**Example**:
```typescript
let lastTime = performance.now();

function gameLoop(): void {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  effectsManager.update(deltaTime);
  effectsManager.render();

  requestAnimationFrame(gameLoop);
}
```

---

#### Method: `render`

Renders all active particles.

```typescript
render(): void
```

**Behavior**:
1. For each active particle:
   - Calculate opacity based on life (fade-out)
   - Draw particle as filled circle
   - Apply color and size
2. Particles rendered in order (no depth sorting needed)

**Performance**:
- O(n) where n = active particles
- Target: <3ms for 150 particles

**Example**:
```typescript
function render(): void {
  // Clear canvas
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render game elements
  renderer.render(gameState);

  // Render particles on top
  effectsManager.render();
}
```

---

#### Method: `stopEmitter`

Stops a specific emitter immediately.

```typescript
stopEmitter(emitterId: string): void
```

**Parameters**:
- `emitterId`: ID returned from `createRowClearExplosion`

**Behavior**:
- Marks emitter as inactive
- Removes all particles
- Returns particles to object pool

**Use Case**: Game over interrupts active animations (per spec requirement)

**Example**:
```typescript
const emitterId = effectsManager.createRowClearExplosion(...);

// Later, on game over
effectsManager.stopEmitter(emitterId);
```

---

#### Method: `stopAll`

Stops all active emitters immediately.

```typescript
stopAll(): void
```

**Behavior**:
- Calls `stopEmitter` for each active emitter
- Clears active emitter list
- Returns all particles to pool

**Use Case**: Game over or reset

**Example**:
```typescript
// On game over
effectsManager.stopAll();
```

---

#### Method: `getActiveEmitterCount`

Returns the number of active emitters.

```typescript
getActiveEmitterCount(): number
```

**Returns**:
- Number of active emitters

**Use Case**: Debugging, performance monitoring

**Example**:
```typescript
const count = effectsManager.getActiveEmitterCount();
console.log(`Active emitters: ${count}`);
```

---

#### Method: `getActiveParticleCount`

Returns the total number of active particles across all emitters.

```typescript
getActiveParticleCount(): number
```

**Returns**:
- Total number of active particles

**Use Case**: Performance monitoring, debugging

**Example**:
```typescript
const count = effectsManager.getActiveParticleCount();
console.log(`Active particles: ${count}`);
```

---

## Internal Classes (Not Public API)

### `ParticlePool`

Manages object pool for particle reuse.

```typescript
class ParticlePool {
  private pool: Particle[] = [];
  private active: Particle[] = [];

  acquire(x: number, y: number, color: string): Particle;
  release(particle: Particle): void;
  releaseAll(): void;
}
```

### `ParticleEmitter`

Manages a group of particles for a single explosion.

```typescript
class ParticleEmitter {
  id: string;
  particles: Particle[];
  active: boolean;

  spawn(x: number, y: number, color: string, count: number): void;
  update(deltaTime: number, gravity: number): void;
  isComplete(): boolean;
}
```

---

## Constants

```typescript
// Particle settings
const PARTICLES_PER_BLOCK = 12;  // 10-15 range
const PARTICLE_MIN_SIZE = 4;     // pixels
const PARTICLE_MAX_SIZE = 8;     // pixels
const PARTICLE_LIFETIME = 1000;  // milliseconds

// Physics settings
const GRAVITY = 0.3;              // pixels/frame²
const VELOCITY_X_RANGE = 5;       // ±5 pixels/frame
const VELOCITY_Y_MIN = -10;       // pixels/frame (upward)
const VELOCITY_Y_MAX = -2;        // pixels/frame (upward)

// Pool settings
const POOL_SIZE = 200;            // Pre-allocated particles
const MAX_ACTIVE_PARTICLES = 150; // Performance limit
```

---

## Data Structures

### Particle

```typescript
interface Particle {
  x: number;        // Position X (pixels)
  y: number;        // Position Y (pixels)
  vx: number;       // Velocity X (pixels/frame)
  vy: number;       // Velocity Y (pixels/frame)
  life: number;     // Remaining life (0-1)
  color: string;    // Hex color
  size: number;     // Radius (pixels)
}
```

### ParticleEmitter

```typescript
interface ParticleEmitter {
  id: string;
  sourceX: number;
  sourceY: number;
  particles: Particle[];
  startTime: number;
  duration: number;
  active: boolean;
}
```

---

## Usage Example

```typescript
import { EffectsManager } from './render/Effects';
import type { GameState } from './game/types';

// Initialize
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const effectsManager = new EffectsManager(ctx);

// On row clear event
function onRowsClear(clearedRows: number[], grid: Grid): void {
  // Extract colors for each cleared row
  const blockColors = clearedRows.map(rowIndex =>
    grid.cells[rowIndex].map(cell => cell || '#ffffff')
  );

  // Create explosions
  const emitterIds = effectsManager.createMultiRowExplosion(
    clearedRows,
    grid.width,
    30,  // cellSize
    blockColors
  );

  console.log(`Created ${emitterIds.length} explosions`);
}

// Game loop
let lastTime = performance.now();

function gameLoop(): void {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // Update particles
  effectsManager.update(deltaTime);

  // Render
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  renderer.render(gameState);
  effectsManager.render();

  requestAnimationFrame(gameLoop);
}

// On game over
function onGameOver(): void {
  effectsManager.stopAll();
}

gameLoop();
```

---

## Performance Guarantees

- **createRowClearExplosion**: <1ms (spawns 120 particles for 10-block row)
- **update**: <5ms for 150 active particles
- **render**: <3ms for 150 active particles
- **stopEmitter**: <0.1ms
- **stopAll**: <0.5ms

**Total Frame Budget**: ~8ms for typical explosion (100 particles)

---

## Error Handling

### Invalid Input

```typescript
// Throws Error
effectsManager.createRowClearExplosion(-1, 10, 30, colors);  // Negative row
effectsManager.createRowClearExplosion(0, 10, 0, colors);    // Zero cellSize
effectsManager.createRowClearExplosion(0, 10, 30, []);       // Empty colors
```

### Performance Limits

```typescript
// If particle count exceeds MAX_ACTIVE_PARTICLES (150):
// - New particles are not spawned
// - Warning logged to console
// - Existing particles continue normally
```

### Graceful Degradation

```typescript
// If rendering fails:
try {
  effectsManager.render();
} catch (error) {
  console.error('Particle rendering failed', error);
  // Game continues without particle effects
}
```

---

## Testing Contract

### Unit Tests Required

1. **Particle Spawning**
   - `createRowClearExplosion` spawns correct number of particles
   - Particles have random velocities within range
   - Particles inherit block colors

2. **Particle Physics**
   - Gravity applied correctly each frame
   - Particle life decreases over time
   - Dead particles removed from active list

3. **Object Pooling**
   - Particles reused from pool
   - Pool size never exceeds limit
   - Released particles reset correctly

4. **Emitter Management**
   - `stopEmitter` removes specific emitter
   - `stopAll` clears all emitters
   - Completed emitters auto-removed

### Integration Tests Required

1. Multiple simultaneous explosions work correctly
2. Particle rendering doesn't interfere with game rendering
3. Performance maintained with 150 active particles

### Performance Tests Required

1. `update` completes within 5ms for 150 particles
2. `render` completes within 3ms for 150 particles
3. No memory leaks after 1000 explosions

---

**Contract Version**: 1.0.0
**Last Updated**: 2026-03-12
**Status**: ✅ Finalized
