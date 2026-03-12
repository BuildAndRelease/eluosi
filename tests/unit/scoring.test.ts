/**
 * Scoring Tests
 *
 * Tests for score calculation (50/300/500/1000 × (level+1) for 1/2/3/4 lines).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Game } from '../../src/game/Game';

describe('Scoring', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
    game.start();
  });

  describe('Base score calculation', () => {
    it('should award 50 × (level+1) for single line clear', () => {
      const state = game.getGameState();
      const level = state.level;
      const expectedScore = 50 * (level + 1);

      // Fill bottom row except 4 cells
      for (let x = 0; x < 6; x++) {
        state.grid.cells[19]![x] = '#FF0000';
      }

      state.currentPiece!.position.x = 6;
      state.currentPiece!.position.y = 18;

      const score1 = state.score;
      game.hardDrop();

      const state2 = game.getGameState();
      expect(state2.score - score1).toBe(expectedScore);
    });

    it('should award 300 × (level+1) for double line clear', () => {
      const state = game.getGameState();
      const level = state.level;
      const expectedScore = 300 * (level + 1);

      // Fill rows 18 and 19 except 4 cells each
      for (let y = 18; y < 20; y++) {
        for (let x = 0; x < 6; x++) {
          state.grid.cells[y]![x] = '#FF0000';
        }
      }

      // Position piece to complete both rows
      state.currentPiece!.position.x = 6;
      state.currentPiece!.position.y = 17;

      const score1 = state.score;
      game.hardDrop();

      const state2 = game.getGameState();
      expect(state2.score - score1).toBe(expectedScore);
    });

    it('should award 500 × (level+1) for triple line clear', () => {
      const state = game.getGameState();
      const level = state.level;
      const expectedScore = 500 * (level + 1);

      // Fill rows 17, 18, 19 except 4 cells each
      for (let y = 17; y < 20; y++) {
        for (let x = 0; x < 6; x++) {
          state.grid.cells[y]![x] = '#FF0000';
        }
      }

      state.currentPiece!.position.x = 6;
      state.currentPiece!.position.y = 16;

      const score1 = state.score;
      game.hardDrop();

      const state2 = game.getGameState();
      expect(state2.score - score1).toBe(expectedScore);
    });

    it('should award 1000 × (level+1) for Tetris (4 lines)', () => {
      const state = game.getGameState();
      const level = state.level;
      const expectedScore = 1000 * (level + 1);

      // Fill rows 16-19 except 4 cells each
      for (let y = 16; y < 20; y++) {
        for (let x = 0; x < 6; x++) {
          state.grid.cells[y]![x] = '#FF0000';
        }
      }

      state.currentPiece!.position.x = 6;
      state.currentPiece!.position.y = 15;

      const score1 = state.score;
      game.hardDrop();

      const state2 = game.getGameState();
      expect(state2.score - score1).toBe(expectedScore);
    });
  });

  describe('Score accumulation', () => {
    it('should accumulate score across multiple line clears', () => {
      const state = game.getGameState();

      // Clear first line
      for (let x = 0; x < 6; x++) {
        state.grid.cells[19]![x] = '#FF0000';
      }
      state.currentPiece!.position.x = 6;
      state.currentPiece!.position.y = 18;
      game.hardDrop();

      const score1 = game.getGameState().score;

      // Clear second line
      const state2 = game.getGameState();
      for (let x = 0; x < 6; x++) {
        state2.grid.cells[19]![x] = '#FF0000';
      }
      state2.currentPiece!.position.x = 6;
      state2.currentPiece!.position.y = 18;
      game.hardDrop();

      const score2 = game.getGameState().score;

      expect(score2).toBeGreaterThan(score1);
    });
  });

  describe('Event callbacks', () => {
    it('should call onScoreChange when score increases', () => {
      let newScore = 0;
      game.onScoreChange = (score) => {
        newScore = score;
      };

      const state = game.getGameState();
      for (let x = 0; x < 6; x++) {
        state.grid.cells[19]![x] = '#FF0000';
      }
      state.currentPiece!.position.x = 6;
      state.currentPiece!.position.y = 18;

      game.hardDrop();

      expect(newScore).toBeGreaterThan(0);
    });
  });
});
