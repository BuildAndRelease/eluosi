/**
 * Line Clearing Tests
 *
 * Tests for detecting complete rows, clearing 1-4 lines, and shifting blocks down.
 */

import { describe, it, expect } from 'vitest';
import { getCompleteRows, shiftRowsDown, lockPiece } from '../../src/game/grid';
import { createGrid } from '../../src/game/grid';

describe('Line Clearing', () => {
  describe('Detecting complete rows', () => {
    it('should detect single complete row', () => {
      let grid = createGrid();
      // Fill bottom row completely
      for (let x = 0; x < 10; x++) {
        grid.cells[19]![x] = '#FF0000';
      }
      const rows = getCompleteRows(grid);
      expect(rows).toContain(19);
      expect(rows.length).toBe(1);
    });

    it('should detect multiple complete rows', () => {
      let grid = createGrid();
      // Fill rows 18 and 19
      for (let y = 18; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          grid.cells[y]![x] = '#FF0000';
        }
      }
      const rows = getCompleteRows(grid);
      expect(rows).toContain(18);
      expect(rows).toContain(19);
      expect(rows.length).toBe(2);
    });

    it('should not detect incomplete row', () => {
      let grid = createGrid();
      // Fill row 19 except last cell
      for (let x = 0; x < 9; x++) {
        grid.cells[19]![x] = '#FF0000';
      }
      const rows = getCompleteRows(grid);
      expect(rows).not.toContain(19);
    });

    it('should detect 4 complete rows (Tetris)', () => {
      let grid = createGrid();
      // Fill rows 16-19
      for (let y = 16; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          grid.cells[y]![x] = '#FF0000';
        }
      }
      const rows = getCompleteRows(grid);
      expect(rows.length).toBe(4);
    });
  });

  describe('Shifting blocks down', () => {
    it('should shift blocks down after clearing bottom row', () => {
      let grid = createGrid();
      // Place a block at row 18
      grid.cells[18]![5] = '#00FF00';
      // Fill row 19
      for (let x = 0; x < 10; x++) {
        grid.cells[19]![x] = '#FF0000';
      }

      const newGrid = shiftRowsDown(grid, [19]);
      // Block from row 18 should now be at row 19
      expect(newGrid.cells[19]![5]).toBe('#00FF00');
      // Row 18 should be empty
      expect(newGrid.cells[18]![5]).toBeNull();
    });

    it('should shift blocks down after clearing multiple rows', () => {
      let grid = createGrid();
      // Place a block at row 17
      grid.cells[17]![5] = '#00FF00';
      // Fill rows 18 and 19
      for (let y = 18; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          grid.cells[y]![x] = '#FF0000';
        }
      }

      const newGrid = shiftRowsDown(grid, [18, 19]);
      // Block from row 17 should now be at row 19
      expect(newGrid.cells[19]![5]).toBe('#00FF00');
    });

    it('should add empty rows at top', () => {
      let grid = createGrid();
      // Fill bottom row
      for (let x = 0; x < 10; x++) {
        grid.cells[19]![x] = '#FF0000';
      }

      const newGrid = shiftRowsDown(grid, [19]);
      // Top row should be empty
      for (let x = 0; x < 10; x++) {
        expect(newGrid.cells[0]![x]).toBeNull();
      }
    });

    it('should preserve blocks above cleared rows', () => {
      let grid = createGrid();
      // Place blocks at rows 10-15
      for (let y = 10; y < 16; y++) {
        grid.cells[y]![5] = '#00FF00';
      }
      // Fill row 19
      for (let x = 0; x < 10; x++) {
        grid.cells[19]![x] = '#FF0000';
      }

      const newGrid = shiftRowsDown(grid, [19]);
      // Blocks should shift down by 1
      for (let y = 11; y < 17; y++) {
        expect(newGrid.cells[y]![5]).toBe('#00FF00');
      }
    });
  });

  describe('Integration with lockPiece', () => {
    it('should detect complete row after locking I-piece horizontally', () => {
      let grid = createGrid();
      // Fill row 19 except 4 cells
      for (let x = 0; x < 6; x++) {
        grid.cells[19]![x] = '#FF0000';
      }

      // Lock I-piece to complete the row
      const piece = {
        shape: [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        position: { x: 6, y: 18 },
        color: '#C0C0C0',
      };
      grid = lockPiece(grid, piece);

      const rows = getCompleteRows(grid);
      expect(rows).toContain(19);
    });
  });
});
