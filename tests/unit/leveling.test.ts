/**
 * Unit Tests: Leveling System
 *
 * Tests for level progression, thresholds, and speed multipliers.
 */

import { describe, it, expect } from 'vitest';
import {
  getLevelThreshold,
  calculateLevel,
  getSpeedMultiplier,
  shouldAddObstacleRow,
  getObstacleRowCount,
  LEVEL_CONFIG,
} from '../../src/game/leveling';

describe('Leveling System', () => {
  describe('Level Thresholds', () => {
    it('should calculate correct thresholds: (level * 100 * 2)', () => {
      expect(getLevelThreshold(1)).toBe(200);
      expect(getLevelThreshold(2)).toBe(400);
      expect(getLevelThreshold(3)).toBe(600);
      expect(getLevelThreshold(4)).toBe(800);
      expect(getLevelThreshold(5)).toBe(1000);
    });

    it('should have exponential progression', () => {
      const threshold1 = getLevelThreshold(1);
      const threshold2 = getLevelThreshold(2);
      const threshold3 = getLevelThreshold(3);

      // Each level requires 200 more points
      expect(threshold2 - threshold1).toBe(200);
      expect(threshold3 - threshold2).toBe(200);
    });

    it('should throw error for invalid level', () => {
      expect(() => getLevelThreshold(0)).toThrow();
      expect(() => getLevelThreshold(-1)).toThrow();
    });
  });

  describe('Level Calculation', () => {
    it('should calculate level from score', () => {
      expect(calculateLevel(0)).toBe(0);
      expect(calculateLevel(100)).toBe(0);
      expect(calculateLevel(200)).toBe(1);
      expect(calculateLevel(400)).toBe(2);
      expect(calculateLevel(600)).toBe(3);
      expect(calculateLevel(800)).toBe(4);
    });

    it('should handle scores between thresholds', () => {
      expect(calculateLevel(250)).toBe(1);
      expect(calculateLevel(550)).toBe(2);
      expect(calculateLevel(750)).toBe(3);
    });

    it('should handle high scores', () => {
      expect(calculateLevel(2000)).toBe(10);
      expect(calculateLevel(5000)).toBe(25);
    });
  });

  describe('Speed Multipliers', () => {
    it('should have correct speed multipliers by level', () => {
      expect(getSpeedMultiplier(0)).toBe(1); // 1x
      expect(getSpeedMultiplier(1)).toBe(2); // 2x
      expect(getSpeedMultiplier(2)).toBe(3); // 3x
      expect(getSpeedMultiplier(3)).toBe(4); // 4x (max)
    });

    it('should cap at 4x for level 3+', () => {
      expect(getSpeedMultiplier(4)).toBe(4);
      expect(getSpeedMultiplier(10)).toBe(4);
      expect(getSpeedMultiplier(100)).toBe(4);
    });

    it('should match LEVEL_CONFIG.MAX_SPEED_MULTIPLIER', () => {
      const maxSpeed = getSpeedMultiplier(3);
      expect(maxSpeed).toBe(LEVEL_CONFIG.MAX_SPEED_MULTIPLIER);
    });
  });

  describe('Obstacle Rows', () => {
    it('should not add obstacle rows before level 4', () => {
      expect(shouldAddObstacleRow(0)).toBe(false);
      expect(shouldAddObstacleRow(1)).toBe(false);
      expect(shouldAddObstacleRow(2)).toBe(false);
      expect(shouldAddObstacleRow(3)).toBe(false);
    });

    it('should add obstacle rows at level 4+', () => {
      expect(shouldAddObstacleRow(4)).toBe(true);
      expect(shouldAddObstacleRow(5)).toBe(true);
      expect(shouldAddObstacleRow(10)).toBe(true);
    });

    it('should match LEVEL_CONFIG.OBSTACLE_ROW_START_LEVEL', () => {
      expect(shouldAddObstacleRow(LEVEL_CONFIG.OBSTACLE_ROW_START_LEVEL)).toBe(true);
      expect(shouldAddObstacleRow(LEVEL_CONFIG.OBSTACLE_ROW_START_LEVEL - 1)).toBe(false);
    });

    it('should calculate correct obstacle row count', () => {
      expect(getObstacleRowCount(0)).toBe(0);
      expect(getObstacleRowCount(3)).toBe(0);
      expect(getObstacleRowCount(4)).toBe(1);
      expect(getObstacleRowCount(5)).toBe(2);
      expect(getObstacleRowCount(10)).toBe(7);
    });
  });

  describe('Level Progression Integration', () => {
    it('should progress through levels correctly', () => {
      let score = 0;
      let level = calculateLevel(score);
      expect(level).toBe(0);

      // Clear 20 single lines (10 points each) = 200 points
      score += 200;
      level = calculateLevel(score);
      expect(level).toBe(1);
      expect(getSpeedMultiplier(level)).toBe(2);

      // Clear 20 more single lines = 400 points total
      score += 200;
      level = calculateLevel(score);
      expect(level).toBe(2);
      expect(getSpeedMultiplier(level)).toBe(3);

      // Clear 20 more single lines = 600 points total
      score += 200;
      level = calculateLevel(score);
      expect(level).toBe(3);
      expect(getSpeedMultiplier(level)).toBe(4);
      expect(shouldAddObstacleRow(level)).toBe(false);

      // Clear 20 more single lines = 800 points total
      score += 200;
      level = calculateLevel(score);
      expect(level).toBe(4);
      expect(getSpeedMultiplier(level)).toBe(4); // Still 4x (capped)
      expect(shouldAddObstacleRow(level)).toBe(true); // Now adds obstacles
    });
  });
});
