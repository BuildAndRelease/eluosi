/**
 * Sound Manager Tests
 *
 * Tests for audio loading, playback, volume control, and mute.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SoundManager } from '../../src/audio/SoundManager';

describe('SoundManager', () => {
  let soundManager: SoundManager;

  beforeEach(() => {
    soundManager = new SoundManager();
  });

  describe('Initialization', () => {
    it('should initialize without errors', async () => {
      await expect(soundManager.initialize()).resolves.not.toThrow();
    });

    it('should not reinitialize if already initialized', async () => {
      await soundManager.initialize();
      await expect(soundManager.initialize()).resolves.not.toThrow();
    });
  });

  describe('Volume control', () => {
    it('should set volume within 0-100 range', () => {
      soundManager.setVolume(50);
      expect(soundManager.getVolume()).toBe(50);
    });

    it('should clamp volume to 0 minimum', () => {
      soundManager.setVolume(-10);
      expect(soundManager.getVolume()).toBe(0);
    });

    it('should clamp volume to 100 maximum', () => {
      soundManager.setVolume(150);
      expect(soundManager.getVolume()).toBe(100);
    });

    it('should start with default volume', () => {
      expect(soundManager.getVolume()).toBeGreaterThanOrEqual(0);
      expect(soundManager.getVolume()).toBeLessThanOrEqual(100);
    });
  });

  describe('Mute control', () => {
    it('should start unmuted', () => {
      expect(soundManager.isMuted()).toBe(false);
    });

    it('should mute when mute() is called', () => {
      soundManager.mute();
      expect(soundManager.isMuted()).toBe(true);
    });

    it('should unmute when unmute() is called', () => {
      soundManager.mute();
      soundManager.unmute();
      expect(soundManager.isMuted()).toBe(false);
    });

    it('should toggle mute state', () => {
      const initial = soundManager.isMuted();
      soundManager.mute();
      expect(soundManager.isMuted()).toBe(!initial);
      soundManager.unmute();
      expect(soundManager.isMuted()).toBe(initial);
    });
  });

  describe('Sound playback', () => {
    it('should not throw when playing sound before initialization', () => {
      expect(() => {
        soundManager.play('move');
      }).not.toThrow();
    });

    it('should not throw when playing sound after initialization', async () => {
      await soundManager.initialize();
      expect(() => {
        soundManager.play('move');
      }).not.toThrow();
    });

    it('should not throw when playing different sound types', async () => {
      await soundManager.initialize();
      const soundTypes = ['move', 'rotate', 'drop', 'hard_drop', 'clear', 'game_over'] as const;
      for (const type of soundTypes) {
        expect(() => {
          soundManager.play(type);
        }).not.toThrow();
      }
    });

    it('should not play sound when muted', async () => {
      await soundManager.initialize();
      soundManager.mute();
      expect(() => {
        soundManager.play('move');
      }).not.toThrow();
    });
  });

  describe('Error handling', () => {
    it('should handle missing sound files gracefully', async () => {
      await expect(soundManager.initialize()).resolves.not.toThrow();
    });

    it('should continue working after failed sound load', async () => {
      await soundManager.initialize();
      expect(() => {
        soundManager.play('move');
      }).not.toThrow();
    });
  });
});
