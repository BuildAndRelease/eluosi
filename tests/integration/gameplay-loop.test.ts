/**
 * Gameplay Loop Integration Tests
 *
 * Tests for full game cycle (start→move→lock→clear→gameover).
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Game } from '../../src/game/Game';

describe('Gameplay Loop', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Full game cycle', () => {
    it('should start game and spawn first piece', () => {
      game.start();
      const state = game.getGameState();
      expect(state.status).toBe('playing');
      expect(state.currentPiece).not.toBeNull();
    });

    it('should allow piece movement', () => {
      game.start();
      const state1 = game.getGameState();
      const x1 = state1.currentPiece!.position.x;
      game.moveRight();
      const state2 = game.getGameState();
      const x2 = state2.currentPiece!.position.x;
      expect(x2).toBe(x1 + 1);
    });

    it('should lock piece and spawn new one', () => {
      game.start();
      const state1 = game.getGameState();
      const piece1Type = state1.currentPiece!.type;

      // Hard drop to lock immediately
      game.hardDrop();

      const state2 = game.getGameState();
      // New piece should be spawned
      expect(state2.currentPiece).not.toBeNull();
    });

    it('should detect game over when pieces stack to top', () => {
      game.start();

      // Fill grid to near top
      const state = game.getGameState();
      for (let y = 1; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          state.grid.cells[y]![x] = '#FF0000';
        }
      }

      // Try to lock a piece at top
      game.hardDrop();

      const finalState = game.getGameState();
      expect(finalState.status).toBe('gameover');
    });
  });

  describe('Line clearing in gameplay', () => {
    it('should clear line and update score', () => {
      game.start();
      const state = game.getGameState();

      // Fill bottom row except 4 cells
      for (let x = 0; x < 6; x++) {
        state.grid.cells[19]![x] = '#FF0000';
      }

      // Position I-piece to complete the row
      state.currentPiece!.position.x = 6;
      state.currentPiece!.position.y = 18;

      const score1 = state.score;
      game.hardDrop();

      const state2 = game.getGameState();
      // Score should increase
      expect(state2.score).toBeGreaterThan(score1);
    });
  });

  describe('Pause and resume', () => {
    it('should pause and resume game', () => {
      game.start();
      game.pause();
      const state1 = game.getGameState();
      expect(state1.status).toBe('paused');

      game.resume();
      const state2 = game.getGameState();
      expect(state2.status).toBe('playing');
    });

    it('should not allow movement when paused', () => {
      game.start();
      const state1 = game.getGameState();
      const x1 = state1.currentPiece!.position.x;

      game.pause();
      game.moveRight();

      const state2 = game.getGameState();
      const x2 = state2.currentPiece!.position.x;
      expect(x2).toBe(x1);
    });
  });

  describe('Reset', () => {
    it('should reset game to initial state', () => {
      game.start();
      game.moveRight();
      game.hardDrop();

      game.reset();
      const state = game.getGameState();
      expect(state.status).toBe('menu');
      expect(state.score).toBe(0);
      expect(state.level).toBe(0);
      expect(state.lines).toBe(0);
    });
  });

  describe('Event callbacks', () => {
    it('should call onLinesClear when lines are cleared', () => {
      let linesClearedCount = 0;
      game.onLinesClear = (count) => {
        linesClearedCount = count;
      };

      game.start();
      const state = game.getGameState();

      // Fill bottom row except 4 cells
      for (let x = 0; x < 6; x++) {
        state.grid.cells[19]![x] = '#FF0000';
      }

      state.currentPiece!.position.x = 6;
      state.currentPiece!.position.y = 18;

      game.hardDrop();

      expect(linesClearedCount).toBeGreaterThan(0);
    });

    it('should call onGameOver when game ends', () => {
      let gameOverCalled = false;
      game.onGameOver = () => {
        gameOverCalled = true;
      };

      game.start();
      const state = game.getGameState();

      // Fill grid to top
      for (let y = 1; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          state.grid.cells[y]![x] = '#FF0000';
        }
      }

      game.hardDrop();

      expect(gameOverCalled).toBe(true);
    });
  });
});
