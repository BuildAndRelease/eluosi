/**
 * Piece Factory
 *
 * Creates Tetromino pieces with random types and proper spawn positions.
 */

import type { Piece, PieceType } from './types';
import { PIECE_SHAPES, getPieceColor } from './piece-shapes';

const PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

/**
 * Create a piece of specific type at spawn position
 *
 * @param type - The piece type
 * @param rotation - Initial rotation (default 0)
 * @returns New piece at spawn position (row 0, columns 3-6)
 */
export function createPiece(type: PieceType, rotation: number = 0): Piece {
  return {
    type,
    rotation,
    position: { x: 3, y: 0 }, // Spawn at top center
    shape: PIECE_SHAPES[type]![rotation]!,
    color: getPieceColor(type),
  };
}

/**
 * Create a random piece at spawn position
 *
 * @returns New random piece with equal probability for each type
 */
export function createRandomPiece(): Piece {
  const randomType = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)]!;
  return createPiece(randomType);
}
