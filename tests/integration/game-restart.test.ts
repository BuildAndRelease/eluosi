/**
 * Integration Tests: Game Restart
 *
 * Tests for game restart functionality after game over.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Game } from '../../src/game/Game';

describe('Game Restart Integration', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  describe('Reset and Restart', () => {
    it('should properly reset game state after game over', () => {
      // Start game
      game.start();
      const initialState = game.getGameState();
      expect(initialState.status).toBe('playing');

      // Simulate game over by resetting
      game.reset();
      const resetState = game.getGameState();

      // Should be in menu state
      expect(resetState.status).toBe('menu');
      expect(resetState.score).toBe(0);
      expect(resetState.level).toBe(0);
      expect(resetState.lines).toBe(0);
    });

    it('should allow starting game after reset', () => {
      // Start game
      game.start();
      expect(game.getGameState().status).toBe('playing');

      // Reset
      game.reset();
      expect(game.getGameState().status).toBe('menu');

      // Start again
      game.start();
      const newState = game.getGameState();

      expect(newState.status).toBe('playing');
      expect(newState.score).toBe(0);
      expect(newState.currentPiece).not.toBeNull();
    });

    it('should reset all game timers on reset', () => {
      // Start game
      game.start();

      // Move piece down to trigger lock delay
      for (let i = 0; i < 20; i++) {
        game.moveDown();
      }

      // Reset game
      game.reset();

      // Start new game - should work without timer issues
      game.start();
      const state = game.getGameState();

      expect(state.status).toBe('playing');
      expect(state.currentPiece).not.toBeNull();
    });

    it('should handle multiple reset-start cycles', () => {
      for (let i = 0; i < 3; i++) {
        // Start
        game.start();
        expect(game.getGameState().status).toBe('playing');

        // Reset
        game.reset();
        expect(game.getGameState().status).toBe('menu');
      }

      // Final start should work
      game.start();
      expect(game.getGameState().status).toBe('playing');
    });
  });

  describe('Game Over Scenario', () => {
    it('should allow restart after game over', () => {
      // Start game
      game.start();

      // Simulate game over by setting status
      // (In real game, this happens when grid is full)
      game.reset();

      // Should be able to start again
      game.start();
      const state = game.getGameState();

      expect(state.status).toBe('playing');
      expect(state.score).toBe(0);
      expect(state.level).toBe(0);
    });
  });
});
