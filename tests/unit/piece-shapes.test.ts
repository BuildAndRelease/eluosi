/**
 * Piece Shapes Tests
 *
 * Tests for all 7 Tetromino shapes and 4 rotation states each.
 */

import { describe, it, expect } from 'vitest';
import { PIECE_SHAPES, getPieceColor } from '../../src/game/piece-shapes';
import type { PieceType } from '../../src/game/types';

describe('Piece Shapes', () => {
  const PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

  describe('Shape definitions', () => {
    it('should define all 7 piece types', () => {
      for (const type of PIECE_TYPES) {
        expect(PIECE_SHAPES[type]).toBeDefined();
      }
    });

    it('should have 4 rotation states for each piece', () => {
      for (const type of PIECE_TYPES) {
        expect(PIECE_SHAPES[type]).toHaveLength(4);
      }
    });

    it('should have 4x4 matrices for each rotation', () => {
      for (const type of PIECE_TYPES) {
        for (let r = 0; r < 4; r++) {
          const shape = PIECE_SHAPES[type]![r]!;
          expect(shape).toHaveLength(4);
          for (const row of shape) {
            expect(row).toHaveLength(4);
          }
        }
      }
    });

    it('should only contain 0 or 1 values in shape matrices', () => {
      for (const type of PIECE_TYPES) {
        for (let r = 0; r < 4; r++) {
          const shape = PIECE_SHAPES[type]![r]!;
          for (const row of shape) {
            for (const cell of row) {
              expect([0, 1]).toContain(cell);
            }
          }
        }
      }
    });
  });

  describe('I-piece', () => {
    it('rotation 0 should be horizontal (row 1)', () => {
      const shape = PIECE_SHAPES.I[0]!;
      expect(shape[1]).toEqual([1, 1, 1, 1]);
      expect(shape[0]).toEqual([0, 0, 0, 0]);
    });

    it('rotation 1 should be vertical (column 2)', () => {
      const shape = PIECE_SHAPES.I[1]!;
      for (let y = 0; y < 4; y++) {
        expect(shape[y]![2]).toBe(1);
      }
    });
  });

  describe('O-piece', () => {
    it('all rotations should be identical 2x2 square', () => {
      for (let r = 0; r < 4; r++) {
        const shape = PIECE_SHAPES.O[r]!;
        expect(shape[0]![1]).toBe(1);
        expect(shape[0]![2]).toBe(1);
        expect(shape[1]![1]).toBe(1);
        expect(shape[1]![2]).toBe(1);
      }
    });
  });

  describe('T-piece', () => {
    it('rotation 0 should have T-shape', () => {
      const shape = PIECE_SHAPES.T[0]!;
      expect(shape[0]![1]).toBe(1); // top center
      expect(shape[1]![0]).toBe(1); // left
      expect(shape[1]![1]).toBe(1); // center
      expect(shape[1]![2]).toBe(1); // right
    });
  });

  describe('getPieceColor', () => {
    it('should return a hex color for each piece type', () => {
      for (const type of PIECE_TYPES) {
        const color = getPieceColor(type);
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    });

    it('should return different colors for different piece types', () => {
      const colors = PIECE_TYPES.map(getPieceColor);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(PIECE_TYPES.length);
    });
  });
});
