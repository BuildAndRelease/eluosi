/**
 * Game State Tests
 *
 * Tests for game state initialization, transitions (menu→playing→gameover), and state updates.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Game } from '../../src/game/Game';

describe('Game State', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  describe('Initialization', () => {
    it('should initialize with menu status', () => {
      const state = game.getGameState();
      expect(state.status).toBe('menu');
    });

    it('should initialize with score 0', () => {
      const state = game.getGameState();
      expect(state.score).toBe(0);
    });

    it('should initialize with level 0', () => {
      const state = game.getGameState();
      expect(state.level).toBe(0);
    });

    it('should initialize with lines 0', () => {
      const state = game.getGameState();
      expect(state.lines).toBe(0);
    });

    it('should initialize with empty grid', () => {
      const state = game.getGameState();
      expect(state.grid.width).toBe(10);
      expect(state.grid.height).toBe(20);
    });

    it('should initialize with nextPiece', () => {
      const state = game.getGameState();
      expect(state.nextPiece).toBeDefined();
      expect(state.nextPiece.type).toBeDefined();
    });

    it('should initialize with no currentPiece', () => {
      const state = game.getGameState();
      expect(state.currentPiece).toBeNull();
    });
  });

  describe('State transitions', () => {
    it('should transition from menu to playing on start', () => {
      game.start();
      const state = game.getGameState();
      expect(state.status).toBe('playing');
    });

    it('should transition from playing to paused on pause', () => {
      game.start();
      game.pause();
      const state = game.getGameState();
      expect(state.status).toBe('paused');
    });

    it('should transition from paused to playing on resume', () => {
      game.start();
      game.pause();
      game.resume();
      const state = game.getGameState();
      expect(state.status).toBe('playing');
    });

    it('should transition to menu on reset', () => {
      game.start();
      game.reset();
      const state = game.getGameState();
      expect(state.status).toBe('menu');
    });

    it('should not start if already playing', () => {
      game.start();
      const state1 = game.getGameState();
      game.start();
      const state2 = game.getGameState();
      expect(state1.startTime).toBe(state2.startTime);
    });
  });

  describe('State updates', () => {
    it('should spawn currentPiece on start', () => {
      game.start();
      const state = game.getGameState();
      expect(state.currentPiece).not.toBeNull();
    });

    it('should reset score on reset', () => {
      game.start();
      // Simulate score change
      game.reset();
      const state = game.getGameState();
      expect(state.score).toBe(0);
    });

    it('should reset level on reset', () => {
      game.start();
      game.reset();
      const state = game.getGameState();
      expect(state.level).toBe(0);
    });

    it('should reset lines on reset', () => {
      game.start();
      game.reset();
      const state = game.getGameState();
      expect(state.lines).toBe(0);
    });
  });

  describe('Event callbacks', () => {
    it('should call onStateChange when state changes', () => {
      let called = false;
      game.onStateChange = () => {
        called = true;
      };
      game.start();
      expect(called).toBe(true);
    });
  });
});
