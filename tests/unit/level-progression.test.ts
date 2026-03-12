/**
 * Level Progression Tests
 *
 * Tests for level increases every 500 points (max level 15).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Game } from '../../src/game/Game';

describe('Level Progression', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
    game.start();
  });

  describe('Level increases', () => {
    it('should start at level 0', () => {
      const state = game.getGameState();
      expect(state.level).toBe(0);
    });

    it('should increase level at 500 points', () => {
      const state = game.getGameState();

      // Simulate scoring 500 points (e.g., 10 single line clears at level 0)
      for (let i = 0; i < 10; i++) {
        for (let x = 0; x < 6; x++) {
          state.grid.cells[19]![x] = '#FF0000';
        }
        state.currentPiece!.position.x = 6;
        state.currentPiece!.position.y = 18;
        game.hardDrop();
      }

      const finalState = game.getGameState();
      expect(finalState.level).toBeGreaterThan(0);
    });

    it('should cap level at 15', () => {
      const state = game.getGameState();

      // Simulate scoring 8000 points (level 15 threshold is 7500)
      for (let i = 0; i < 160; i++) {
        for (let x = 0; x < 6; x++) {
          state.grid.cells[19]![x] = '#FF0000';
        }
        state.currentPiece!.position.x = 6;
        state.currentPiece!.position.y = 18;
        game.hardDrop();
      }

      const finalState = game.getGameState();
      expect(finalState.level).toBeLessThanOrEqual(15);
    });
  });

  describe('Event callbacks', () => {
    it('should call onLevelChange when level increases', () => {
      let newLevel = 0;
      game.onLevelChange = (level) => {
        newLevel = level;
      };

      const state = game.getGameState();

      // Score enough to level up
      for (let i = 0; i < 10; i++) {
        for (let x = 0; x < 6; x++) {
          state.grid.cells[19]![x] = '#FF0000';
        }
        state.currentPiece!.position.x = 6;
        state.currentPiece!.position.y = 18;
        game.hardDrop();
      }

      expect(newLevel).toBeGreaterThan(0);
    });
  });
});
