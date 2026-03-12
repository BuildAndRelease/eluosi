/**
 * Fast Drop Unit Tests
 *
 * Tests for fast drop speed multiplier calculation and linear acceleration curve.
 */

import { describe, it, expect } from 'vitest';

// T046: Unit test for fast drop speed multiplier calculation
describe('Fast Drop Speed Multiplier', () => {
  describe('calculateSpeedMultiplier', () => {
    // Placeholder for function to be implemented
    const calculateSpeedMultiplier = (elapsedTime: number, rampDuration: number, maxMultiplier: number): number => {
      // Linear interpolation: 1x → maxMultiplier over rampDuration
      if (elapsedTime <= 0) return 1.0;
      if (elapsedTime >= rampDuration) return maxMultiplier;

      const progress = elapsedTime / rampDuration;
      return 1.0 + (maxMultiplier - 1.0) * progress;
    };

    it('should return 1x at time 0', () => {
      const multiplier = calculateSpeedMultiplier(0, 200, 8);
      expect(multiplier).toBe(1.0);
    });

    it('should return 8x at time 200ms', () => {
      const multiplier = calculateSpeedMultiplier(200, 200, 8);
      expect(multiplier).toBe(8.0);
    });

    it('should return 4.5x at time 100ms (midpoint)', () => {
      const multiplier = calculateSpeedMultiplier(100, 200, 8);
      expect(multiplier).toBeCloseTo(4.5, 1);
    });

    it('should handle negative time (return 1x)', () => {
      const multiplier = calculateSpeedMultiplier(-10, 200, 8);
      expect(multiplier).toBe(1.0);
    });

    it('should cap at max multiplier for time > rampDuration', () => {
      const multiplier = calculateSpeedMultiplier(300, 200, 8);
      expect(multiplier).toBe(8.0);
    });

    it('should work with different max multipliers', () => {
      const multiplier = calculateSpeedMultiplier(100, 200, 10);
      expect(multiplier).toBeCloseTo(5.5, 1);
    });

    it('should work with different ramp durations', () => {
      const multiplier = calculateSpeedMultiplier(150, 300, 8);
      expect(multiplier).toBeCloseTo(4.5, 1);
    });
  });
});

// T047: Unit test for linear acceleration curve
describe('Linear Acceleration Curve', () => {
  describe('acceleration curve properties', () => {
    const calculateSpeedMultiplier = (elapsedTime: number, rampDuration: number, maxMultiplier: number): number => {
      if (elapsedTime <= 0) return 1.0;
      if (elapsedTime >= rampDuration) return maxMultiplier;

      const progress = elapsedTime / rampDuration;
      return 1.0 + (maxMultiplier - 1.0) * progress;
    };

    it('should be strictly increasing', () => {
      const times = [0, 50, 100, 150, 200];
      const multipliers = times.map(t => calculateSpeedMultiplier(t, 200, 8));

      for (let i = 1; i < multipliers.length; i++) {
        expect(multipliers[i]!).toBeGreaterThan(multipliers[i - 1]!);
      }
    });

    it('should be linear (constant rate of change)', () => {
      const t1 = 50;
      const t2 = 100;
      const t3 = 150;

      const m1 = calculateSpeedMultiplier(t1, 200, 8);
      const m2 = calculateSpeedMultiplier(t2, 200, 8);
      const m3 = calculateSpeedMultiplier(t3, 200, 8);

      const delta1 = m2 - m1;
      const delta2 = m3 - m2;

      expect(delta1).toBeCloseTo(delta2, 5);
    });

    it('should reach exactly 8x at 200ms', () => {
      const multiplier = calculateSpeedMultiplier(200, 200, 8);
      expect(multiplier).toBe(8.0);
    });

    it('should start at exactly 1x at 0ms', () => {
      const multiplier = calculateSpeedMultiplier(0, 200, 8);
      expect(multiplier).toBe(1.0);
    });

    it('should have smooth progression (no jumps)', () => {
      const times = Array.from({ length: 21 }, (_, i) => i * 10); // 0, 10, 20, ..., 200
      const multipliers = times.map(t => calculateSpeedMultiplier(t, 200, 8));

      for (let i = 1; i < multipliers.length; i++) {
        const delta = multipliers[i]! - multipliers[i - 1]!;
        expect(delta).toBeGreaterThan(0);
        expect(delta).toBeLessThan(1); // No sudden jumps
      }
    });

    it('should maintain linearity across full range', () => {
      const samples = 10;
      const deltas: number[] = [];

      for (let i = 0; i < samples; i++) {
        const t1 = (i * 200) / samples;
        const t2 = ((i + 1) * 200) / samples;

        const m1 = calculateSpeedMultiplier(t1, 200, 8);
        const m2 = calculateSpeedMultiplier(t2, 200, 8);

        deltas.push(m2 - m1);
      }

      // All deltas should be approximately equal (linear)
      const avgDelta = deltas.reduce((sum, d) => sum + d, 0) / deltas.length;
      for (const delta of deltas) {
        expect(delta).toBeCloseTo(avgDelta, 5);
      }
    });
  });
});
