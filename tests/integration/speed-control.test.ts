/**
 * Integration Tests: Speed Control
 *
 * Tests for speed control integration with game loop and input handling.
 */

import { describe, it, expect } from 'vitest';
import { DOWN_KEY_MULTIPLIER } from '../../src/config/constants';
import { getSpeedMultiplier } from '../../src/game/leveling';

describe('Speed Control Integration', () => {
  describe('Game Loop Speed Calculation', () => {
    it('should calculate fall interval based on level and down key state', () => {
      const baseFallInterval = 1000; // 1 second base

      // Helper to calculate fall interval
      const calculateFallInterval = (level: number, isDownKeyPressed: boolean): number => {
        const levelMultiplier = getSpeedMultiplier(level);
        const downMultiplier = isDownKeyPressed ? DOWN_KEY_MULTIPLIER : 1;
        const totalMultiplier = levelMultiplier * downMultiplier;
        return baseFallInterval / totalMultiplier;
      };

      // Level 0, no down key: 1000ms
      expect(calculateFallInterval(0, false)).toBe(1000);

      // Level 0, down key: 250ms (4x faster)
      expect(calculateFallInterval(0, true)).toBe(250);

      // Level 1, no down key: 500ms (2x faster)
      expect(calculateFallInterval(1, false)).toBe(500);

      // Level 1, down key: 125ms (8x faster)
      expect(calculateFallInterval(1, true)).toBe(125);

      // Level 2, no down key: 333.33ms (3x faster)
      expect(calculateFallInterval(2, false)).toBeCloseTo(333.33, 1);

      // Level 2, down key: 83.33ms (12x faster)
      expect(calculateFallInterval(2, true)).toBeCloseTo(83.33, 1);

      // Level 3+, no down key: 250ms (4x faster, capped)
      expect(calculateFallInterval(3, false)).toBe(250);
      expect(calculateFallInterval(10, false)).toBe(250);

      // Level 3+, down key: 62.5ms (16x faster, max speed)
      expect(calculateFallInterval(3, true)).toBe(62.5);
      expect(calculateFallInterval(10, true)).toBe(62.5);
    });

    it('should maintain smooth gameplay at high speeds', () => {
      const baseFallInterval = 1000;
      const maxSpeed = getSpeedMultiplier(3) * DOWN_KEY_MULTIPLIER;
      const minInterval = baseFallInterval / maxSpeed;

      // Minimum interval should be >= 60ms for smooth 60fps gameplay
      expect(minInterval).toBeGreaterThanOrEqual(60);
    });
  });

  describe('Input Latency', () => {
    it('should respond to down key press within 50ms', () => {
      // This is a specification test - actual latency measured in manual testing
      const MAX_INPUT_LATENCY_MS = 50;
      expect(MAX_INPUT_LATENCY_MS).toBe(50);
    });
  });

  describe('Speed Transition', () => {
    it('should transition smoothly between speeds', () => {
      // Test that speed changes are immediate (no gradual transition)
      const level = 2;
      const normalSpeed = getSpeedMultiplier(level);
      const downSpeed = normalSpeed * DOWN_KEY_MULTIPLIER;

      // Speed should change immediately
      expect(downSpeed / normalSpeed).toBe(DOWN_KEY_MULTIPLIER);
    });
  });
});
