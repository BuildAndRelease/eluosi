/**
 * Particle Animation Integration Tests
 *
 * Tests for particle explosion integration with game logic and performance.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ParticlePool,
  createParticleEmitter,
  updateParticlePhysics,
  type ParticleEmitter,
} from '../../src/render/Effects';

// T013: Integration test for row clear triggering particle explosion
describe('Row Clear Particle Explosion Integration', () => {
  let pool: ParticlePool;
  const CELL_SIZE = 30;
  const GRID_WIDTH = 10;

  beforeEach(() => {
    pool = new ParticlePool(200);
  });

  it('should create explosion for single row clear', () => {
    const rowIndex = 19; // Bottom row
    const rowColors = Array(GRID_WIDTH).fill('#ff0000');

    // Create emitters for each block in the row
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

    expect(emitters.length).toBe(GRID_WIDTH);

    // Verify all emitters are active
    for (const emitter of emitters) {
      expect(emitter.active).toBe(true);
      expect(emitter.particles.length).toBe(12);
    }

    // Total particles = 10 blocks * 12 particles = 120
    const totalParticles = emitters.reduce((sum, e) => sum + e.particles.length, 0);
    expect(totalParticles).toBe(120);
  });

  it('should position particles correctly for each block in row', () => {
    const rowIndex = 15;
    const rowColors = Array(GRID_WIDTH).fill('#00ff00');

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

    // Verify each emitter's particles start at correct block center
    for (let x = 0; x < GRID_WIDTH; x++) {
      const emitter = emitters[x]!;
      const expectedCenterX = x * CELL_SIZE + CELL_SIZE / 2;
      const expectedCenterY = rowIndex * CELL_SIZE + CELL_SIZE / 2;

      for (const particle of emitter.particles) {
        expect(particle.x).toBe(expectedCenterX);
        expect(particle.y).toBe(expectedCenterY);
      }
    }
  });

  it('should inherit colors from cleared row blocks', () => {
    const rowIndex = 10;
    const rowColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#ff8800', '#8800ff', '#00ff88'];

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

    // Verify each emitter's particles have correct color
    for (let x = 0; x < GRID_WIDTH; x++) {
      const emitter = emitters[x]!;
      const expectedColor = rowColors[x]!;

      for (const particle of emitter.particles) {
        expect(particle.color).toBe(expectedColor);
      }
    }
  });
});

// T014: Integration test for multiple simultaneous row explosions
describe('Multiple Simultaneous Row Explosions', () => {
  let pool: ParticlePool;
  const CELL_SIZE = 30;
  const GRID_WIDTH = 10;

  beforeEach(() => {
    pool = new ParticlePool(200);
  });

  it('should handle double row clear (2 rows)', () => {
    const clearedRows = [18, 19]; // Two bottom rows
    const allEmitters: ParticleEmitter[] = [];

    for (const rowIndex of clearedRows) {
      const rowColors = Array(GRID_WIDTH).fill('#ff0000');
      for (let x = 0; x < GRID_WIDTH; x++) {
        const emitter = createParticleEmitter(
          `row-${rowIndex}-block-${x}`,
          x,
          rowIndex,
          rowColors[x]!,
          CELL_SIZE,
          pool
        );
        allEmitters.push(emitter);
      }
    }

    // 2 rows * 10 blocks = 20 emitters
    expect(allEmitters.length).toBe(20);

    // 20 emitters * 12 particles = 240 particles
    const totalParticles = allEmitters.reduce((sum, e) => sum + e.particles.length, 0);
    expect(totalParticles).toBe(240);
  });

  it('should handle triple row clear (3 rows)', () => {
    const clearedRows = [17, 18, 19];
    const allEmitters: ParticleEmitter[] = [];

    for (const rowIndex of clearedRows) {
      const rowColors = Array(GRID_WIDTH).fill('#00ff00');
      for (let x = 0; x < GRID_WIDTH; x++) {
        const emitter = createParticleEmitter(
          `row-${rowIndex}-block-${x}`,
          x,
          rowIndex,
          rowColors[x]!,
          CELL_SIZE,
          pool
        );
        allEmitters.push(emitter);
      }
    }

    // 3 rows * 10 blocks = 30 emitters
    expect(allEmitters.length).toBe(30);

    // 30 emitters * 12 particles = 360 particles (exceeds pool, should create new)
    const totalParticles = allEmitters.reduce((sum, e) => sum + e.particles.length, 0);
    expect(totalParticles).toBe(360);
  });

  it('should handle tetris (4 rows)', () => {
    const clearedRows = [16, 17, 18, 19];
    const allEmitters: ParticleEmitter[] = [];

    for (const rowIndex of clearedRows) {
      const rowColors = Array(GRID_WIDTH).fill('#0000ff');
      for (let x = 0; x < GRID_WIDTH; x++) {
        const emitter = createParticleEmitter(
          `row-${rowIndex}-block-${x}`,
          x,
          rowIndex,
          rowColors[x]!,
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

  it('should maintain unique emitter IDs for multiple rows', () => {
    const clearedRows = [17, 18, 19];
    const allEmitters: ParticleEmitter[] = [];

    for (const rowIndex of clearedRows) {
      const rowColors = Array(GRID_WIDTH).fill('#ff0000');
      for (let x = 0; x < GRID_WIDTH; x++) {
        const emitter = createParticleEmitter(
          `row-${rowIndex}-block-${x}`,
          x,
          rowIndex,
          rowColors[x]!,
          CELL_SIZE,
          pool
        );
        allEmitters.push(emitter);
      }
    }

    // Check all IDs are unique
    const ids = allEmitters.map((e) => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

// T015: Performance test for 150 active particles maintaining 60fps
describe('Particle System Performance', () => {
  const GRAVITY = 0.3;
  const TARGET_FPS = 60;
  const FRAME_BUDGET_MS = 1000 / TARGET_FPS; // 16.67ms

  it('should update 150 particles within frame budget', () => {
    const pool = new ParticlePool(200);
    const particles = [];

    // Create 150 particles
    for (let i = 0; i < 150; i++) {
      particles.push(pool.acquire(100 + i, 200, '#ff0000'));
    }

    const startTime = performance.now();

    // Update all particles (simulating one frame)
    const updatedParticles = particles.map((p) => updateParticlePhysics(p, 16.67, GRAVITY));

    const endTime = performance.now();
    const updateTime = endTime - startTime;

    // Should complete within 5ms (well under 16.67ms frame budget)
    expect(updateTime).toBeLessThan(5);
    expect(updatedParticles.length).toBe(150);
  });

  it('should handle 200 particles (max pool) efficiently', () => {
    const pool = new ParticlePool(200);
    const particles = [];

    // Create 200 particles (full pool)
    for (let i = 0; i < 200; i++) {
      particles.push(pool.acquire(100 + i, 200, '#ff0000'));
    }

    const startTime = performance.now();

    // Update all particles
    const updatedParticles = particles.map((p) => updateParticlePhysics(p, 16.67, GRAVITY));

    const endTime = performance.now();
    const updateTime = endTime - startTime;

    // Should still be fast even with full pool
    expect(updateTime).toBeLessThan(8);
    expect(updatedParticles.length).toBe(200);
  });

  it('should maintain performance over multiple frames', () => {
    const pool = new ParticlePool(200);
    let particles = [];

    // Create 150 particles
    for (let i = 0; i < 150; i++) {
      particles.push(pool.acquire(100 + i, 200, '#ff0000'));
    }

    const frameTimes: number[] = [];

    // Simulate 60 frames (1 second at 60fps)
    for (let frame = 0; frame < 60; frame++) {
      const startTime = performance.now();

      particles = particles.map((p) => updateParticlePhysics(p, 16.67, GRAVITY));

      const endTime = performance.now();
      frameTimes.push(endTime - startTime);
    }

    // Calculate average frame time
    const avgFrameTime = frameTimes.reduce((sum, t) => sum + t, 0) / frameTimes.length;

    // Average should be well under frame budget
    expect(avgFrameTime).toBeLessThan(5);

    // No frame should exceed budget
    const maxFrameTime = Math.max(...frameTimes);
    expect(maxFrameTime).toBeLessThan(FRAME_BUDGET_MS);
  });

  it('should handle particle lifecycle efficiently', () => {
    const pool = new ParticlePool(200);
    let particles = [];

    // Create 150 particles
    for (let i = 0; i < 150; i++) {
      particles.push(pool.acquire(100 + i, 200, '#ff0000'));
    }

    const startTime = performance.now();

    // Simulate full particle lifecycle (60 frames = 1 second)
    for (let frame = 0; frame < 60; frame++) {
      particles = particles.map((p) => updateParticlePhysics(p, 16.67, GRAVITY));

      // Remove dead particles and release to pool
      particles = particles.filter((p) => {
        if (p.life <= 0) {
          pool.release(p);
          return false;
        }
        return true;
      });
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Full lifecycle should complete quickly
    expect(totalTime).toBeLessThan(300); // 300ms for 60 frames

    // All particles should be dead and returned to pool
    expect(particles.length).toBe(0);
    expect(pool.getAvailableCount()).toBeGreaterThan(0);
  });
});
