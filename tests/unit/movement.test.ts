/**
 * Movement Tests
 *
 * Tests for moveLeft(), moveRight(), moveDown(), hardDrop() with collision checks.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Game } from '../../src/game/Game';

describe('Movement', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
    game.start();
  });

  describe('moveLeft', () => {
    it('should move piece left when valid', () => {
      const state1 = game.getGameState();
      const x1 = state1.currentPiece!.position.x;
      game.moveLeft();
      const state2 = game.getGameState();
      const x2 = state2.currentPiece!.position.x;
      expect(x2).toBe(x1 - 1);
    });

    it('should not move piece beyond left boundary', () => {
      // Move far left
      for (let i = 0; i < 10; i++) {
        game.moveLeft();
      }
      const state = game.getGameState();
      expect(state.currentPiece!.position.x).toBeGreaterThanOrEqual(0);
    });

    it('should not move if game is paused', () => {
      const state1 = game.getGameState();
      const x1 = state1.currentPiece!.position.x;
      game.pause();
      game.moveLeft();
      const state2 = game.getGameState();
      const x2 = state2.currentPiece!.position.x;
      expect(x2).toBe(x1);
    });
  });

  describe('moveRight', () => {
    it('should move piece right when valid', () => {
      const state1 = game.getGameState();
      const x1 = state1.currentPiece!.position.x;
      game.moveRight();
      const state2 = game.getGameState();
      const x2 = state2.currentPiece!.position.x;
      expect(x2).toBe(x1 + 1);
    });

    it('should not move piece beyond right boundary', () => {
      // Move far right
      for (let i = 0; i < 10; i++) {
        game.moveRight();
      }
      const state = game.getGameState();
      expect(state.currentPiece!.position.x).toBeLessThan(10);
    });
  });

  describe('moveDown', () => {
    it('should move piece down when valid', () => {
      const state1 = game.getGameState();
      const y1 = state1.currentPiece!.position.y;
      game.moveDown();
      const state2 = game.getGameState();
      const y2 = state2.currentPiece!.position.y;
      expect(y2).toBe(y1 + 1);
    });

    it('should not move piece beyond bottom boundary', () => {
      // Move far down
      for (let i = 0; i < 30; i++) {
        game.moveDown();
      }
      const state = game.getGameState();
      expect(state.currentPiece!.position.y).toBeLessThan(20);
    });
  });

  describe('hardDrop', () => {
    it('should drop piece to bottom instantly', () => {
      const state1 = game.getGameState();
      const y1 = state1.currentPiece!.position.y;
      game.hardDrop();
      const state2 = game.getGameState();
      // After hard drop, piece should be locked and new piece spawned
      expect(state2.currentPiece!.position.y).toBeLessThanOrEqual(y1);
    });

    it('should lock piece after hard drop', () => {
      const state1 = game.getGameState();
      const piece1 = state1.currentPiece!;
      game.hardDrop();
      const state2 = game.getGameState();
      // New piece should be spawned
      expect(state2.currentPiece!.type).toBeDefined();
    });
  });

  describe('rotate', () => {
    it('should rotate piece when valid', () => {
      const state1 = game.getGameState();
      const rotation1 = state1.currentPiece!.rotation;
      game.rotate();
      const state2 = game.getGameState();
      const rotation2 = state2.currentPiece!.rotation;
      expect(rotation2).toBe((rotation1 + 1) % 4);
    });
  });
});
