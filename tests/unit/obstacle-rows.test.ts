/**
 * Unit Tests: Obstacle Rows
 *
 * Tests for obstacle row generation and insertion.
 */

import { describe, it, expect } from 'vitest';
import {
  generateObstacleRow,
  insertObstacleRow,
  validateObstacleRow,
  getRandomGapPosition,
} from '../../src/game/obstacle-rows';

describe('Obstacle Rows', () => {
  describe('generateObstacleRow', () => {
    it('should generate row with correct width', () => {
      const row = generateObstacleRow(10);
      expect(row).toHaveLength(10);
    });

    it('should have exactly one gap (null)', () => {
      const row = generateObstacleRow(10);
      const gapCount = row.filter((cell) => cell === null).length;
      expect(gapCount).toBe(1);
    });

    it('should have random colors from palette', () => {
      const row = generateObstacleRow(10);
      const nonNullCells = row.filter((cell) => cell !== null);

      // All non-null cells should be hex colors
      nonNullCells.forEach((cell) => {
        expect(cell).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    it('should have gap at random position', () => {
      const positions = new Set<number>();

      // Generate 50 rows and collect gap positions
      for (let i = 0; i < 50; i++) {
        const row = generateObstacleRow(10);
        const gapIndex = row.findIndex((cell) => cell === null);
        positions.add(gapIndex);
      }

      // Should have multiple different positions (randomness)
      expect(positions.size).toBeGreaterThan(3);
    });

    it('should throw error for invalid grid width', () => {
      expect(() => generateObstacleRow(0)).toThrow();
      expect(() => generateObstacleRow(1)).toThrow();
      expect(() => generateObstacleRow(-1)).toThrow();
    });
  });

  describe('insertObstacleRow', () => {
    it('should insert row at bottom of grid', () => {
      const grid = [
        [null, null, null], // Top row must be empty
        [null, null, null],
        ['#FF0000', null, null],
      ];
      const obstacleRow = ['#00FF00', null, '#0000FF'];

      const result = insertObstacleRow(grid, obstacleRow);

      // Last row should be the obstacle row
      expect(result[result.length - 1]).toEqual(obstacleRow);
    });

    it('should shift existing rows up', () => {
      const grid = [
        [null, null, null], // Top row must be empty
        ['#FF0000', null, null],
        ['#00FF00', null, null],
      ];
      const obstacleRow = ['#0000FF', null, '#FFFF00'];

      const result = insertObstacleRow(grid, obstacleRow);

      // Top row should remain empty
      expect(result[0]).toEqual([null, null, null]);
      // Second row should be the original second row
      expect(result[1]).toEqual(['#FF0000', null, null]);
      // Bottom row should be obstacle row (original bottom row removed)
      expect(result[result.length - 1]).toEqual(obstacleRow);
    });

    it('should throw error if top row has blocks (game over)', () => {
      const grid = [
        ['#FF0000', '#00FF00', '#0000FF'], // Top row full
        [null, null, null],
        [null, null, null],
      ];
      const obstacleRow = ['#FFFF00', null, '#FF00FF'];

      expect(() => insertObstacleRow(grid, obstacleRow)).toThrow('game over');
    });

    it('should throw error if obstacle row width does not match grid', () => {
      const grid = [
        [null, null, null],
        [null, null, null],
      ];
      const obstacleRow = ['#FF0000', null]; // Width 2, grid width 3

      expect(() => insertObstacleRow(grid, obstacleRow)).toThrow('does not match grid width');
    });
  });

  describe('validateObstacleRow', () => {
    it('should return true for valid obstacle row', () => {
      const row = ['#FF0000', null, '#00FF00', '#0000FF'];
      expect(validateObstacleRow(row)).toBe(true);
    });

    it('should return false for row with no gaps', () => {
      const row = ['#FF0000', '#00FF00', '#0000FF'];
      expect(validateObstacleRow(row)).toBe(false);
    });

    it('should return false for row with multiple gaps', () => {
      const row = ['#FF0000', null, null, '#0000FF'];
      expect(validateObstacleRow(row)).toBe(false);
    });
  });

  describe('getRandomGapPosition', () => {
    it('should return position within grid width', () => {
      for (let i = 0; i < 100; i++) {
        const position = getRandomGapPosition(10);
        expect(position).toBeGreaterThanOrEqual(0);
        expect(position).toBeLessThan(10);
      }
    });

    it('should have uniform distribution', () => {
      const counts = new Array(10).fill(0);

      // Generate 1000 positions
      for (let i = 0; i < 1000; i++) {
        const position = getRandomGapPosition(10);
        counts[position]++;
      }

      // Each position should appear roughly 100 times (±50)
      counts.forEach((count) => {
        expect(count).toBeGreaterThan(50);
        expect(count).toBeLessThan(150);
      });
    });
  });
});
