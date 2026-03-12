/**
 * Animation Manager
 *
 * Centralized lifecycle management for all animations in the game.
 * Provides start, stop, pause, and update functionality with interruption support.
 */

export interface Animation {
  /** Unique identifier for this animation */
  id: string;

  /** Timestamp when animation started (performance.now()) */
  startTime: number;

  /** Total duration in milliseconds */
  duration: number;

  /** Called each frame with progress (0-1) */
  onUpdate: (progress: number) => void;

  /** Called when animation completes naturally */
  onComplete: () => void;

  /** Can this animation be interrupted by game over? */
  interruptible: boolean;

  /** Is this animation currently paused? */
  paused: boolean;
}

export class AnimationManager {
  private animations = new Map<string, Animation>();

  /**
   * Register and start a new animation
   */
  public start(animation: Animation): void {
    this.animations.set(animation.id, animation);
  }

  /**
   * Stop a specific animation by ID
   */
  public stop(id: string): void {
    const anim = this.animations.get(id);
    if (anim) {
      anim.onComplete();
      this.animations.delete(id);
    }
  }

  /**
   * Stop all animations (optionally only interruptible ones)
   */
  public stopAll(interruptibleOnly = false): void {
    for (const [id, anim] of this.animations) {
      if (!interruptibleOnly || anim.interruptible) {
        this.stop(id);
      }
    }
  }

  /**
   * Pause a specific animation
   */
  public pause(id: string): void {
    const anim = this.animations.get(id);
    if (anim) {
      anim.paused = true;
    }
  }

  /**
   * Resume a paused animation
   */
  public resume(id: string): void {
    const anim = this.animations.get(id);
    if (anim) {
      anim.paused = false;
    }
  }

  /**
   * Update all active animations
   * Call this every frame from the game loop
   */
  public update(currentTime: number): void {
    for (const [id, anim] of this.animations) {
      if (anim.paused) {
        continue;
      }

      const elapsed = currentTime - anim.startTime;
      const progress = Math.min(1.0, elapsed / anim.duration);

      anim.onUpdate(progress);

      if (progress >= 1.0) {
        anim.onComplete();
        this.animations.delete(id);
      }
    }
  }

  /**
   * Get count of active animations
   */
  public getActiveCount(): number {
    return this.animations.size;
  }

  /**
   * Check if a specific animation is active
   */
  public isActive(id: string): boolean {
    return this.animations.has(id);
  }
}
