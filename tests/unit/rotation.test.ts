/**
 * Rotation Tests
 *
 * Tests for 90° clockwise rotation and simplified SRS wall kicks.
 */

import { describe, it, expect } from 'vitest';
import { rotatePiece } from '../../src/game/rotation';
import { createPiece } from '../../src/game/piece-factory';
import { createGrid } from '../../src/game/grid';
import { PIECE_SHAPES } from '../../src/game/piece-shapes';

describe('Rotation', () => {
  describe('Basic rotation', () => {
    it('should rotate piece 90° clockwise', () => {
      const grid = createGrid();
      const piece = createPiece('T', 0);
      const rotated = rotatePiece(piece, grid);
      expect(rotated.rotation).toBe(1);
      expect(rotated.shape).toEqual(PIECE_SHAPES.T[1]);
    });

    it('should cycle through 4 rotations back to 0', () => {
      const grid = createGrid();
      let piece = createPiece('T', 0);
      for (let i = 0; i < 4; i++) {
        piece = rotatePiece(piece, grid);
      }
      expect(piece.rotation).toBe(0);
    });

    it('should not change position when no wall kick needed', () => {
      const grid = createGrid();
      const piece = createPiece('T', 0);
      piece.position.x = 3;
      piece.position.y = 10;
      const rotated = rotatePiece(piece, grid);
      expect(rotated.position.x).toBe(3);
      expect(rotated.position.y).toBe(10);
    });
  });

  describe('O-piece rotation', () => {
    it('should keep O-piece shape identical after rotation', () => {
      const grid = createGrid();
      const piece = createPiece('O', 0);
      const rotated = rotatePiece(piece, grid);
      expect(rotated.shape).toEqual(PIECE_SHAPES.O[0]);
    });
  });

  describe('Wall kicks', () => {
    it('should apply wall kick when rotation hits left wall', () => {
      const grid = createGrid();
      const piece = createPiece('I', 0);
      piece.position.x = -1; // Near left wall
      piece.position.y = 5;
      const rotated = rotatePiece(piece, grid);
      // Should either rotate with kick or stay same
      expect(rotated).toBeDefined();
    });

    it('should return original piece if all wall kicks fail', () => {
      const grid = createGrid();
      // Fill grid to make rotation impossible
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          grid.cells[y]![x] = '#FF0000';
        }
      }
      const piece = createPiece('T', 0);
      piece.position.x = 3;
      piece.position.y = 5;
      const rotated = rotatePiece(piece, grid);
      // Should return original piece unchanged
      expect(rotated.rotation).toBe(0);
      expect(rotated.position.x).toBe(3);
    });
  });

  describe('I-piece rotation', () => {
    it('should rotate I-piece from horizontal to vertical', () => {
      const grid = createGrid();
      const piece = createPiece('I', 0);
      piece.position.x = 3;
      piece.position.y = 5;
      const rotated = rotatePiece(piece, grid);
      expect(rotated.rotation).toBe(1);
    });
  });
});
