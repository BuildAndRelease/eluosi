/**
 * Unit Tests: Speed Control System
 *
 * Tests for down key speed multiplier and multiplicative speed calculation.
 */

import { describe, it, expect } from 'vitest';
import { DOWN_KEY_MULTIPLIER, SPEED_MULTIPLIERS } from '../../src/config/constants';
import { getSpeedMultiplier } from '../../src/game/leveling';

describe('Speed Control System', () => {
  describe('Down Key Multiplier', () => {
    it('should have 4x multiplier for down key', () => {
      expect(DOWN_KEY_MULTIPLIER).toBe(4);
    });

    it('should apply multiplicatively to level speed', () => {
      // Level 0: 1x base * 4x down = 4x
      const level0Speed = SPEED_MULTIPLIERS[0]! * DOWN_KEY_MULTIPLIER;
      expect(level0Speed).toBe(4);

      // Level 1: 2x base * 4x down = 8x
      const level1Speed = SPEED_MULTIPLIERS[1]! * DOWN_KEY_MULTIPLIER;
      expect(level1Speed).toBe(8);

      // Level 2: 3x base * 4x down = 12x
      const level2Speed = SPEED_MULTIPLIERS[2]! * DOWN_KEY_MULTIPLIER;
      expect(level2Speed).toBe(12);

      // Level 3+: 4x base * 4x down = 16x
      const level3Speed = SPEED_MULTIPLIERS[3]! * DOWN_KEY_MULTIPLIER;
      expect(level3Speed).toBe(16);
    });
  });

  describe('Speed Multipliers by Level', () => {
    it('should have correct speed multipliers', () => {
      expect(SPEED_MULTIPLIERS[0]).toBe(1); // Level 0: 1x
      expect(SPEED_MULTIPLIERS[1]).toBe(2); // Level 1: 2x
      expect(SPEED_MULTIPLIERS[2]).toBe(3); // Level 2: 3x
      expect(SPEED_MULTIPLIERS[3]).toBe(4); // Level 3+: 4x (capped)
    });

    it('should cap speed at 4x for level 3+', () => {
      expect(getSpeedMultiplier(3)).toBe(4);
      expect(getSpeedMultiplier(4)).toBe(4);
      expect(getSpeedMultiplier(10)).toBe(4);
    });
  });

  describe('Multiplicative Speed Calculation', () => {
    it('should calculate correct total speed at various levels', () => {
      // Helper function to calculate total speed
      const calculateTotalSpeed = (level: number, downKeyPressed: boolean): number => {
        const levelSpeed = getSpeedMultiplier(level);
        return downKeyPressed ? levelSpeed * DOWN_KEY_MULTIPLIER : levelSpeed;
      };

      // Level 0, no down key: 1x
      expect(calculateTotalSpeed(0, false)).toBe(1);
      // Level 0, down key: 4x
      expect(calculateTotalSpeed(0, true)).toBe(4);

      // Level 1, no down key: 2x
      expect(calculateTotalSpeed(1, false)).toBe(2);
      // Level 1, down key: 8x
      expect(calculateTotalSpeed(1, true)).toBe(8);

      // Level 2, no down key: 3x
      expect(calculateTotalSpeed(2, false)).toBe(3);
      // Level 2, down key: 12x
      expect(calculateTotalSpeed(2, true)).toBe(12);

      // Level 3, no down key: 4x
      expect(calculateTotalSpeed(3, false)).toBe(4);
      // Level 3, down key: 16x (max)
      expect(calculateTotalSpeed(3, true)).toBe(16);
    });

    it('should reach maximum speed of 16x at level 3+ with down key', () => {
      const maxSpeed = getSpeedMultiplier(3) * DOWN_KEY_MULTIPLIER;
      expect(maxSpeed).toBe(16);

      // Verify it stays at 16x for higher levels
      const level10Speed = getSpeedMultiplier(10) * DOWN_KEY_MULTIPLIER;
      expect(level10Speed).toBe(16);
    });
  });

  describe('Speed Reset on Key Release', () => {
    it('should return to level speed when down key is released', () => {
      // Simulate down key press and release
      const level = 2;
      const levelSpeed = getSpeedMultiplier(level);
      const downSpeed = levelSpeed * DOWN_KEY_MULTIPLIER;

      // Down key pressed: 12x
      expect(downSpeed).toBe(12);

      // Down key released: back to 3x
      expect(levelSpeed).toBe(3);
    });
  });
});
