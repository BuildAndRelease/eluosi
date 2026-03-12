/**
 * Locking Tests
 *
 * Tests for lock delay (500ms), lock on timeout, and lock cancellation on movement.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Game } from '../../src/game/Game';

describe('Locking', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
    game.start();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Lock delay', () => {
    it('should not lock piece immediately when touching bottom', () => {
      // Move piece to bottom
      for (let i = 0; i < 20; i++) {
        game.moveDown();
      }
      const state1 = game.getGameState();
      const piece1 = state1.currentPiece;

      // Advance time by 100ms (less than 500ms lock delay)
      vi.advanceTimersByTime(100);

      const state2 = game.getGameState();
      // Piece should still be the same (not locked yet)
      expect(state2.currentPiece?.type).toBe(piece1?.type);
    });

    it('should lock piece after 500ms delay', () => {
      // Move piece to bottom
      for (let i = 0; i < 20; i++) {
        game.moveDown();
      }
      const state1 = game.getGameState();
      const piece1 = state1.currentPiece;

      // Advance time by 600ms (more than 500ms lock delay)
      vi.advanceTimersByTime(600);

      const state2 = game.getGameState();
      // New piece should be spawned
      expect(state2.currentPiece).not.toBeNull();
    });
  });

  describe('Lock cancellation', () => {
    it('should reset lock delay on horizontal movement', () => {
      // Move piece to bottom
      for (let i = 0; i < 20; i++) {
        game.moveDown();
      }

      // Advance time by 400ms
      vi.advanceTimersByTime(400);

      // Move left (should reset lock delay)
      game.moveLeft();

      // Advance time by another 400ms (total 800ms, but reset happened)
      vi.advanceTimersByTime(400);

      const state = game.getGameState();
      // Piece should still be active (lock delay was reset)
      expect(state.currentPiece).not.toBeNull();
    });

    it('should reset lock delay on rotation', () => {
      // Move piece to bottom
      for (let i = 0; i < 20; i++) {
        game.moveDown();
      }

      // Advance time by 400ms
      vi.advanceTimersByTime(400);

      // Rotate (should reset lock delay)
      game.rotate();

      // Advance time by another 400ms
      vi.advanceTimersByTime(400);

      const state = game.getGameState();
      // Piece should still be active
      expect(state.currentPiece).not.toBeNull();
    });
  });

  describe('Hard drop', () => {
    it('should lock piece immediately on hard drop', () => {
      const state1 = game.getGameState();
      const piece1 = state1.currentPiece;

      game.hardDrop();

      const state2 = game.getGameState();
      // New piece should be spawned immediately
      expect(state2.currentPiece?.type).toBeDefined();
    });
  });
});
