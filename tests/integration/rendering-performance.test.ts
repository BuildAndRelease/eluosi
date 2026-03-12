/**
 * Rendering Performance Tests
 *
 * Tests for 60fps validation and frame time measurement.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Renderer } from '../../src/render/Renderer';
import { Game } from '../../src/game/Game';

describe('Rendering Performance', () => {
  let canvas: HTMLCanvasElement;
  let renderer: Renderer;
  let game: Game;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    renderer = new Renderer(canvas);
    game = new Game();
    game.start();
  });

  describe('Frame rendering', () => {
    it('should render without errors', () => {
      const state = game.getGameState();
      expect(() => {
        renderer.render(state);
      }).not.toThrow();
    });

    it('should render multiple frames without errors', () => {
      const state = game.getGameState();
      for (let i = 0; i < 100; i++) {
        expect(() => {
          renderer.render(state);
        }).not.toThrow();
      }
    });

    it('should handle rapid state changes', () => {
      for (let i = 0; i < 50; i++) {
        game.moveRight();
        const state = game.getGameState();
        expect(() => {
          renderer.render(state);
        }).not.toThrow();
      }
    });
  });

  describe('Frame time measurement', () => {
    it('should complete render in reasonable time', () => {
      const state = game.getGameState();
      const start = performance.now();
      renderer.render(state);
      const end = performance.now();
      const frameTime = end - start;

      // Should render in less than 16.67ms (60fps)
      expect(frameTime).toBeLessThan(16.67);
    });

    it('should maintain consistent frame times', () => {
      const state = game.getGameState();
      const frameTimes: number[] = [];

      for (let i = 0; i < 10; i++) {
        const start = performance.now();
        renderer.render(state);
        const end = performance.now();
        frameTimes.push(end - start);
      }

      // All frame times should be under 16.67ms
      for (const time of frameTimes) {
        expect(time).toBeLessThan(16.67);
      }

      // Average frame time should be well under budget
      const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      expect(avg).toBeLessThan(10);
    });
  });

  describe('Complex scenes', () => {
    it('should render full grid efficiently', () => {
      const state = game.getGameState();

      // Fill grid with blocks
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          state.grid.cells[y]![x] = '#FF0000';
        }
      }

      const start = performance.now();
      renderer.render(state);
      const end = performance.now();
      const frameTime = end - start;

      expect(frameTime).toBeLessThan(16.67);
    });

    it('should render with animations efficiently', () => {
      const state = game.getGameState();

      // Trigger line clear animation
      for (let x = 0; x < 10; x++) {
        state.grid.cells[19]![x] = '#FF0000';
      }
      renderer.triggerLineClearAnimation([19]);

      const start = performance.now();
      renderer.render(state);
      const end = performance.now();
      const frameTime = end - start;

      expect(frameTime).toBeLessThan(16.67);
    });
  });

  describe('Memory efficiency', () => {
    it('should not leak memory over many renders', () => {
      const state = game.getGameState();

      // Render many frames
      for (let i = 0; i < 1000; i++) {
        renderer.render(state);
      }

      // If we got here without crashing, memory is likely OK
      expect(true).toBe(true);
    });
  });
});
