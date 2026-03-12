/**
 * Fast Drop Manager
 *
 * Manages fast drop acceleration with linear ramp-up from 1x to 8x over 0.2 seconds.
 * Provides speed multiplier calculation for game loop integration.
 */

export interface FastDropState {
  /** Is fast drop currently active? */
  active: boolean;

  /** Timestamp when fast drop was activated (performance.now()) */
  startTime: number;

  /** Current speed multiplier (1.0 to 8.0) */
  currentMultiplier: number;
}

export class FastDropManager {
  private state: FastDropState = {
    active: false,
    startTime: 0,
    currentMultiplier: 1.0,
  };

  private readonly RAMP_DURATION = 200; // 0.2 seconds in milliseconds
  private readonly MAX_MULTIPLIER = 8.0;

  /**
   * Activate fast drop acceleration
   * Starts the linear ramp-up from 1x to 8x
   */
  public activate(): void {
    if (!this.state.active) {
      this.state = {
        active: true,
        startTime: performance.now(),
        currentMultiplier: 1.0,
      };
    }
  }

  /**
   * Deactivate fast drop acceleration
   * Resets multiplier to 1x
   */
  public deactivate(): void {
    this.state = {
      active: false,
      startTime: 0,
      currentMultiplier: 1.0,
    };
  }

  /**
   * Get current speed multiplier based on elapsed time
   * Linear interpolation: 1x → 8x over RAMP_DURATION
   *
   * @param currentTime Current timestamp from performance.now()
   * @returns Speed multiplier (1.0 to 8.0)
   */
  public getSpeedMultiplier(currentTime: number): number {
    if (!this.state.active) {
      return 1.0;
    }

    const elapsed = currentTime - this.state.startTime;

    // Cap at max multiplier after ramp completes
    if (elapsed >= this.RAMP_DURATION) {
      this.state.currentMultiplier = this.MAX_MULTIPLIER;
      return this.MAX_MULTIPLIER;
    }

    // Linear interpolation
    const progress = elapsed / this.RAMP_DURATION;
    this.state.currentMultiplier = 1.0 + (this.MAX_MULTIPLIER - 1.0) * progress;

    return this.state.currentMultiplier;
  }

  /**
   * Check if fast drop is currently active
   */
  public isActive(): boolean {
    return this.state.active;
  }

  /**
   * Get current fast drop state (for debugging/monitoring)
   */
  public getState(): Readonly<FastDropState> {
    return { ...this.state };
  }
}
