/**
 * Collision Detection Tests
 *
 * Tests for boundary collision detection (left, right, bottom, top)
 * and collision with locked blocks in the grid.
 */

import { describe, it, expect } from 'vitest';
import { isValidPosition } from '../../src/game/collision';
import type { Piece, Grid } from '../../src/game/types';

describe('Collision Detection', () => {
  // Helper to create empty grid
  const createEmptyGrid = (): Grid => ({
    cells: Array(20)
      .fill(null)
      .map(() => Array(10).fill(null)),
    width: 10,
    height: 20,
  });

  // Helper to create test piece
  const createTestPiece = (x: number, y: number): Piece => ({
    type: 'I',
    rotation: 0,
    position: { x, y },
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#C0C0C0',
  });

  describe('Boundary Collision', () => {
    it('should detect left boundary collision', () => {
      const grid = createEmptyGrid();
      const piece = createTestPiece(-1, 5); // Too far left

      expect(isValidPosition(piece, grid)).toBe(false);
    });

    it('should detect right boundary collision', () => {
      const grid = createEmptyGrid();
      const piece = createTestPiece(7, 5); // Too far right (I-piece is 4 cells wide)

      expect(isValidPosition(piece, grid)).toBe(false);
    });

    it('should detect bottom boundary collision', () => {
      const grid = createEmptyGrid();
      const piece = createTestPiece(3, 19); // At bottom

      expect(isValidPosition(piece, grid)).toBe(false);
    });

    it('should allow piece above visible area (spawn zone)', () => {
      const grid = createEmptyGrid();
      const piece = createTestPiece(3, -1); // Above grid

      expect(isValidPosition(piece, grid)).toBe(true);
    });

    it('should allow valid position within boundaries', () => {
      const grid = createEmptyGrid();
      const piece = createTestPiece(3, 10);

      expect(isValidPosition(piece, grid)).toBe(true);
    });
  });

  describe('Locked Block Collision', () => {
    it('should detect collision with locked blocks', () => {
      const grid = createEmptyGrid();
      // Place locked block at row 10, column 4
      grid.cells[10]![4] = '#FF0000';

      const piece = createTestPiece(3, 9); // I-piece would overlap at (4, 10)

      expect(isValidPosition(piece, grid)).toBe(false);
    });

    it('should allow position next to locked blocks', () => {
      const grid = createEmptyGrid();
      grid.cells[10]![4] = '#FF0000';

      const piece = createTestPiece(3, 8); // Above locked block

      expect(isValidPosition(piece, grid)).toBe(true);
    });

    it('should ignore locked blocks above visible area', () => {
      const grid = createEmptyGrid();
      const piece = createTestPiece(3, -2);

      // Even if there were locked blocks at y=-1, piece should be valid
      expect(isValidPosition(piece, grid)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle O-piece (2x2) at boundaries', () => {
      const grid = createEmptyGrid();
      const oPiece: Piece = {
        type: 'O',
        rotation: 0,
        position: { x: 7, y: 10 }, // x=7 allows O-piece to fit (cells at x=8,9)
        shape: [
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        color: '#FFD700',
      };

      expect(isValidPosition(oPiece, grid)).toBe(true);
    });

    it('should reject piece partially outside grid', () => {
      const grid = createEmptyGrid();
      const piece = createTestPiece(9, 10); // Partially outside right boundary

      expect(isValidPosition(piece, grid)).toBe(false);
    });
  });
});
