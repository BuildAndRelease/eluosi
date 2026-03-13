/**
 * Obstacle Rows System
 *
 * Functions for generating and managing obstacle rows that appear at higher levels.
 * Obstacle rows are added from the bottom of the grid with one random gap.
 */

import { COLOR_PALETTE_ARRAY } from '../config/colors';

/**
 * Generate an obstacle row with one random gap
 * @param gridWidth - Width of the game grid (typically 10)
 * @returns Array of colors with one null (gap) at random position
 */
export function generateObstacleRow(gridWidth: number): (string | null)[] {
  if (gridWidth < 2) {
    throw new Error(`Invalid grid width: ${gridWidth}. Must be >= 2.`);
  }

  // Create array filled with random colors
  const row: (string | null)[] = new Array(gridWidth);

  // Fill with random colors from palette
  for (let i = 0; i < gridWidth; i++) {
    const randomColor = COLOR_PALETTE_ARRAY[Math.floor(Math.random() * COLOR_PALETTE_ARRAY.length)]!;
    row[i] = randomColor;
  }

  // Create one random gap
  const gapPosition = Math.floor(Math.random() * gridWidth);
  row[gapPosition] = null;

  return row;
}

/**
 * Insert obstacle row at the bottom of the grid, shifting all rows up
 * @param grid - Current grid cells
 * @param obstacleRow - The obstacle row to insert
 * @returns New grid with obstacle row inserted at bottom
 * @throws Error if insertion would cause game over (top row has blocks)
 */
export function insertObstacleRow(
  grid: (string | null)[][],
  obstacleRow: (string | null)[]
): (string | null)[][] {
  if (grid.length === 0) {
    throw new Error('Cannot insert obstacle row into empty grid');
  }

  if (obstacleRow.length !== grid[0]!.length) {
    throw new Error(
      `Obstacle row width (${obstacleRow.length}) does not match grid width (${grid[0]!.length})`
    );
  }

  // Check if top row has any blocks (would cause game over)
  const topRow = grid[0]!;
  const hasBlocksInTopRow = topRow.some((cell) => cell !== null);

  if (hasBlocksInTopRow) {
    throw new Error('Cannot insert obstacle row: top row contains blocks (game over condition)');
  }

  // Shift all rows up by one
  const newGrid = grid.slice(0, -1);

  // Insert obstacle row at the bottom
  newGrid.push(obstacleRow);

  return newGrid;
}

/**
 * Validate obstacle row has exactly one gap
 * @param row - The obstacle row to validate
 * @returns true if row has exactly one null (gap)
 */
export function validateObstacleRow(row: (string | null)[]): boolean {
  const gapCount = row.filter((cell) => cell === null).length;
  return gapCount === 1;
}

/**
 * Get random gap position for obstacle row
 * @param gridWidth - Width of the game grid
 * @returns Random column index for gap (0 to gridWidth-1)
 */
export function getRandomGapPosition(gridWidth: number): number {
  return Math.floor(Math.random() * gridWidth);
}
