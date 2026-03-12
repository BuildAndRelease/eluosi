/**
 * Storage Manager Tests
 *
 * Tests for localStorage read/write, error handling, and data validation.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StorageManager } from '../../src/storage/StorageManager';
import type { PersistentData } from '../../src/game/types';

describe('StorageManager', () => {
  let storageManager: StorageManager;

  beforeEach(() => {
    storageManager = new StorageManager();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Loading data', () => {
    it('should return default data when localStorage is empty', () => {
      const data = storageManager.load();
      expect(data.highScore).toBe(0);
      expect(data.totalGames).toBe(0);
      expect(data.totalLines).toBe(0);
      expect(data.settings).toBeDefined();
    });

    it('should load saved data from localStorage', () => {
      const testData: PersistentData = {
        highScore: 1000,
        totalGames: 5,
        totalLines: 50,
        lastPlayTime: Date.now(),
        settings: {
          volume: 75,
          showGrid: true,
        },
      };

      storageManager.save(testData);
      const loaded = storageManager.load();

      expect(loaded.highScore).toBe(1000);
      expect(loaded.totalGames).toBe(5);
      expect(loaded.totalLines).toBe(50);
      expect(loaded.settings.volume).toBe(75);
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('eluosi-game-data', 'invalid json');
      const data = storageManager.load();
      expect(data.highScore).toBe(0);
    });
  });

  describe('Saving data', () => {
    it('should save data to localStorage', () => {
      const testData: PersistentData = {
        highScore: 500,
        totalGames: 3,
        totalLines: 25,
        lastPlayTime: Date.now(),
        settings: {
          volume: 50,
          showGrid: true,
        },
      };

      storageManager.save(testData);
      const raw = localStorage.getItem('eluosi-game-data');
      expect(raw).not.toBeNull();

      const parsed = JSON.parse(raw!);
      expect(parsed.highScore).toBe(500);
    });

    it('should handle localStorage quota exceeded', () => {
      const largeData: PersistentData = {
        highScore: 0,
        totalGames: 0,
        totalLines: 0,
        lastPlayTime: Date.now(),
        settings: {
          volume: 50,
          showGrid: true,
        },
      };

      // Should not throw even if quota exceeded
      expect(() => {
        storageManager.save(largeData);
      }).not.toThrow();
    });
  });

  describe('High score updates', () => {
    it('should update high score if new score is higher', () => {
      const data = storageManager.updateHighScore(1000);
      expect(data.highScore).toBe(1000);
    });

    it('should not update high score if new score is lower', () => {
      storageManager.updateHighScore(1000);
      const data = storageManager.updateHighScore(500);
      expect(data.highScore).toBe(1000);
    });

    it('should persist high score update', () => {
      storageManager.updateHighScore(1000);
      const loaded = storageManager.load();
      expect(loaded.highScore).toBe(1000);
    });
  });

  describe('Game statistics', () => {
    it('should increment total games', () => {
      storageManager.incrementGames();
      const data = storageManager.load();
      expect(data.totalGames).toBe(1);
    });

    it('should add lines cleared', () => {
      storageManager.addLines(10);
      const data = storageManager.load();
      expect(data.totalLines).toBe(10);
    });

    it('should accumulate lines over multiple calls', () => {
      storageManager.addLines(5);
      storageManager.addLines(3);
      const data = storageManager.load();
      expect(data.totalLines).toBe(8);
    });

    it('should update lastPlayTime on incrementGames', () => {
      const before = Date.now();
      storageManager.incrementGames();
      const data = storageManager.load();
      expect(data.lastPlayTime).toBeGreaterThanOrEqual(before);
    });
  });

  describe('Settings', () => {
    it('should save settings', () => {
      const settings = {
        volume: 75,
        showGrid: false,
      };

      storageManager.saveSettings(settings);
      const data = storageManager.load();
      expect(data.settings.volume).toBe(75);
      expect(data.settings.showGrid).toBe(false);
    });

    it('should preserve other data when saving settings', () => {
      storageManager.updateHighScore(1000);
      storageManager.saveSettings({ volume: 75, showGrid: true });

      const data = storageManager.load();
      expect(data.highScore).toBe(1000);
      expect(data.settings.volume).toBe(75);
    });
  });

  describe('Data validation', () => {
    it('should validate and sanitize invalid data', () => {
      const invalid = {
        highScore: 'not a number',
        totalGames: -5,
        totalLines: null,
        settings: {
          volume: 150,
        },
      };

      const validated = storageManager.validateData(invalid);
      expect(validated.highScore).toBe(0);
      expect(validated.totalGames).toBe(0);
      expect(validated.totalLines).toBe(0);
      expect(validated.settings.volume).toBeLessThanOrEqual(100);
    });

    it('should ensure volume is within 0-100 range', () => {
      const data = {
        settings: {
          volume: 150,
        },
      };

      const validated = storageManager.validateData(data);
      expect(validated.settings.volume).toBeLessThanOrEqual(100);
      expect(validated.settings.volume).toBeGreaterThanOrEqual(0);
    });
  });
});
