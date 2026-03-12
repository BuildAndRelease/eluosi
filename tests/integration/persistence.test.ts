/**
 * Persistence Integration Tests
 *
 * Tests for high score persistence, settings persistence, and graceful degradation on localStorage errors.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StorageManager } from '../../src/storage/StorageManager';

describe('Persistence', () => {
  let storageManager: StorageManager;

  beforeEach(() => {
    storageManager = new StorageManager();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('High score persistence', () => {
    it('should persist high score across sessions', () => {
      // Session 1: Set high score
      const manager1 = new StorageManager();
      manager1.updateHighScore(1500);

      // Session 2: Load high score
      const manager2 = new StorageManager();
      const data = manager2.load();
      expect(data.highScore).toBe(1500);
    });

    it('should maintain high score after multiple games', () => {
      storageManager.updateHighScore(1000);
      storageManager.incrementGames();
      storageManager.updateHighScore(800); // Lower score
      storageManager.incrementGames();

      const data = storageManager.load();
      expect(data.highScore).toBe(1000);
      expect(data.totalGames).toBe(2);
    });
  });

  describe('Settings persistence', () => {
    it('should persist volume setting', () => {
      storageManager.saveSettings({ volume: 75, showGrid: true });

      const manager2 = new StorageManager();
      const data = manager2.load();
      expect(data.settings.volume).toBe(75);
    });

    it('should persist showGrid setting', () => {
      storageManager.saveSettings({ volume: 50, showGrid: false });

      const manager2 = new StorageManager();
      const data = manager2.load();
      expect(data.settings.showGrid).toBe(false);
    });

    it('should persist settings across multiple updates', () => {
      storageManager.saveSettings({ volume: 50, showGrid: true });
      storageManager.saveSettings({ volume: 75, showGrid: false });

      const data = storageManager.load();
      expect(data.settings.volume).toBe(75);
      expect(data.settings.showGrid).toBe(false);
    });
  });

  describe('Statistics persistence', () => {
    it('should persist total games count', () => {
      storageManager.incrementGames();
      storageManager.incrementGames();
      storageManager.incrementGames();

      const manager2 = new StorageManager();
      const data = manager2.load();
      expect(data.totalGames).toBe(3);
    });

    it('should persist total lines cleared', () => {
      storageManager.addLines(10);
      storageManager.addLines(15);

      const manager2 = new StorageManager();
      const data = manager2.load();
      expect(data.totalLines).toBe(25);
    });

    it('should persist last play time', () => {
      const before = Date.now();
      storageManager.incrementGames();

      const manager2 = new StorageManager();
      const data = manager2.load();
      expect(data.lastPlayTime).toBeGreaterThanOrEqual(before);
    });
  });

  describe('Graceful degradation', () => {
    it('should continue working when localStorage is unavailable', () => {
      // Simulate localStorage failure
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = () => {
        throw new Error('localStorage unavailable');
      };

      expect(() => {
        storageManager.save({
          highScore: 1000,
          totalGames: 1,
          totalLines: 10,
          lastPlayTime: Date.now(),
          settings: { volume: 50, showGrid: true },
        });
      }).not.toThrow();

      // Restore
      Storage.prototype.setItem = originalSetItem;
    });

    it('should return defaults when localStorage read fails', () => {
      // Corrupt localStorage
      localStorage.setItem('eluosi-game-data', 'invalid json');

      const data = storageManager.load();
      expect(data.highScore).toBe(0);
      expect(data.totalGames).toBe(0);
    });

    it('should handle quota exceeded gracefully', () => {
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
  });

  describe('Data integrity', () => {
    it('should maintain data consistency across operations', () => {
      storageManager.updateHighScore(1000);
      storageManager.incrementGames();
      storageManager.addLines(20);
      storageManager.saveSettings({ volume: 75, showGrid: false });

      const data = storageManager.load();
      expect(data.highScore).toBe(1000);
      expect(data.totalGames).toBe(1);
      expect(data.totalLines).toBe(20);
      expect(data.settings.volume).toBe(75);
      expect(data.settings.showGrid).toBe(false);
    });

    it('should not lose data on failed save', () => {
      storageManager.updateHighScore(1000);

      // Simulate save failure
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = () => {
        throw new Error('Save failed');
      };

      storageManager.updateHighScore(500);

      // Restore
      Storage.prototype.setItem = originalSetItem;

      // Original data should still be in localStorage
      const data = storageManager.load();
      expect(data.highScore).toBe(1000);
    });
  });
});
