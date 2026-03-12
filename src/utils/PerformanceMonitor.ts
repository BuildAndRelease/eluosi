/**
 * Performance Monitor
 *
 * Tracks and reports performance metrics for CSS effects and rendering.
 * Monitors FPS, frame time, memory usage, and CSS effect performance.
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  cssEffectsActive: boolean;
  renderTime: number;
}

export class PerformanceMonitor {
  private frameCount: number = 0;
  private lastFpsUpdate: number = performance.now();
  private currentFps: number = 60;
  private frameTimes: number[] = [];
  private lastFrameTime: number = performance.now();
  private renderStartTime: number = 0;
  private lastRenderTime: number = 0;

  /**
   * Start measuring render time
   */
  public startRenderMeasure(): void {
    this.renderStartTime = performance.now();
  }

  /**
   * End measuring render time
   */
  public endRenderMeasure(): void {
    if (this.renderStartTime > 0) {
      this.lastRenderTime = performance.now() - this.renderStartTime;
      this.renderStartTime = 0;
    }
  }

  /**
   * Update performance metrics (call once per frame)
   */
  public update(): void {
    const currentTime = performance.now();

    // Update FPS counter
    this.frameCount++;
    if (currentTime - this.lastFpsUpdate >= 1000) {
      this.currentFps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
    }

    // Track frame time
    const frameTime = currentTime - this.lastFrameTime;
    this.frameTimes.push(frameTime);
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
    }
    this.lastFrameTime = currentTime;
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    const avgFrameTime =
      this.frameTimes.length > 0 ? this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length : 16.67;

    // Get memory usage if available
    const memory = (performance as any).memory;
    const memoryUsage = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0;

    // Check if CSS effects are active (backdrop-filter support)
    const cssEffectsActive = CSS.supports('backdrop-filter', 'blur(10px)');

    return {
      fps: this.currentFps,
      frameTime: avgFrameTime,
      memoryUsage: memoryUsage,
      cssEffectsActive: cssEffectsActive,
      renderTime: this.lastRenderTime,
    };
  }

  /**
   * Check if performance meets target (60 FPS)
   */
  public meetsPerformanceTarget(): boolean {
    return this.currentFps >= 58; // Allow 2 FPS tolerance
  }

  /**
   * Get performance report as string
   */
  public getReport(): string {
    const metrics = this.getMetrics();
    return `FPS: ${metrics.fps} | Frame Time: ${metrics.frameTime.toFixed(2)}ms | Memory: ${metrics.memoryUsage.toFixed(2)}MB | CSS Effects: ${metrics.cssEffectsActive ? 'Active' : 'Inactive'} | Render Time: ${metrics.renderTime.toFixed(2)}ms`;
  }

  /**
   * Log performance warning if below target
   */
  public checkPerformance(): void {
    if (!this.meetsPerformanceTarget()) {
      console.warn(`Performance warning: FPS dropped to ${this.currentFps}`);
    }
  }
}
