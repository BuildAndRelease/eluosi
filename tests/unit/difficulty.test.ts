/**
 * Difficulty Tests
 *
 * Tests for fall speed changes per level (1000ms→100ms).
 */

import { describe, it, expect } from 'vitest';
import { FALL_SPEEDS } from '../../src/config/constants';

describe('Difficulty', () => {
  describe('Fall speed configuration', () => {
    it('should have fall speeds for at least 10 levels', () => {
      expect(FALL_SPEEDS.length).toBeGreaterThanOrEqual(10);
    });

    it('should start at 1000ms for level 0', () => {
      expect(FALL_SPEEDS[0]).toBe(1000);
    });

    it('should decrease fall speed as level increases', () => {
      for (let i = 1; i < FALL_SPEEDS.length; i++) {
        expect(FALL_SPEEDS[i]).toBeLessThanOrEqual(FALL_SPEEDS[i - 1]!);
      }
    });

    it('should reach 100ms or less at highest level', () => {
      const maxLevel = FALL_SPEEDS.length - 1;
      expect(FALL_SPEEDS[maxLevel]).toBeLessThanOrEqual(100);
    });

    it('should have reasonable speed progression', () => {
      // Each level should not decrease by more than 200ms
      for (let i = 1; i < FALL_SPEEDS.length; i++) {
        const decrease = FALL_SPEEDS[i - 1]! - FALL_SPEEDS[i]!;
        expect(decrease).toBeLessThanOrEqual(200);
        expect(decrease).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Level-to-speed mapping', () => {
    it('should map level 0 to 1000ms', () => {
      const level = 0;
      const speed = FALL_SPEEDS[Math.min(level, FALL_SPEEDS.length - 1)]!;
      expect(speed).toBe(1000);
    });

    it('should map level 5 to 500ms or less', () => {
      const level = 5;
      const speed = FALL_SPEEDS[Math.min(level, FALL_SPEEDS.length - 1)]!;
      expect(speed).toBeLessThanOrEqual(500);
    });

    it('should map level 9+ to 100ms', () => {
      const level = 9;
      const speed = FALL_SPEEDS[Math.min(level, FALL_SPEEDS.length - 1)]!;
      expect(speed).toBe(100);
    });

    it('should handle levels beyond array length', () => {
      const level = 20;
      const speed = FALL_SPEEDS[Math.min(level, FALL_SPEEDS.length - 1)]!;
      expect(speed).toBeDefined();
      expect(speed).toBeGreaterThan(0);
    });
  });
});
