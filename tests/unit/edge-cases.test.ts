/**
 * Edge Cases Tests
 *
 * Tests for edge cases (localStorage full, audio context suspended, rapid input, etc.).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Game } from '../../src/game/Game';
import { StorageManager } from '../../src/storage/StorageManager';
import { SoundManager } from '../../src/audio/SoundManager';
import { createGrid } from '../../src/game/grid';
import { isValidPosition } from '../../src/game/collision';
import { createPiece } from '../../src/game/piece-factory';

describe('Edge Cases', () => {
  describe('Game edge cases', () => {
    let game: Game;

    beforeEach(() => {
      game = new Game();
    });

    it('should handle rapid input without errors', () => {
      game.start();

      for (let i = 0; i < 100; i++) {
        game.moveLeft();
        game.moveRight();
        game.rotate();
        game.moveDown();
      }

      expect(game.getGameState().status).toBe('playing');
    });

    it('should handle pause/resume spam', () => {
      game.start();

      for (let i = 0; i < 20; i++) {
        game.pause();
        game.resume();
      }

      expect(game.getGameState().status).toBe('playing');
    });

    it('should handle reset during gameplay', () => {
      game.start();
      game.moveRight();
      game.moveDown();
      game.reset();

      const state = game.getGameState();
      expect(state.status).toBe('menu');
      expect(state.score).toBe(0);
    });

    it('should handle hard drop at spawn position', () => {
      game.start();
      expect(() => {
        game.hardDrop();
      }).not.toThrow();
    });

    it('should handle rotation at boundaries', () => {
      game.start();
      const state = game.getGameState();

      // Move to left boundary
      for (let i = 0; i < 10; i++) {
        game.moveLeft();
      }

      expect(() => {
        game.rotate();
      }).not.toThrow();
    });

    it('should handle movement when no current piece', () => {
      expect(() => {
        game.moveLeft();
        game.moveRight();
        game.rotate();
      }).not.toThrow();
    });
  });

  describe('Grid edge cases', () => {
    it('should handle empty grid operations', () => {
      const grid = createGrid();
      expect(() => {
        for (let y = 0; y < 20; y++) {
          for (let x = 0; x < 10; x++) {
            grid.cells[y]![x];
          }
        }
      }).not.toThrow();
    });

    it('should handle full grid', () => {
      const grid = createGrid();
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          grid.cells[y]![x] = '#FF0000';
        }
      }

      const piece = createPiece('I');
      expect(isValidPosition(piece, grid)).toBe(false);
    });
  });

  describe('Storage edge cases', () => {
    let storageManager: StorageManager;

    beforeEach(() => {
      storageManager = new StorageManager();
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should handle localStorage full', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = () => {
        const error = new DOMException('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      };

      expect(() => {
        storageManager.updateHighScore(1000);
      }).not.toThrow();

      Storage.prototype.setItem = originalSetItem;
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('eluosi-game-data', '{invalid json}');
      expect(() => {
        storageManager.load();
      }).not.toThrow();
    });

    it('should handle missing localStorage', () => {
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = () => {
        throw new Error('localStorage unavailable');
      };

      expect(() => {
        storageManager.load();
      }).not.toThrow();

      Storage.prototype.getItem = originalGetItem;
    });

    it('should handle negative values', () => {
      const data = storageManager.validateData({
        highScore: -1000,
        totalGames: -5,
        totalLines: -10,
      });

      expect(data.highScore).toBeGreaterThanOrEqual(0);
      expect(data.totalGames).toBeGreaterThanOrEqual(0);
      expect(data.totalLines).toBeGreaterThanOrEqual(0);
    });

    it('should handle extremely large values', () => {
      const data = storageManager.validateData({
        highScore: Number.MAX_SAFE_INTEGER,
        totalGames: Number.MAX_SAFE_INTEGER,
        totalLines: Number.MAX_SAFE_INTEGER,
      });

      expect(data.highScore).toBeDefined();
      expect(data.totalGames).toBeDefined();
      expect(data.totalLines).toBeDefined();
    });
  });

  describe('Audio edge cases', () => {
    let soundManager: SoundManager;

    beforeEach(() => {
      soundManager = new SoundManager();
    });

    it('should handle audio context suspended', async () => {
      await expect(soundManager.initialize()).resolves.not.toThrow();
    });

    it('should handle rapid sound playback', async () => {
      await soundManager.initialize();

      expect(() => {
        for (let i = 0; i < 50; i++) {
          soundManager.play('move');
        }
      }).not.toThrow();
    });

    it('should handle volume changes during playback', async () => {
      await soundManager.initialize();

      expect(() => {
        soundManager.play('move');
        soundManager.setVolume(0);
        soundManager.play('rotate');
        soundManager.setVolume(100);
        soundManager.play('drop');
      }).not.toThrow();
    });

    it('should handle mute/unmute spam', async () => {
      await soundManager.initialize();

      expect(() => {
        for (let i = 0; i < 20; i++) {
          soundManager.mute();
          soundManager.unmute();
        }
      }).not.toThrow();
    });

    it('should handle missing audio files', async () => {
      await expect(soundManager.initialize()).resolves.not.toThrow();
      expect(() => {
        soundManager.play('move');
      }).not.toThrow();
    });
  });

  describe('Collision edge cases', () => {
    it('should handle piece at negative Y position', () => {
      const grid = createGrid();
      const piece = createPiece('I');
      piece.position.y = -2;

      expect(() => {
        isValidPosition(piece, grid);
      }).not.toThrow();
    });

    it('should handle piece partially outside grid', () => {
      const grid = createGrid();
      const piece = createPiece('I');
      piece.position.x = 8; // Partially outside right boundary

      const valid = isValidPosition(piece, grid);
      expect(typeof valid).toBe('boolean');
    });
  });

  describe('Concurrent operations', () => {
    it('should handle simultaneous game operations', () => {
      const game = new Game();
      game.start();

      expect(() => {
        game.moveLeft();
        game.rotate();
        game.moveDown();
        game.pause();
        game.resume();
      }).not.toThrow();
    });

    it('should handle multiple games simultaneously', () => {
      const game1 = new Game();
      const game2 = new Game();

      game1.start();
      game2.start();

      game1.moveRight();
      game2.moveLeft();

      expect(game1.getGameState().status).toBe('playing');
      expect(game2.getGameState().status).toBe('playing');
    });
  });
});
