/**
 * Collision Detection
 *
 * Validates whether a piece can be placed at a given position without
 * colliding with grid boundaries or locked blocks.
 */

import type { Piece, Grid } from './types';

/**
 * Check if a piece position is valid (no collisions)
 *
 * @param piece - The piece to check
 * @param grid - The game grid
 * @returns true if position is valid, false if collision detected
 */
export function isValidPosition(piece: Piece, grid: Grid): boolean {
  const { shape, position } = piece;

  // Check each filled cell in the piece's shape matrix
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      // Skip empty cells in shape matrix
      if (!shape[y]![x]) {
        continue;
      }

      // Calculate absolute grid position
      const gridX = position.x + x;
      const gridY = position.y + y;

      // Check left/right boundaries
      if (gridX < 0 || gridX >= grid.width) {
        return false;
      }

      // Check bottom boundary
      if (gridY >= grid.height) {
        return false;
      }

      // Allow pieces above visible area (spawn zone)
      if (gridY < 0) {
        continue;
      }

      // Check collision with locked blocks
      if (grid.cells[gridY]![gridX] !== null) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Check if a piece is touching the bottom or locked blocks
 *
 * @param piece - The piece to check
 * @param grid - The game grid
 * @returns true if piece is touching bottom/blocks
 */
export function isTouchingBottom(piece: Piece, grid: Grid): boolean {
  // Create a test piece one cell below current position
  const testPiece: Piece = {
    ...piece,
    position: { x: piece.position.x, y: piece.position.y + 1 },
  };

  // If moving down would be invalid, piece is touching bottom
  return !isValidPosition(testPiece, grid);
}
