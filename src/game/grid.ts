/**
 * Grid Management
 *
 * Manages the 10×20 game grid including cell operations,
 * row detection, and line clearing.
 */

import type { Grid } from './types';
import { GRID_WIDTH, GRID_HEIGHT } from '../config/constants';

/**
 * Create empty grid
 */
export function createGrid(): Grid {
  return {
    cells: Array(GRID_HEIGHT)
      .fill(null)
      .map(() => Array(GRID_WIDTH).fill(null)),
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
  };
}

/**
 * Check if a cell is empty
 */
export function isEmpty(grid: Grid, x: number, y: number): boolean {
  if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) {
    return false;
  }
  return grid.cells[y]![x] === null;
}

/**
 * Set a cell color
 */
export function setCell(grid: Grid, x: number, y: number, color: string): Grid {
  const newCells = grid.cells.map((row, rowIndex) =>
    rowIndex === y ? row.map((cell, colIndex) => (colIndex === x ? color : cell)) : row
  );

  return {
    ...grid,
    cells: newCells,
  };
}

/**
 * Clear a row
 */
export function clearRow(grid: Grid, y: number): Grid {
  const newCells = grid.cells.map((row, rowIndex) =>
    rowIndex === y ? Array(GRID_WIDTH).fill(null) : row
  );

  return {
    ...grid,
    cells: newCells,
  };
}

/**
 * Get indices of complete rows
 */
export function getCompleteRows(grid: Grid): number[] {
  const completeRows: number[] = [];

  for (let y = 0; y < grid.height; y++) {
    const row = grid.cells[y]!;
    if (row.every((cell) => cell !== null)) {
      completeRows.push(y);
    }
  }

  return completeRows;
}

/**
 * Shift rows down after clearing lines
 *
 * @param grid - The grid
 * @param clearedRows - Sorted array of cleared row indices
 * @returns New grid with rows shifted down
 */
export function shiftRowsDown(grid: Grid, clearedRows: number[]): Grid {
  if (clearedRows.length === 0) {
    return grid;
  }

  const newCells = [...grid.cells];

  // Sort in descending order to process from bottom to top
  const sortedRows = [...clearedRows].sort((a, b) => b - a);

  for (const clearedRow of sortedRows) {
    // Remove cleared row
    newCells.splice(clearedRow, 1);
    // Add empty row at top
    newCells.unshift(Array(GRID_WIDTH).fill(null));
  }

  return {
    ...grid,
    cells: newCells,
  };
}

/**
 * Lock piece into grid
 */
export function lockPiece(grid: Grid, piece: { shape: number[][]; position: { x: number; y: number }; color: string }): Grid {
  let newGrid = grid;

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (piece.shape[y]![x]) {
        const gridX = piece.position.x + x;
        const gridY = piece.position.y + y;

        if (gridY >= 0 && gridY < grid.height && gridX >= 0 && gridX < grid.width) {
          newGrid = setCell(newGrid, gridX, gridY, piece.color);
        }
      }
    }
  }

  return newGrid;
}
