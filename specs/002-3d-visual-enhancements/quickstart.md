# Quickstart: 3D Visual Enhancements

**Feature**: 002-3d-visual-enhancements
**Audience**: Developers implementing or extending the 3D rendering system
**Last Updated**: 2026-03-12

---

## Overview

This guide helps you quickly understand and work with the 3D visual enhancements system, including isometric rendering, particle explosions, and fast drop acceleration.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Game Loop (main.ts)                  │
│                  requestAnimationFrame                   │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│  InputHandler   │    │   Game (V1)      │
│   (Modified)    │───▶│   (Unchanged)    │
└─────────────────┘    └────────┬─────────┘
         │                       │
         │ FastDropState         │ GameState
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│ AnimationMgr    │    │   Renderer (V1)  │
│     (NEW)       │◀───│   (Modified)     │
└─────────────────┘    └────────┬─────────┘
         │                       │
         │                       ├──────────┐
         ▼                       ▼          ▼
┌─────────────────┐    ┌──────────────┐  ┌──────────────┐
│ EffectsManager  │    │ Renderer3D   │  │  Metallic    │
│     (NEW)       │    │    (NEW)     │  │  Effects     │
└─────────────────┘    └──────────────┘  │    (V1)      │
         │                                └──────────────┘
         ▼
┌─────────────────┐
│  ParticlePool   │
│     (NEW)       │
└─────────────────┘
```

---

## Quick Start: Adding 3D Rendering

### Step 1: Initialize Renderer3D

```typescript
import { Renderer3D } from './render/Renderer3D';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const renderer3D = new Renderer3D(ctx, 30);  // 30px cell size
```

### Step 2: Render 3D Blocks

```typescript
// In your render loop
function render(gameState: GameState): void {
  // Clear canvas
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render grid with 3D blocks
  renderer3D.renderGrid(gameState.grid);

  // Render current piece
  if (gameState.currentPiece) {
    renderer3D.renderPiece(gameState.currentPiece);
  }
}
```

### Step 3: Test It

```bash
npm run dev
```

Open browser, you should see 3D isometric blocks with three visible faces.

---

## Quick Start: Adding Particle Explosions

### Step 1: Initialize EffectsManager

```typescript
import { EffectsManager } from './render/Effects';

const effectsManager = new EffectsManager(ctx);
```

### Step 2: Trigger Explosion on Row Clear

```typescript
// In your game logic (when rows are cleared)
function onRowsClear(clearedRows: number[], grid: Grid): void {
  // Extract colors for each cleared row
  const blockColors = clearedRows.map(rowIndex =>
    grid.cells[rowIndex].map(cell => cell || '#ffffff')
  );

  // Create explosions
  effectsManager.createMultiRowExplosion(
    clearedRows,
    grid.width,
    30,  // cellSize
    blockColors
  );
}
```

### Step 3: Update and Render Particles

```typescript
let lastTime = performance.now();

function gameLoop(): void {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // Update game logic
  game.update(deltaTime);

  // Update particles
  effectsManager.update(deltaTime);

  // Render everything
  render(game.getGameState());
  effectsManager.render();  // Render particles on top

  requestAnimationFrame(gameLoop);
}
```

### Step 4: Test It

Clear a row in the game, you should see particles explode and scatter.

---

## Quick Start: Adding Fast Drop Acceleration

### Step 1: Modify InputHandler

```typescript
// In InputHandler.ts
class InputHandler {
  private fastDropState = {
    active: false,
    startTime: 0,
    currentMultiplier: 1.0
  };

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      this.activateFastDrop();
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      this.deactivateFastDrop();
    }
  }

  private activateFastDrop(): void {
    this.fastDropState.active = true;
    this.fastDropState.startTime = performance.now();
  }

  private deactivateFastDrop(): void {
    this.fastDropState.active = false;
    this.fastDropState.currentMultiplier = 1.0;
  }

  public getSpeedMultiplier(currentTime: number): number {
    if (!this.fastDropState.active) return 1.0;

    const elapsed = currentTime - this.fastDropState.startTime;
    const progress = Math.min(1.0, elapsed / 200);  // 0.2s ramp

    // Linear interpolation: 1.0 → 8.0
    return 1.0 + 7.0 * progress;
  }
}
```

### Step 2: Apply Multiplier in Game Loop

```typescript
// In Game.ts update method
public update(deltaTime: number): void {
  if (this.state.status !== 'playing') return;

  const speedMultiplier = this.inputHandler.getSpeedMultiplier(performance.now());
  const adjustedDelta = deltaTime * speedMultiplier;

  // Use adjustedDelta for drop timing
  this.dropTimer += adjustedDelta;

  if (this.dropTimer >= this.getDropInterval()) {
    this.moveDown();
    this.dropTimer = 0;
  }
}
```

### Step 3: Test It

Hold spacebar while playing, blocks should accelerate smoothly to 8x speed.

---

## Common Tasks

### Task: Change 3D Face Brightness

Edit `Renderer3D.ts`:

```typescript
const FACE_BRIGHTNESS = {
  TOP: 1.0,    // 100% (change this)
  LEFT: 0.7,   // 70% (change this)
  RIGHT: 0.5   // 50% (change this)
};
```

### Task: Adjust Particle Count

Edit `Effects.ts`:

```typescript
const PARTICLES_PER_BLOCK = 12;  // Change this (10-15 recommended)
```

### Task: Change Particle Lifetime

Edit `Effects.ts`:

```typescript
const PARTICLE_LIFETIME = 1000;  // milliseconds (change this)
```

### Task: Adjust Fast Drop Speed

Edit `InputHandler.ts`:

```typescript
const MAX_MULTIPLIER = 8;  // Change this (8x recommended)
const RAMP_DURATION = 200;  // milliseconds (change this)
```

### Task: Add Motion Blur to Fast Drop

In `Renderer.ts`, add trail rendering:

```typescript
if (fastDropActive) {
  ctx.save();
  ctx.globalAlpha = 0.3;
  // Render piece at previous position
  renderer3D.renderPiece(previousPiece);
  ctx.restore();
}
```

---

## Debugging Tips

### Check Particle Count

```typescript
console.log('Active particles:', effectsManager.getActiveParticleCount());
console.log('Active emitters:', effectsManager.getActiveEmitterCount());
```

### Visualize Isometric Coordinates

```typescript
const { isoX, isoY } = renderer3D.toIsometric(gridX, gridY);
ctx.fillStyle = 'red';
ctx.fillRect(isoX, isoY, 5, 5);  // Draw red dot at isometric position
```

### Monitor Frame Rate

```typescript
let frameCount = 0;
let lastFpsTime = performance.now();

function gameLoop(): void {
  frameCount++;
  const now = performance.now();

  if (now - lastFpsTime >= 1000) {
    console.log(`FPS: ${frameCount}`);
    frameCount = 0;
    lastFpsTime = now;
  }

  // ... rest of game loop
}
```

### Profile Performance

```typescript
const startTime = performance.now();
effectsManager.update(deltaTime);
const updateTime = performance.now() - startTime;

if (updateTime > 5) {
  console.warn(`Particle update took ${updateTime.toFixed(2)}ms (target: <5ms)`);
}
```

---

## Performance Optimization

### Reduce Particle Count

If frame rate drops below 60fps:

```typescript
// In Effects.ts
const PARTICLES_PER_BLOCK = 8;  // Reduce from 12
const MAX_ACTIVE_PARTICLES = 100;  // Reduce from 150
```

### Enable Particle Culling

Add to `EffectsManager.render()`:

```typescript
render(): void {
  for (const particle of this.activeParticles) {
    // Cull off-screen particles
    if (particle.x < 0 || particle.x > canvas.width ||
        particle.y < 0 || particle.y > canvas.height) {
      continue;
    }

    // Render particle
    this.renderParticle(particle);
  }
}
```

### Cache Gradients

In `Renderer3D.ts`:

```typescript
private gradientCache = new Map<string, CanvasGradient>();

private getGradient(color: string): CanvasGradient {
  if (this.gradientCache.has(color)) {
    return this.gradientCache.get(color)!;
  }

  const gradient = this.createGradient(color);
  this.gradientCache.set(color, gradient);
  return gradient;
}
```

---

## Testing

### Run Unit Tests

```bash
npm run test
```

### Run Specific Test File

```bash
npm run test particle-system.test.ts
```

### Run with Coverage

```bash
npm run test:coverage
```

### Watch Mode (TDD)

```bash
npm run test:watch
```

---

## File Structure Reference

```
src/
├── render/
│   ├── Renderer.ts          # Main renderer (modified)
│   ├── Renderer3D.ts        # NEW: Isometric 3D rendering
│   ├── Effects.ts           # NEW: Particle system
│   ├── metallic-effects.ts  # V1 metallic gradients
│   └── styles.ts            # Color schemes (modified)
├── input/
│   └── InputHandler.ts      # Input handling (modified)
├── utils/
│   └── AnimationManager.ts  # NEW: Animation lifecycle
└── game/
    └── ...                  # V1 core logic (unchanged)

tests/
├── unit/
│   ├── particle-system.test.ts
│   ├── 3d-transforms.test.ts
│   ├── animation-manager.test.ts
│   └── fast-drop.test.ts
└── integration/
    ├── 3d-rendering.test.ts
    └── particle-animation.test.ts
```

---

## API Reference

For detailed API documentation, see:

- [Renderer3D API](./contracts/renderer3d-api.md)
- [Effects API](./contracts/effects-api.md)
- [Data Model](./data-model.md)

---

## Troubleshooting

### Problem: 3D blocks look flat

**Solution**: Check face brightness settings in `Renderer3D.ts`. Ensure `LEFT` and `RIGHT` faces are darker than `TOP` face.

### Problem: Particles not appearing

**Solution**:
1. Check `effectsManager.render()` is called after game rendering
2. Verify `effectsManager.update()` is called each frame
3. Check console for errors

### Problem: Frame rate drops during explosions

**Solution**:
1. Reduce `PARTICLES_PER_BLOCK` in `Effects.ts`
2. Enable particle culling (see Performance Optimization)
3. Check particle count: `effectsManager.getActiveParticleCount()`

### Problem: Fast drop feels instant

**Solution**: Increase `RAMP_DURATION` in `InputHandler.ts` from 200ms to 300-400ms.

### Problem: Fast drop not working

**Solution**:
1. Check spacebar event listeners are registered
2. Verify `getSpeedMultiplier()` is called in game update loop
3. Check `fastDropState.active` is set to `true` on keydown

---

## Next Steps

1. **Implement Renderer3D**: Start with `toIsometric()` and `renderBlock()`
2. **Add Particle System**: Implement `ParticlePool` and `EffectsManager`
3. **Integrate Fast Drop**: Modify `InputHandler` and `Game.update()`
4. **Write Tests**: Follow TDD workflow (tests first!)
5. **Optimize Performance**: Profile and optimize to maintain 60fps

---

## Resources

- [Implementation Plan](./plan.md)
- [Research Document](./research.md)
- [Data Model](./data-model.md)
- [Renderer3D API Contract](./contracts/renderer3d-api.md)
- [Effects API Contract](./contracts/effects-api.md)

---

**Quickstart Version**: 1.0.0
**Last Updated**: 2026-03-12
**Status**: ✅ Complete
