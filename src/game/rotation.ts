/**
 * Rotation System
 *
 * Implements 90° clockwise rotation with simplified SRS wall kicks.
 */

import type { Piece, Grid } from './types';
import { PIECE_SHAPES } from './piece-shapes';
import { isValidPosition } from './collision';

/**
 * Simplified SRS wall kick offsets
 * Try these offsets in order when rotation causes collision
 */
const WALL_KICK_OFFSETS = [
  { x: 0, y: 0 },   // No offset
  { x: -1, y: 0 },  // One left
  { x: 1, y: 0 },   // One right
  { x: 0, y: -1 },  // One up
];

/**
 * Rotate piece 90° clockwise
 *
 * @param piece - The piece to rotate
 * @param grid - The game grid
 * @returns New piece with rotation applied, or original if rotation invalid
 */
export function rotatePiece(piece: Piece, grid: Grid): Piece {
  // Calculate next rotation state (0-3)
  const nextRotation = (piece.rotation + 1) % 4;
  const nextShape = PIECE_SHAPES[piece.type]![nextRotation]!;

  // Try rotation with wall kicks
  for (const offset of WALL_KICK_OFFSETS) {
    const testPiece: Piece = {
      ...piece,
      rotation: nextRotation,
      shape: nextShape,
      position: {
        x: piece.position.x + offset.x,
        y: piece.position.y + offset.y,
      },
    };

    if (isValidPosition(testPiece, grid)) {
      return testPiece;
    }
  }

  // All wall kicks failed, return original piece
  return piece;
}
