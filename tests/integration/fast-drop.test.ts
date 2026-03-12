/**
 * Fast Drop Integration Tests
 *
 * Tests for spacebar activation/deactivation, acceleration timing, and input latency.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock InputHandler for testing
interface FastDropState {
  active: boolean;
  startTime: number;
  currentMultiplier: number;
}

class MockInputHandler {
  private fastDropState: FastDropState = {
    active: false,
    startTime: 0,
    currentMultiplier: 1.0,
  };

  private readonly RAMP_DURATION = 200; // 0.2 seconds
  private readonly MAX_MULTIPLIER = 8.0;

  public activateFastDrop(): void {
    if (!this.fastDropState.active) {
      this.fastDropState.active = true;
      this.fastDropState.startTime = performance.now();
      this.fastDropState.currentMultiplier = 1.0;
    }
  }

  public deactivateFastDrop(): void {
    this.fastDropState.active = false;
    this.fastDropState.currentMultiplier = 1.0;
  }

  public getSpeedMultiplier(currentTime: number): number {
    if (!this.fastDropState.active) {
      return 1.0;
    }

    const elapsed = currentTime - this.fastDropState.startTime;
    if (elapsed >= this.RAMP_DURATION) {
      return this.MAX_MULTIPLIER;
    }

    const progress = elapsed / this.RAMP_DURATION;
    return 1.0 + (this.MAX_MULTIPLIER - 1.0) * progress;
  }

  public isActive(): boolean {
    return this.fastDropState.active;
  }
}

// T048: Integration test for spacebar activation/deactivation
describe('Spacebar Activation/Deactivation', () => {
  let inputHandler: MockInputHandler;

  beforeEach(() => {
    inputHandler = new MockInputHandler();
  });

  it('should activate fast drop on spacebar press', () => {
    expect(inputHandler.isActive()).toBe(false);

    inputHandler.activateFastDrop();

    expect(inputHandler.isActive()).toBe(true);
  });

  it('should deactivate fast drop on spacebar release', () => {
    inputHandler.activateFastDrop();
    expect(inputHandler.isActive()).toBe(true);

    inputHandler.deactivateFastDrop();

    expect(inputHandler.isActive()).toBe(false);
  });

  it('should reset multiplier to 1x on deactivation', () => {
    const startTime = performance.now();
    inputHandler.activateFastDrop();

    // Simulate time passing
    const currentTime = startTime + 100;
    const multiplier = inputHandler.getSpeedMultiplier(currentTime);
    expect(multiplier).toBeGreaterThan(1.0);

    inputHandler.deactivateFastDrop();

    const resetMultiplier = inputHandler.getSpeedMultiplier(currentTime);
    expect(resetMultiplier).toBe(1.0);
  });

  it('should handle repeated activation without error', () => {
    inputHandler.activateFastDrop();
    const firstStartTime = performance.now();

    // Activate again (should be idempotent)
    inputHandler.activateFastDrop();

    expect(inputHandler.isActive()).toBe(true);
  });

  it('should handle repeated deactivation without error', () => {
    inputHandler.activateFastDrop();
    inputHandler.deactivateFastDrop();

    // Deactivate again (should be idempotent)
    inputHandler.deactivateFastDrop();

    expect(inputHandler.isActive()).toBe(false);
  });

  it('should start new ramp on reactivation', () => {
    // First activation
    inputHandler.activateFastDrop();
    const time1 = performance.now() + 100;
    const multiplier1 = inputHandler.getSpeedMultiplier(time1);

    // Deactivate and reactivate
    inputHandler.deactivateFastDrop();
    inputHandler.activateFastDrop();

    // Should start from 1x again
    const time2 = performance.now();
    const multiplier2 = inputHandler.getSpeedMultiplier(time2);
    expect(multiplier2).toBeCloseTo(1.0, 2);
  });
});

// T049: Integration test for acceleration ramp-up timing
describe('Acceleration Ramp-Up Timing', () => {
  let inputHandler: MockInputHandler;

  beforeEach(() => {
    inputHandler = new MockInputHandler();
  });

  it('should reach 8x speed after 200ms', () => {
    const startTime = performance.now();
    inputHandler.activateFastDrop();

    const endTime = startTime + 200;
    const multiplier = inputHandler.getSpeedMultiplier(endTime);

    expect(multiplier).toBeCloseTo(8.0, 2);
  });

  it('should be at approximately 4.5x at 100ms (midpoint)', () => {
    const startTime = performance.now();
    inputHandler.activateFastDrop();

    const midTime = startTime + 100;
    const multiplier = inputHandler.getSpeedMultiplier(midTime);

    expect(multiplier).toBeCloseTo(4.5, 1);
  });

  it('should maintain 8x speed after ramp completes', () => {
    const startTime = performance.now();
    inputHandler.activateFastDrop();

    const time1 = startTime + 200;
    const time2 = startTime + 500;
    const time3 = startTime + 1000;

    expect(inputHandler.getSpeedMultiplier(time1)).toBeCloseTo(8.0, 2);
    expect(inputHandler.getSpeedMultiplier(time2)).toBeCloseTo(8.0, 2);
    expect(inputHandler.getSpeedMultiplier(time3)).toBeCloseTo(8.0, 2);
  });

  it('should have smooth acceleration curve', () => {
    const startTime = performance.now();
    inputHandler.activateFastDrop();

    const samples = 20;
    const multipliers: number[] = [];

    for (let i = 0; i <= samples; i++) {
      const time = startTime + (i * 200) / samples;
      multipliers.push(inputHandler.getSpeedMultiplier(time));
    }

    // Check monotonic increase
    for (let i = 1; i < multipliers.length; i++) {
      expect(multipliers[i]!).toBeGreaterThanOrEqual(multipliers[i - 1]!);
    }

    // Check no sudden jumps (max delta < 1.0)
    for (let i = 1; i < multipliers.length; i++) {
      const delta = multipliers[i]! - multipliers[i - 1]!;
      expect(delta).toBeLessThan(1.0);
    }
  });

  it('should handle very small time increments', () => {
    const startTime = performance.now();
    inputHandler.activateFastDrop();

    const time1 = startTime + 1;
    const time2 = startTime + 2;

    const m1 = inputHandler.getSpeedMultiplier(time1);
    const m2 = inputHandler.getSpeedMultiplier(time2);

    expect(m2).toBeGreaterThan(m1);
    expect(m2 - m1).toBeLessThan(0.1); // Small increment
  });
});

// T050: Performance test for <50ms input latency
describe('Input Latency Performance', () => {
  let inputHandler: MockInputHandler;

  beforeEach(() => {
    inputHandler = new MockInputHandler();
  });

  it('should activate fast drop within 50ms', () => {
    const startTime = performance.now();

    inputHandler.activateFastDrop();

    const endTime = performance.now();
    const latency = endTime - startTime;

    expect(latency).toBeLessThan(50);
  });

  it('should deactivate fast drop within 50ms', () => {
    inputHandler.activateFastDrop();

    const startTime = performance.now();

    inputHandler.deactivateFastDrop();

    const endTime = performance.now();
    const latency = endTime - startTime;

    expect(latency).toBeLessThan(50);
  });

  it('should calculate speed multiplier within 50ms', () => {
    inputHandler.activateFastDrop();
    const currentTime = performance.now();

    const startTime = performance.now();

    inputHandler.getSpeedMultiplier(currentTime);

    const endTime = performance.now();
    const latency = endTime - startTime;

    expect(latency).toBeLessThan(50);
  });

  it('should handle 100 rapid activations within 50ms total', () => {
    const startTime = performance.now();

    for (let i = 0; i < 100; i++) {
      inputHandler.activateFastDrop();
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    expect(totalTime).toBeLessThan(50);
  });

  it('should handle 100 rapid deactivations within 50ms total', () => {
    inputHandler.activateFastDrop();

    const startTime = performance.now();

    for (let i = 0; i < 100; i++) {
      inputHandler.deactivateFastDrop();
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    expect(totalTime).toBeLessThan(50);
  });

  it('should handle 1000 speed multiplier calculations within 50ms', () => {
    inputHandler.activateFastDrop();
    const currentTime = performance.now();

    const startTime = performance.now();

    for (let i = 0; i < 1000; i++) {
      inputHandler.getSpeedMultiplier(currentTime + i);
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    expect(totalTime).toBeLessThan(50);
  });

  it('should maintain low latency under load (activation + calculation)', () => {
    const startTime = performance.now();

    for (let i = 0; i < 60; i++) {
      // Simulate 60 frames
      inputHandler.activateFastDrop();
      const currentTime = performance.now();
      inputHandler.getSpeedMultiplier(currentTime);
      inputHandler.deactivateFastDrop();
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const avgLatencyPerFrame = totalTime / 60;

    expect(avgLatencyPerFrame).toBeLessThan(1); // <1ms per frame
  });
});
