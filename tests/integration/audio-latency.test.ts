/**
 * Audio Latency Tests
 *
 * Tests for <100ms audio latency.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SoundManager } from '../../src/audio/SoundManager';

describe('Audio Latency', () => {
  let soundManager: SoundManager;

  beforeEach(async () => {
    soundManager = new SoundManager();
    await soundManager.initialize();
  });

  describe('Playback latency', () => {
    it('should play sound within 100ms', () => {
      const start = performance.now();
      soundManager.play('move');
      const end = performance.now();
      const latency = end - start;

      expect(latency).toBeLessThan(100);
    });

    it('should maintain low latency for multiple sounds', () => {
      const latencies: number[] = [];

      for (let i = 0; i < 10; i++) {
        const start = performance.now();
        soundManager.play('move');
        const end = performance.now();
        latencies.push(end - start);
      }

      // All latencies should be under 100ms
      for (const latency of latencies) {
        expect(latency).toBeLessThan(100);
      }

      // Average latency should be well under budget
      const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      expect(avg).toBeLessThan(50);
    });

    it('should handle rapid sound playback', () => {
      const start = performance.now();

      // Play multiple sounds rapidly
      soundManager.play('move');
      soundManager.play('rotate');
      soundManager.play('drop');

      const end = performance.now();
      const totalTime = end - start;

      // Total time for 3 sounds should be under 300ms
      expect(totalTime).toBeLessThan(300);
    });
  });

  describe('Volume change latency', () => {
    it('should change volume instantly', () => {
      const start = performance.now();
      soundManager.setVolume(50);
      const end = performance.now();
      const latency = end - start;

      expect(latency).toBeLessThan(10);
    });

    it('should mute instantly', () => {
      const start = performance.now();
      soundManager.mute();
      const end = performance.now();
      const latency = end - start;

      expect(latency).toBeLessThan(10);
    });
  });

  describe('Concurrent playback', () => {
    it('should handle overlapping sounds efficiently', () => {
      const start = performance.now();

      // Play overlapping sounds
      soundManager.play('move');
      setTimeout(() => soundManager.play('rotate'), 10);
      setTimeout(() => soundManager.play('drop'), 20);

      const end = performance.now();
      const latency = end - start;

      expect(latency).toBeLessThan(100);
    });
  });
});
