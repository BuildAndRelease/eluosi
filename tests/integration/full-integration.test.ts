/**
 * Full Integration Tests
 *
 * Tests for all three features working together:
 * - Particle explosions (US1)
 * - 3D rendering (US2)
 * - Fast drop acceleration (US3)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  ParticlePool,
  createParticleEmitter,
  updateParticlePhysics,
  type ParticleEmitter,
} from '../../src/render/Effects';
import { toIsometric, calculateFaceColors } from '../../src/render/Renderer3D';
import { FastDropManager } from '../../src/utils/FastDropManager';

// T060: Integration test - Particle explosions with 3D blocks
describe('Particle Explosions with 3D Blocks', () => {
  const CELL_SIZE = 30;
  const GRID_WIDTH = 10;

  it('should create particle explosions at correct 3D positions', () => {
    const pool = new ParticlePool(200);
    const rowIndex = 15;
    const rowColors = Array(GRID_WIDTH).fill('#ff0000');

    const emitters: ParticleEmitter[] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      const emitter = createParticleEmitter(
        `row-${rowIndex}-block-${x}`,
        x,
        rowIndex,
        rowColors[x]!,
        CELL_SIZE,
        pool
      );
      emitters.push(emitter);
    }

    // Verify particles are at correct positions
    for (let x = 0; x < GRID_WIDTH; x++) {
      const emitter = emitters[x]!;
      const expectedCenterX = x * CELL_SIZE + CELL_SIZE / 2;
      const expectedCenterY = rowIndex * CELL_SIZE + CELL_SIZE / 2;

      for (const particle of emitter.particles) {
        expect(particle.x).toBe(expectedCenterX);
        expect(particle.y).toBe(expectedCenterY);
      }
    }

    // Verify 3D coordinates can be calculated for same positions
    for (let x = 0; x < GRID_WIDTH; x++) {
      const isoCoords = toIsometric(x, rowIndex, CELL_SIZE);
      expect(isoCoords.isoX).toBeDefined();
      expect(isoCoords.isoY).toBeDefined();
    }
  });

  it('should maintain particle colors matching 3D block colors', () => {
    const pool = new ParticlePool(200);
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];

    for (let i = 0; i < colors.length; i++) {
      const color = colors[i]!;
      const emitter = createParticleEmitter(`block-${i}`, i, 0, color, CELL_SIZE, pool);

      // Particle color should match block color
      for (const particle of emitter.particles) {
        expect(particle.color).toBe(color);
      }

      // 3D face colors should be derived from same base color
      const faceColors = calculateFaceColors(color);
      expect(faceColors.top).toBeDefined();
      expect(faceColors.left).toBeDefined();
      expect(faceColors.right).toBeDefined();
    }
  });

  it('should handle simultaneous particle and 3D rendering without conflicts', () => {
    const pool = new ParticlePool(200);

    // Create particles for row clear
    const emitters: ParticleEmitter[] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      const emitter = createParticleEmitter(`block-${x}`, x, 19, '#ff0000', CELL_SIZE, pool);
      emitters.push(emitter);
    }

    // Simulate physics update
    const updatedEmitters = emitters.map(emitter => ({
      ...emitter,
      particles: emitter.particles.map(p => updateParticlePhysics(p, 16.67, 0.3)),
    }));

    // Verify particles are still valid after update
    for (const emitter of updatedEmitters) {
      for (const particle of emitter.particles) {
        expect(particle.life).toBeGreaterThanOrEqual(0);
        expect(particle.life).toBeLessThanOrEqual(1);
      }
    }

    // Verify 3D rendering still works for remaining blocks
    for (let x = 0; x < GRID_WIDTH; x++) {
      const isoCoords = toIsometric(x, 18, CELL_SIZE); // Row above cleared row
      expect(isoCoords.isoX).toBeDefined();
    }
  });
});

// T061: Integration test - Fast drop with 3D rendering
describe('Fast Drop with 3D Rendering', () => {
  const CELL_SIZE = 30;

  it('should calculate correct 3D positions at different fall speeds', () => {
    const fastDrop = new FastDropManager();
    fastDrop.activate();

    // Simulate different time points during acceleration
    const timePoints = [0, 50, 100, 150, 200];

    for (const elapsed of timePoints) {
      const currentTime = performance.now() + elapsed;
      const multiplier = fastDrop.getSpeedMultiplier(currentTime);

      // 3D coordinates should be valid regardless of speed
      const isoCoords = toIsometric(5, 10, CELL_SIZE);
      expect(isoCoords.isoX).toBeDefined();
      expect(isoCoords.isoY).toBeDefined();
      expect(multiplier).toBeGreaterThanOrEqual(1.0);
      expect(multiplier).toBeLessThanOrEqual(8.0);
    }
  });

  it('should maintain 3D color accuracy during fast drop', () => {
    const fastDrop = new FastDropManager();
    fastDrop.activate();

    const currentTime = performance.now() + 100;
    const multiplier = fastDrop.getSpeedMultiplier(currentTime);

    // Colors should be consistent regardless of speed
    const faceColors = calculateFaceColors('#00ffff');
    expect(faceColors.top).toBe('#00ffff');
    expect(faceColors.left).toBeDefined();
    expect(faceColors.right).toBeDefined();

    // Speed multiplier should be in valid range
    expect(multiplier).toBeGreaterThan(1.0);
  });
});

// T062: Integration test - All three features together
describe('All Three Features Integration', () => {
  const CELL_SIZE = 30;
  const GRID_WIDTH = 10;

  it('should handle particle explosion + 3D rendering + fast drop simultaneously', () => {
    // Setup all three systems
    const pool = new ParticlePool(200);
    const fastDrop = new FastDropManager();

    // Activate fast drop
    fastDrop.activate();
    const currentTime = performance.now() + 100;
    const multiplier = fastDrop.getSpeedMultiplier(currentTime);

    // Create particle explosion
    const emitters: ParticleEmitter[] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      const emitter = createParticleEmitter(`block-${x}`, x, 19, '#ff0000', CELL_SIZE, pool);
      emitters.push(emitter);
    }

    // Calculate 3D positions for remaining blocks
    const isoPositions = [];
    for (let y = 0; y < 19; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        isoPositions.push(toIsometric(x, y, CELL_SIZE));
      }
    }

    // All systems should work without conflicts
    expect(multiplier).toBeGreaterThan(1.0);
    expect(emitters.length).toBe(GRID_WIDTH);
    expect(isoPositions.length).toBe(19 * GRID_WIDTH);

    // Verify particle physics still work
    const updatedParticles = emitters[0]!.particles.map(p =>
      updateParticlePhysics(p, 16.67, 0.3)
    );
    expect(updatedParticles.length).toBe(12);
  });

  it('should handle game over scenario with all features active', () => {
    const pool = new ParticlePool(200);
    const fastDrop = new FastDropManager();

    // Activate fast drop
    fastDrop.activate();

    // Create particles
    const emitters: ParticleEmitter[] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      const emitter = createParticleEmitter(`block-${x}`, x, 19, '#ff0000', CELL_SIZE, pool);
      emitters.push(emitter);
    }

    // Simulate game over: deactivate fast drop
    fastDrop.deactivate();
    expect(fastDrop.isActive()).toBe(false);
    expect(fastDrop.getSpeedMultiplier(performance.now())).toBe(1.0);

    // Release all particles back to pool
    for (const emitter of emitters) {
      for (const particle of emitter.particles) {
        pool.release(particle);
      }
    }

    // Pool should have particles available again
    expect(pool.getAvailableCount()).toBeGreaterThan(0);
  });

  it('should handle Tetris (4-row clear) with fast drop active', () => {
    const pool = new ParticlePool(200);
    const fastDrop = new FastDropManager();

    fastDrop.activate();
    const currentTime = performance.now() + 200; // Full speed
    const multiplier = fastDrop.getSpeedMultiplier(currentTime);
    expect(multiplier).toBeCloseTo(8.0, 2);

    // Create 4-row explosion (Tetris)
    const clearedRows = [16, 17, 18, 19];
    const allEmitters: ParticleEmitter[] = [];

    for (const rowIndex of clearedRows) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const emitter = createParticleEmitter(
          `row-${rowIndex}-block-${x}`,
          x,
          rowIndex,
          '#0000ff',
          CELL_SIZE,
          pool
        );
        allEmitters.push(emitter);
      }
    }

    // 4 rows * 10 blocks = 40 emitters
    expect(allEmitters.length).toBe(40);

    // 40 emitters * 12 particles = 480 particles
    const totalParticles = allEmitters.reduce((sum, e) => sum + e.particles.length, 0);
    expect(totalParticles).toBe(480);
  });
});

// T063-T065: Performance validation
describe('Performance Validation', () => {
  const CELL_SIZE = 30;
  const GRID_WIDTH = 10;

  it('T063: should maintain 60fps with all features active', () => {
    const pool = new ParticlePool(200);
    const fastDrop = new FastDropManager();
    fastDrop.activate();

    // Create particles
    const emitters: ParticleEmitter[] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      const emitter = createParticleEmitter(`block-${x}`, x, 19, '#ff0000', CELL_SIZE, pool);
      emitters.push(emitter);
    }

    const frameCount = 60;
    const frameTimes: number[] = [];

    for (let frame = 0; frame < frameCount; frame++) {
      const startTime = performance.now();

      // Simulate frame work: update particles + calculate 3D + get speed
      const currentTime = performance.now();
      fastDrop.getSpeedMultiplier(currentTime);

      for (const emitter of emitters) {
        emitter.particles = emitter.particles.map(p => updateParticlePhysics(p, 16.67, 0.3));
      }

      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          toIsometric(x, y, CELL_SIZE);
        }
      }

      const endTime = performance.now();
      frameTimes.push(endTime - startTime);
    }

    const avgFrameTime = frameTimes.reduce((sum, t) => sum + t, 0) / frameTimes.length;
    expect(avgFrameTime).toBeLessThan(16.67); // 60fps budget
  });

  it('T064: should maintain <50ms input latency for fast drop', () => {
    const fastDrop = new FastDropManager();

    const startTime = performance.now();
    fastDrop.activate();
    const activateTime = performance.now() - startTime;

    const startTime2 = performance.now();
    fastDrop.deactivate();
    const deactivateTime = performance.now() - startTime2;

    expect(activateTime).toBeLessThan(50);
    expect(deactivateTime).toBeLessThan(50);
  });

  it('T065: should handle 10 minutes of gameplay without memory issues', () => {
    const pool = new ParticlePool(200);
    const fastDrop = new FastDropManager();

    // Simulate many row clears over time
    const rowClearCount = 100; // Simulate 100 row clears

    for (let i = 0; i < rowClearCount; i++) {
      const emitters: ParticleEmitter[] = [];

      for (let x = 0; x < GRID_WIDTH; x++) {
        const emitter = createParticleEmitter(`clear-${i}-block-${x}`, x, 19, '#ff0000', CELL_SIZE, pool);
        emitters.push(emitter);
      }

      // Simulate particle lifecycle
      for (const emitter of emitters) {
        for (const particle of emitter.particles) {
          pool.release(particle);
        }
      }
    }

    // Pool should still be functional
    expect(pool.getAvailableCount()).toBeGreaterThan(0);
    expect(pool.getCapacity()).toBe(200);
  });
});

// T066-T068: Edge cases
describe('Edge Cases', () => {
  const CELL_SIZE = 30;
  const GRID_WIDTH = 10;

  it('T066: game over should interrupt particle animation correctly', () => {
    const pool = new ParticlePool(200);
    const fastDrop = new FastDropManager();

    fastDrop.activate();

    // Create particles
    const emitters: ParticleEmitter[] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      const emitter = createParticleEmitter(`block-${x}`, x, 19, '#ff0000', CELL_SIZE, pool);
      emitters.push(emitter);
    }

    // Game over: stop all
    fastDrop.deactivate();
    for (const emitter of emitters) {
      for (const particle of emitter.particles) {
        pool.release(particle);
      }
    }

    expect(fastDrop.isActive()).toBe(false);
    expect(pool.getAvailableCount()).toBeGreaterThan(0);
  });

  it('T067: multiple simultaneous row clears should work correctly', () => {
    const pool = new ParticlePool(200);
    const clearedRows = [16, 17, 18, 19];
    const allEmitters: ParticleEmitter[] = [];

    for (const rowIndex of clearedRows) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const emitter = createParticleEmitter(
          `row-${rowIndex}-block-${x}`,
          x,
          rowIndex,
          '#ff0000',
          CELL_SIZE,
          pool
        );
        allEmitters.push(emitter);
      }
    }

    // All emitters should be active
    for (const emitter of allEmitters) {
      expect(emitter.active).toBe(true);
    }

    // All IDs should be unique
    const ids = allEmitters.map(e => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('T068: fast drop repeated presses should be handled correctly', () => {
    const fastDrop = new FastDropManager();

    // Rapid press/release cycles
    for (let i = 0; i < 10; i++) {
      fastDrop.activate();
      expect(fastDrop.isActive()).toBe(true);

      fastDrop.deactivate();
      expect(fastDrop.isActive()).toBe(false);
    }

    // Final state should be inactive
    expect(fastDrop.isActive()).toBe(false);
    expect(fastDrop.getSpeedMultiplier(performance.now())).toBe(1.0);
  });
});
