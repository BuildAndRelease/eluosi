/**
 * Particle System Tests
 *
 * Tests for ParticlePool object pooling and particle physics simulation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  ParticlePool,
  type Particle,
  updateParticlePhysics,
  createParticleEmitter,
  type ParticleEmitter,
} from '../../src/render/Effects';

describe('ParticlePool', () => {
  let pool: ParticlePool;

  beforeEach(() => {
    pool = new ParticlePool(50); // Smaller pool for testing
  });

  describe('constructor', () => {
    it('should pre-allocate particles', () => {
      expect(pool.getAvailableCount()).toBe(50);
      expect(pool.getCapacity()).toBe(50);
    });

    it('should use default pool size of 200', () => {
      const defaultPool = new ParticlePool();
      expect(defaultPool.getCapacity()).toBe(200);
      expect(defaultPool.getAvailableCount()).toBe(200);
    });
  });

  describe('acquire', () => {
    it('should return a particle with initialized values', () => {
      const particle = pool.acquire(100, 200, '#ff0000');

      expect(particle.x).toBe(100);
      expect(particle.y).toBe(200);
      expect(particle.color).toBe('#ff0000');
      expect(particle.life).toBe(1.0);
      expect(particle.size).toBeGreaterThanOrEqual(4);
      expect(particle.size).toBeLessThanOrEqual(8);
      expect(particle.depth).toBeGreaterThanOrEqual(0);
      expect(particle.depth).toBeLessThanOrEqual(1);
    });

    it('should initialize velocity with random values', () => {
      const particle = pool.acquire(0, 0, '#ffffff');

      // vx should be between -5 and 5
      expect(particle.vx).toBeGreaterThanOrEqual(-5);
      expect(particle.vx).toBeLessThanOrEqual(5);

      // vy should be between -15 and 0 (upward)
      expect(particle.vy).toBeGreaterThanOrEqual(-15);
      expect(particle.vy).toBeLessThanOrEqual(0);
    });

    it('should reduce available count when acquiring', () => {
      const initialCount = pool.getAvailableCount();
      pool.acquire(0, 0, '#ffffff');
      expect(pool.getAvailableCount()).toBe(initialCount - 1);
    });

    it('should create new particle if pool is exhausted', () => {
      // Exhaust the pool
      for (let i = 0; i < 50; i++) {
        pool.acquire(0, 0, '#ffffff');
      }

      expect(pool.getAvailableCount()).toBe(0);

      // Should still be able to acquire (creates new)
      const particle = pool.acquire(0, 0, '#ffffff');
      expect(particle).toBeDefined();
      expect(particle.life).toBe(1.0);
    });

    it('should reinitialize particles from pool', () => {
      const particle1 = pool.acquire(100, 200, '#ff0000');
      pool.release(particle1);

      const particle2 = pool.acquire(300, 400, '#00ff00');

      // Should be the same object, but with new values
      expect(particle2).toBe(particle1);
      expect(particle2.x).toBe(300);
      expect(particle2.y).toBe(400);
      expect(particle2.color).toBe('#00ff00');
      expect(particle2.life).toBe(1.0);
    });
  });

  describe('release', () => {
    it('should return particle to pool', () => {
      const particle = pool.acquire(0, 0, '#ffffff');
      const countAfterAcquire = pool.getAvailableCount();

      pool.release(particle);

      expect(pool.getAvailableCount()).toBe(countAfterAcquire + 1);
    });

    it('should reset particle life to 0', () => {
      const particle = pool.acquire(0, 0, '#ffffff');
      expect(particle.life).toBe(1.0);

      pool.release(particle);
      expect(particle.life).toBe(0);
    });

    it('should not exceed pool capacity', () => {
      const particles: Particle[] = [];

      // Acquire all particles
      for (let i = 0; i < 50; i++) {
        particles.push(pool.acquire(0, 0, '#ffffff'));
      }

      // Release all particles
      for (const particle of particles) {
        pool.release(particle);
      }

      // Should not exceed capacity
      expect(pool.getAvailableCount()).toBe(50);
      expect(pool.getAvailableCount()).toBeLessThanOrEqual(pool.getCapacity());
    });

    it('should allow particle reuse after release', () => {
      const particle1 = pool.acquire(100, 200, '#ff0000');
      const initialCount = pool.getAvailableCount();

      pool.release(particle1);
      expect(pool.getAvailableCount()).toBe(initialCount + 1);

      const particle2 = pool.acquire(300, 400, '#00ff00');
      expect(particle2).toBe(particle1); // Same object reused
      expect(particle2.x).toBe(300);
      expect(particle2.y).toBe(400);
    });
  });

  describe('getAvailableCount', () => {
    it('should return correct count after acquire and release', () => {
      const initial = pool.getAvailableCount();

      const p1 = pool.acquire(0, 0, '#ffffff');
      expect(pool.getAvailableCount()).toBe(initial - 1);

      const p2 = pool.acquire(0, 0, '#ffffff');
      expect(pool.getAvailableCount()).toBe(initial - 2);

      pool.release(p1);
      expect(pool.getAvailableCount()).toBe(initial - 1);

      pool.release(p2);
      expect(pool.getAvailableCount()).toBe(initial);
    });
  });

  describe('getCapacity', () => {
    it('should return the pool capacity', () => {
      expect(pool.getCapacity()).toBe(50);
    });

    it('should not change after acquire/release', () => {
      const capacity = pool.getCapacity();

      pool.acquire(0, 0, '#ffffff');
      expect(pool.getCapacity()).toBe(capacity);

      const particle = pool.acquire(0, 0, '#ffffff');
      pool.release(particle);
      expect(pool.getCapacity()).toBe(capacity);
    });
  });

  describe('particle physics properties', () => {
    it('should generate particles with valid size range', () => {
      const particles: Particle[] = [];
      for (let i = 0; i < 20; i++) {
        particles.push(pool.acquire(0, 0, '#ffffff'));
      }

      for (const particle of particles) {
        expect(particle.size).toBeGreaterThanOrEqual(4);
        expect(particle.size).toBeLessThanOrEqual(8);
      }
    });

    it('should generate particles with valid depth range', () => {
      const particles: Particle[] = [];
      for (let i = 0; i < 20; i++) {
        particles.push(pool.acquire(0, 0, '#ffffff'));
      }

      for (const particle of particles) {
        expect(particle.depth).toBeGreaterThanOrEqual(0);
        expect(particle.depth).toBeLessThanOrEqual(1);
      }
    });

    it('should generate particles with upward initial velocity', () => {
      const particles: Particle[] = [];
      for (let i = 0; i < 20; i++) {
        particles.push(pool.acquire(0, 0, '#ffffff'));
      }

      for (const particle of particles) {
        // vy should be negative (upward)
        expect(particle.vy).toBeLessThanOrEqual(0);
        expect(particle.vy).toBeGreaterThanOrEqual(-15);
      }
    });

    it('should generate particles with varied horizontal velocity', () => {
      const particles: Particle[] = [];
      for (let i = 0; i < 20; i++) {
        particles.push(pool.acquire(0, 0, '#ffffff'));
      }

      // Check that we have some variation in vx
      const vxValues = particles.map((p) => p.vx);
      const uniqueVx = new Set(vxValues);

      // Should have at least some variation (not all the same)
      expect(uniqueVx.size).toBeGreaterThan(1);
    });
  });
});

// T011: Unit test for Particle physics simulation
describe('Particle Physics Simulation', () => {
  const GRAVITY = 0.3;
  const LIFE_DECAY_RATE = 1 / 60; // 1 second at 60fps

  describe('updateParticlePhysics', () => {
    it('should apply gravity to vertical velocity', () => {
      const particle: Particle = {
        x: 100,
        y: 200,
        vx: 2,
        vy: -10,
        life: 1.0,
        color: '#ff0000',
        size: 6,
        depth: 0.5,
      };

      const updated = updateParticlePhysics(particle, 16.67, GRAVITY);

      // vy should increase (become less negative) due to gravity
      expect(updated.vy).toBeGreaterThan(particle.vy);
      expect(updated.vy).toBeCloseTo(-10 + GRAVITY, 2);
    });

    it('should update position based on velocity', () => {
      const particle: Particle = {
        x: 100,
        y: 200,
        vx: 5,
        vy: -10,
        life: 1.0,
        color: '#ff0000',
        size: 6,
        depth: 0.5,
      };

      const updated = updateParticlePhysics(particle, 16.67, GRAVITY);

      expect(updated.x).toBe(105); // 100 + 5
      expect(updated.y).toBeCloseTo(190, 1); // 200 + (-10)
    });

    it('should decrease particle life over time', () => {
      const particle: Particle = {
        x: 100,
        y: 200,
        vx: 0,
        vy: 0,
        life: 1.0,
        color: '#ff0000',
        size: 6,
        depth: 0.5,
      };

      const updated = updateParticlePhysics(particle, 16.67, GRAVITY);

      expect(updated.life).toBeLessThan(1.0);
      expect(updated.life).toBeGreaterThan(0.95); // Should decay slowly
    });

    it('should not mutate original particle (immutability)', () => {
      const particle: Particle = {
        x: 100,
        y: 200,
        vx: 5,
        vy: -10,
        life: 1.0,
        color: '#ff0000',
        size: 6,
        depth: 0.5,
      };

      const originalX = particle.x;
      const originalY = particle.y;
      const originalVy = particle.vy;
      const originalLife = particle.life;

      updateParticlePhysics(particle, 16.67, GRAVITY);

      // Original particle should be unchanged
      expect(particle.x).toBe(originalX);
      expect(particle.y).toBe(originalY);
      expect(particle.vy).toBe(originalVy);
      expect(particle.life).toBe(originalLife);
    });

    it('should handle multiple physics updates correctly', () => {
      let particle: Particle = {
        x: 100,
        y: 200,
        vx: 0,
        vy: -15, // Strong upward velocity
        life: 1.0,
        color: '#ff0000',
        size: 6,
        depth: 0.5,
      };

      // Simulate 10 frames
      for (let i = 0; i < 10; i++) {
        particle = updateParticlePhysics(particle, 16.67, GRAVITY);
      }

      // After 10 frames, particle should have:
      // - Moved upward initially, then fallen back down
      // - Velocity should be less negative or positive (gravity effect)
      // - Life should have decayed
      expect(particle.vy).toBeGreaterThan(-15); // Gravity slowed upward motion
      expect(particle.life).toBeLessThan(1.0);
      expect(particle.life).toBeGreaterThan(0.8); // Still alive after 10 frames
    });

    it('should clamp life to 0 minimum', () => {
      const particle: Particle = {
        x: 100,
        y: 200,
        vx: 0,
        vy: 0,
        life: 0.01, // Almost dead
        color: '#ff0000',
        size: 6,
        depth: 0.5,
      };

      // Simulate many frames to ensure life goes to 0
      let updated = particle;
      for (let i = 0; i < 100; i++) {
        updated = updateParticlePhysics(updated, 16.67, GRAVITY);
      }

      expect(updated.life).toBe(0);
      expect(updated.life).toBeGreaterThanOrEqual(0);
    });
  });
});

// T012: Unit test for ParticleEmitter spawn logic
describe('ParticleEmitter', () => {
  let pool: ParticlePool;
  const CELL_SIZE = 30;

  beforeEach(() => {
    pool = new ParticlePool(200);
  });

  describe('createParticleEmitter', () => {
    it('should create emitter with correct properties', () => {
      const emitter = createParticleEmitter('test-1', 5, 10, '#ff0000', CELL_SIZE, pool);

      expect(emitter.id).toBe('test-1');
      expect(emitter.sourceX).toBe(5);
      expect(emitter.sourceY).toBe(10);
      expect(emitter.sourceColor).toBe('#ff0000');
      expect(emitter.active).toBe(true);
      expect(emitter.duration).toBe(1000);
    });

    it('should spawn default 12 particles', () => {
      const emitter = createParticleEmitter('test-1', 5, 10, '#ff0000', CELL_SIZE, pool);

      expect(emitter.particles.length).toBe(12);
    });

    it('should spawn custom particle count', () => {
      const emitter = createParticleEmitter('test-1', 5, 10, '#ff0000', CELL_SIZE, pool, 20);

      expect(emitter.particles.length).toBe(20);
    });

    it('should position particles at block center', () => {
      const gridX = 5;
      const gridY = 10;
      const emitter = createParticleEmitter('test-1', gridX, gridY, '#ff0000', CELL_SIZE, pool);

      const expectedCenterX = gridX * CELL_SIZE + CELL_SIZE / 2;
      const expectedCenterY = gridY * CELL_SIZE + CELL_SIZE / 2;

      for (const particle of emitter.particles) {
        expect(particle.x).toBe(expectedCenterX);
        expect(particle.y).toBe(expectedCenterY);
      }
    });

    it('should initialize all particles with full life', () => {
      const emitter = createParticleEmitter('test-1', 5, 10, '#ff0000', CELL_SIZE, pool);

      for (const particle of emitter.particles) {
        expect(particle.life).toBe(1.0);
      }
    });

    it('should inherit color from source block', () => {
      const color = '#00ff00';
      const emitter = createParticleEmitter('test-1', 5, 10, color, CELL_SIZE, pool);

      for (const particle of emitter.particles) {
        expect(particle.color).toBe(color);
      }
    });

    it('should initialize particles with random velocities', () => {
      const emitter = createParticleEmitter('test-1', 5, 10, '#ff0000', CELL_SIZE, pool);

      // Check that particles have varied velocities
      const vxValues = emitter.particles.map((p) => p.vx);
      const vyValues = emitter.particles.map((p) => p.vy);

      const uniqueVx = new Set(vxValues);
      const uniqueVy = new Set(vyValues);

      // Should have variation (not all the same)
      expect(uniqueVx.size).toBeGreaterThan(1);
      expect(uniqueVy.size).toBeGreaterThan(1);
    });

    it('should set startTime to current performance time', () => {
      const beforeTime = performance.now();
      const emitter = createParticleEmitter('test-1', 5, 10, '#ff0000', CELL_SIZE, pool);
      const afterTime = performance.now();

      expect(emitter.startTime).toBeGreaterThanOrEqual(beforeTime);
      expect(emitter.startTime).toBeLessThanOrEqual(afterTime);
    });

    it('should acquire particles from pool', () => {
      const initialAvailable = pool.getAvailableCount();
      const particleCount = 15;

      createParticleEmitter('test-1', 5, 10, '#ff0000', CELL_SIZE, pool, particleCount);

      expect(pool.getAvailableCount()).toBe(initialAvailable - particleCount);
    });

    it('should create unique emitters with different IDs', () => {
      const emitter1 = createParticleEmitter('emitter-1', 5, 10, '#ff0000', CELL_SIZE, pool);
      const emitter2 = createParticleEmitter('emitter-2', 6, 11, '#00ff00', CELL_SIZE, pool);

      expect(emitter1.id).not.toBe(emitter2.id);
      expect(emitter1.sourceX).not.toBe(emitter2.sourceX);
      expect(emitter1.sourceColor).not.toBe(emitter2.sourceColor);
    });
  });
});


