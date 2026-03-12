/**
 * Metallic Effects Tests
 *
 * Tests for metallic gradient generation, highlights, and shadows.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createMetallicGradient, addHighlight, addShadow } from '../../src/render/metallic-effects';

describe('Metallic Effects', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    ctx = canvas.getContext('2d')!;
  });

  describe('createMetallicGradient', () => {
    it('should create a CanvasGradient', () => {
      const gradient = createMetallicGradient(ctx, 0, 0, 30, '#C0C0C0');
      expect(gradient).toBeInstanceOf(CanvasGradient);
    });

    it('should accept different base colors', () => {
      const colors = ['#C0C0C0', '#FFD700', '#9370DB', '#32CD32'];
      for (const color of colors) {
        const gradient = createMetallicGradient(ctx, 0, 0, 30, color);
        expect(gradient).toBeInstanceOf(CanvasGradient);
      }
    });

    it('should work with different sizes', () => {
      const sizes = [10, 20, 30, 40];
      for (const size of sizes) {
        const gradient = createMetallicGradient(ctx, 0, 0, size, '#C0C0C0');
        expect(gradient).toBeInstanceOf(CanvasGradient);
      }
    });
  });

  describe('addHighlight', () => {
    it('should not throw error', () => {
      expect(() => {
        addHighlight(ctx, 10, 10, 30);
      }).not.toThrow();
    });

    it('should work with different sizes', () => {
      const sizes = [10, 20, 30, 40];
      for (const size of sizes) {
        expect(() => {
          addHighlight(ctx, 10, 10, size);
        }).not.toThrow();
      }
    });
  });

  describe('addShadow', () => {
    it('should not throw error', () => {
      expect(() => {
        addShadow(ctx, 10, 10, 30);
      }).not.toThrow();
    });

    it('should work with different sizes', () => {
      const sizes = [10, 20, 30, 40];
      for (const size of sizes) {
        expect(() => {
          addShadow(ctx, 10, 10, size);
        }).not.toThrow();
      }
    });
  });

  describe('Integration', () => {
    it('should render metallic block with all effects', () => {
      const x = 10;
      const y = 10;
      const size = 28;
      const color = '#C0C0C0';

      // Create gradient
      const gradient = createMetallicGradient(ctx, x, y, size, color);
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, size, size);

      // Add effects
      addHighlight(ctx, x, y, size);
      addShadow(ctx, x, y, size);

      // Border
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, size, size);

      // Should not throw
      expect(true).toBe(true);
    });
  });
});
