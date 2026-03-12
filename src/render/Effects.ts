/**
 * Particle Effects System
 *
 * Manages particle explosions for row clear animations using object pooling
 * for performance. Includes ParticlePool for memory management and EffectsManager
 * for coordinating particle lifecycle.
 */

/**
 * Single particle in an explosion effect
 */
export interface Particle {
  /** Position in pixels (world coordinates) */
  x: number;
  y: number;

  /** Velocity in pixels per frame at 60fps */
  vx: number;
  vy: number;

  /** Lifecycle (0.0 = dead, 1.0 = just spawned) */
  life: number;

  /** Hex color code inherited from source block */
  color: string;

  /** Particle radius in pixels (4-8px) */
  size: number;

  /** Z-order for rendering (0-1, higher = front) */
  depth: number;
}

/**
 * Object pool for particle reuse to avoid GC pauses
 */
export class ParticlePool {
  private pool: Particle[] = [];
  private readonly poolSize: number;

  /**
   * @param poolSize Number of particles to pre-allocate (default: 200)
   */
  constructor(poolSize = 200) {
    this.poolSize = poolSize;
    this.preallocate();
  }

  /**
   * Pre-allocate particles for the pool
   */
  private preallocate(): void {
    for (let i = 0; i < this.poolSize; i++) {
      this.pool.push(this.createParticle());
    }
  }

  /**
   * Create a new particle with default values
   */
  private createParticle(): Particle {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      color: '#ffffff',
      size: 6,
      depth: 0.5,
    };
  }

  /**
   * Acquire a particle from the pool
   * @returns Particle initialized with provided values
   */
  public acquire(x: number, y: number, color: string): Particle {
    const particle = this.pool.pop() || this.createParticle();

    // Reinitialize all properties
    particle.x = x;
    particle.y = y;
    particle.vx = (Math.random() - 0.5) * 10; // -5 to 5 pixels/frame
    particle.vy = -Math.random() * 15; // -15 to 0 pixels/frame (upward)
    particle.life = 1.0;
    particle.color = color;
    particle.size = 4 + Math.random() * 4; // 4-8px
    particle.depth = Math.random(); // 0-1

    return particle;
  }

  /**
   * Release a particle back to the pool for reuse
   */
  public release(particle: Particle): void {
    if (this.pool.length < this.poolSize) {
      particle.life = 0;
      this.pool.push(particle);
    }
  }

  /**
   * Get current pool size (available particles)
   */
  public getAvailableCount(): number {
    return this.pool.length;
  }

  /**
   * Get total pool capacity
   */
  public getCapacity(): number {
    return this.poolSize;
  }
}

/**
 * Update particle physics (gravity, velocity, life decay)
 * Pure function - returns new particle, does not mutate original
 *
 * @param particle Particle to update
 * @param deltaTime Time elapsed in milliseconds
 * @param gravity Gravity constant (pixels per frame squared)
 * @returns New particle with updated physics
 */
export function updateParticlePhysics(
  particle: Particle,
  deltaTime: number,
  gravity: number
): Particle {
  const lifeDecay = deltaTime / 1000; // Decay over 1 second

  return {
    ...particle,
    x: particle.x + particle.vx,
    y: particle.y + particle.vy,
    vx: particle.vx,
    vy: particle.vy + gravity,
    life: Math.max(0, particle.life - lifeDecay),
  };
}

/**
 * Particle emitter for a single explosion event
 */
export interface ParticleEmitter {
  /** Unique identifier */
  id: string;

  /** Source block position (grid coordinates) */
  sourceX: number;
  sourceY: number;

  /** Source block color */
  sourceColor: string;

  /** Particles in this emitter */
  particles: Particle[];

  /** Lifecycle timestamps */
  startTime: number;
  duration: number;

  /** Is emitter still active? */
  active: boolean;
}

/**
 * Create a particle emitter for a single block explosion
 *
 * @param id Unique emitter ID
 * @param gridX Grid X coordinate
 * @param gridY Grid Y coordinate
 * @param color Block color
 * @param cellSize Cell size in pixels
 * @param pool Particle pool for acquiring particles
 * @param particleCount Number of particles to spawn (default: 12)
 * @returns New ParticleEmitter
 */
export function createParticleEmitter(
  id: string,
  gridX: number,
  gridY: number,
  color: string,
  cellSize: number,
  pool: ParticlePool,
  particleCount = 12
): ParticleEmitter {
  const particles: Particle[] = [];

  // Calculate center of block in pixel coordinates
  const centerX = gridX * cellSize + cellSize / 2;
  const centerY = gridY * cellSize + cellSize / 2;

  // Spawn particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(pool.acquire(centerX, centerY, color));
  }

  return {
    id,
    sourceX: gridX,
    sourceY: gridY,
    sourceColor: color,
    particles,
    startTime: performance.now(),
    duration: 1000, // 1 second
    active: true,
  };
}

/**
 * Effects Manager
 * Coordinates all particle emitters and handles rendering
 */
export class EffectsManager {
  private pool: ParticlePool;
  private emitters = new Map<string, ParticleEmitter>();
  private cellSize: number;
  private ctx: CanvasRenderingContext2D;
  private readonly GRAVITY = 0.3;

  constructor(ctx: CanvasRenderingContext2D, cellSize: number, poolSize = 200) {
    this.ctx = ctx;
    this.cellSize = cellSize;
    this.pool = new ParticlePool(poolSize);
  }

  /**
   * Create particle explosion for a single row clear
   * @param rowIndex Row index to explode
   * @param rowColors Array of colors for each block in the row
   */
  public createRowClearExplosion(rowIndex: number, rowColors: (string | null)[]): void {
    for (let x = 0; x < rowColors.length; x++) {
      const color = rowColors[x];
      if (color) {
        const emitter = createParticleEmitter(
          `row-${rowIndex}-block-${x}-${Date.now()}`,
          x,
          rowIndex,
          color,
          this.cellSize,
          this.pool
        );
        this.emitters.set(emitter.id, emitter);
      }
    }
  }

  /**
   * Create particle explosions for multiple rows
   * @param rowIndices Array of row indices to explode
   * @param gridColors 2D array of grid colors
   */
  public createMultiRowExplosion(rowIndices: number[], gridColors: (string | null)[][]): void {
    for (const rowIndex of rowIndices) {
      const rowColors = gridColors[rowIndex];
      if (rowColors) {
        this.createRowClearExplosion(rowIndex, rowColors);
      }
    }
  }

  /**
   * Update all active particle emitters
   * @param currentTime Current timestamp from performance.now()
   */
  public update(currentTime: number): void {
    const deadEmitters: string[] = [];

    for (const [id, emitter] of this.emitters) {
      if (!emitter.active) {
        continue;
      }

      // Update all particles in this emitter
      const updatedParticles: Particle[] = [];
      for (const particle of emitter.particles) {
        const updated = updateParticlePhysics(particle, 16.67, this.GRAVITY);

        if (updated.life > 0) {
          updatedParticles.push(updated);
        } else {
          // Return dead particle to pool
          this.pool.release(updated);
        }
      }

      emitter.particles = updatedParticles;

      // Check if emitter should be deactivated
      const elapsed = currentTime - emitter.startTime;
      if (elapsed >= emitter.duration || emitter.particles.length === 0) {
        emitter.active = false;
        deadEmitters.push(id);
      }
    }

    // Remove dead emitters
    for (const id of deadEmitters) {
      this.emitters.delete(id);
    }
  }

  /**
   * Render all active particles with fade-out effect
   */
  public render(): void {
    for (const emitter of this.emitters.values()) {
      if (!emitter.active) {
        continue;
      }

      for (const particle of emitter.particles) {
        this.renderParticle(particle);
      }
    }
  }

  /**
   * Render a single particle with fade-out based on life
   */
  private renderParticle(particle: Particle): void {
    const alpha = particle.life; // 1.0 = fully visible, 0.0 = invisible

    this.ctx.save();
    this.ctx.globalAlpha = alpha;

    // Draw particle as a circle
    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  /**
   * Stop a specific emitter by ID
   */
  public stopEmitter(id: string): void {
    const emitter = this.emitters.get(id);
    if (emitter) {
      // Return all particles to pool
      for (const particle of emitter.particles) {
        this.pool.release(particle);
      }
      emitter.particles = [];
      emitter.active = false;
      this.emitters.delete(id);
    }
  }

  /**
   * Stop all active emitters (for game over)
   */
  public stopAll(): void {
    for (const emitter of this.emitters.values()) {
      // Return all particles to pool
      for (const particle of emitter.particles) {
        this.pool.release(particle);
      }
      emitter.particles = [];
      emitter.active = false;
    }
    this.emitters.clear();
  }

  /**
   * Get count of active emitters
   */
  public getActiveEmitterCount(): number {
    return this.emitters.size;
  }

  /**
   * Get total count of active particles across all emitters
   */
  public getActiveParticleCount(): number {
    let count = 0;
    for (const emitter of this.emitters.values()) {
      count += emitter.particles.length;
    }
    return count;
  }

  /**
   * Check if any animations are active
   */
  public hasActiveAnimations(): boolean {
    return this.emitters.size > 0;
  }
}

