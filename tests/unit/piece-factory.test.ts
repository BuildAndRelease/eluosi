/**
 * Piece Factory Tests
 *
 * Tests for random piece generation and spawn position.
 */

import { describe, it, expect } from 'vitest';
import { createPiece, createRandomPiece } from '../../src/game/piece-factory';
import { PIECE_SHAPES } from '../../src/game/piece-shapes';
import type { PieceType } from '../../src/game/types';

describe('Piece Factory', () => {
  const PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

  describe('createPiece', () => {
    it('should create piece at spawn position (x=3, y=0)', () => {
      const piece = createPiece('I');
      expect(piece.position.x).toBe(3);
      expect(piece.position.y).toBe(0);
    });

    it('should create piece with correct type', () => {
      for (const type of PIECE_TYPES) {
        const piece = createPiece(type);
        expect(piece.type).toBe(type);
      }
    });

    it('should create piece with default rotation 0', () => {
      const piece = createPiece('T');
      expect(piece.rotation).toBe(0);
    });

    it('should create piece with specified rotation', () => {
      const piece = createPiece('I', 2);
      expect(piece.rotation).toBe(2);
      expect(piece.shape).toEqual(PIECE_SHAPES.I[2]);
    });

    it('should create piece with correct shape for type and rotation', () => {
      for (const type of PIECE_TYPES) {
        for (let r = 0; r < 4; r++) {
          const piece = createPiece(type, r);
          expect(piece.shape).toEqual(PIECE_SHAPES[type]![r]);
        }
      }
    });

    it('should create piece with a hex color', () => {
      const piece = createPiece('O');
      expect(piece.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  describe('createRandomPiece', () => {
    it('should create a valid piece type', () => {
      for (let i = 0; i < 20; i++) {
        const piece = createRandomPiece();
        expect(PIECE_TYPES).toContain(piece.type);
      }
    });

    it('should spawn at correct position', () => {
      const piece = createRandomPiece();
      expect(piece.position.x).toBe(3);
      expect(piece.position.y).toBe(0);
    });

    it('should generate all piece types over many iterations', () => {
      const seen = new Set<PieceType>();
      for (let i = 0; i < 200; i++) {
        seen.add(createRandomPiece().type);
      }
      // All 7 types should appear
      expect(seen.size).toBe(7);
    });
  });
});
