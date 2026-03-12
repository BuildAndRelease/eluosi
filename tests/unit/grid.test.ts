/**
 * Grid Tests
 *
 * Tests for grid initialization, cell operations, row detection, and row clearing.
 */

import { describe, it, expect } from 'vitest';
import {
  createGrid,
  isEmpty,
  setCell,
  clearRow,
  getCompleteRows,
  shiftRowsDown,
  lockPiece,
} from '../../src/game/grid';

describe('Grid', () => {
  describe('createGrid', () => {
    it('should create a 10x20 grid', () => {
      const grid = createGrid();
      expect(grid.width).toBe(10);
      expect(grid.height).toBe(20);
    });

    it('should initialize all cells to null', () => {
      const grid = createGrid();
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          expect(grid.cells[y]![x]).toBeNull();
        }
      }
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty cell', () => {
      const grid = createGrid();
      expect(isEmpty(grid, 5, 10)).toBe(true);
    });

    it('should return false for occupied cell', () => {
      const grid = createGrid();
      grid.cells[10]![5] = '#FF0000';
      expect(isEmpty(grid, 5, 10)).toBe(false);
    });

    it('should return false for out-of-bounds coordinates', () => {
      const grid = createGrid();
      expect(isEmpty(grid, -1, 5)).toBe(false);
      expect(isEmpty(grid, 10, 5)).toBe(false);
      expect(isEmpty(grid, 5, -1)).toBe(false);
      expect(isEmpty(grid, 5, 20)).toBe(false);
    });
  });

  describe('setCell', () => {
    it('should set cell color and return new grid', () => {
      const grid = createGrid();
      const newGrid = setCell(grid, 3, 5, '#FF0000');
      expect(newGrid.cells[5]![3]).toBe('#FF0000');
    });

    it('should not mutate original grid', () => {
      const grid = createGrid();
      setCell(grid, 3, 5, '#FF0000');
      expect(grid.cells[5]![3]).toBeNull();
    });
  });

  describe('clearRow', () => {
    it('should clear all cells in a row', () => {
      let grid = createGrid();
      for (let x = 0; x < 10; x++) {
        grid = setCell(grid, x, 5, '#FF0000');
      }
      const newGrid = clearRow(grid, 5);
      for (let x = 0; x < 10; x++) {
        expect(newGrid.cells[5]![x]).toBeNull();
      }
    });

    it('should not affect other rows', () => {
      let grid = createGrid();
      grid = setCell(grid, 0, 4, '#FF0000');
      const newGrid = clearRow(grid, 5);
      expect(newGrid.cells[4]![0]).toBe('#FF0000');
    });
  });

  describe('getCompleteRows', () => {
    it('should return empty array for empty grid', () => {
      const grid = createGrid();
      expect(getCompleteRows(grid)).toEqual([]);
    });

    it('should detect a complete row', () => {
      let grid = createGrid();
      for (let x = 0; x < 10; x++) {
        grid = setCell(grid, x, 19, '#FF0000');
      }
      expect(getCompleteRows(grid)).toContain(19);
    });

    it('should not detect incomplete row', () => {
      let grid = createGrid();
      for (let x = 0; x < 9; x++) {
        grid = setCell(grid, x, 19, '#FF0000');
      }
      expect(getCompleteRows(grid)).not.toContain(19);
    });

    it('should detect multiple complete rows', () => {
      let grid = createGrid();
      for (let x = 0; x < 10; x++) {
        grid = setCell(grid, x, 18, '#FF0000');
        grid = setCell(grid, x, 19, '#FF0000');
      }
      const rows = getCompleteRows(grid);
      expect(rows).toContain(18);
      expect(rows).toContain(19);
    });
  });

  describe('shiftRowsDown', () => {
    it('should return same grid if no rows cleared', () => {
      const grid = createGrid();
      const result = shiftRowsDown(grid, []);
      expect(result).toBe(grid);
    });

    it('should shift rows down after clearing', () => {
      let grid = createGrid();
      // Fill row 19 completely
      for (let x = 0; x < 10; x++) {
        grid = setCell(grid, x, 19, '#FF0000');
      }
      // Place a block at row 18
      grid = setCell(grid, 0, 18, '#00FF00');

      const newGrid = shiftRowsDown(grid, [19]);
      // Row 18 block should now be at row 19
      expect(newGrid.cells[19]![0]).toBe('#00FF00');
      // Row 18 should be empty
      expect(newGrid.cells[18]![0]).toBeNull();
    });

    it('should add empty rows at top', () => {
      let grid = createGrid();
      for (let x = 0; x < 10; x++) {
        grid = setCell(grid, x, 19, '#FF0000');
      }
      const newGrid = shiftRowsDown(grid, [19]);
      expect(newGrid.cells[0]!.every((c) => c === null)).toBe(true);
    });
  });

  describe('lockPiece', () => {
    it('should lock piece cells into grid', () => {
      const grid = createGrid();
      const piece = {
        shape: [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        position: { x: 3, y: 10 },
        color: '#C0C0C0',
      };
      const newGrid = lockPiece(grid, piece);
      expect(newGrid.cells[11]![3]).toBe('#C0C0C0');
      expect(newGrid.cells[11]![4]).toBe('#C0C0C0');
      expect(newGrid.cells[11]![5]).toBe('#C0C0C0');
      expect(newGrid.cells[11]![6]).toBe('#C0C0C0');
    });

    it('should not mutate original grid', () => {
      const grid = createGrid();
      const piece = {
        shape: [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        position: { x: 0, y: 0 },
        color: '#FF0000',
      };
      lockPiece(grid, piece);
      expect(grid.cells[0]![0]).toBeNull();
    });
  });
});
