/**
 * Unit Tests: Color Palette
 *
 * Tests for colorful block palette and glassmorphism configuration.
 */

import { describe, it, expect } from 'vitest';
import {
  COLORFUL_PALETTE,
  getColorForPiece,
  GLASSMORPHISM_STYLE,
  COLOR_PALETTE_ARRAY,
} from '../../src/config/colors';

describe('Color Palette', () => {
  describe('COLORFUL_PALETTE', () => {
    it('should have 7 distinct colors for all piece types', () => {
      expect(Object.keys(COLORFUL_PALETTE)).toHaveLength(7);
      expect(COLORFUL_PALETTE).toHaveProperty('I');
      expect(COLORFUL_PALETTE).toHaveProperty('O');
      expect(COLORFUL_PALETTE).toHaveProperty('T');
      expect(COLORFUL_PALETTE).toHaveProperty('S');
      expect(COLORFUL_PALETTE).toHaveProperty('Z');
      expect(COLORFUL_PALETTE).toHaveProperty('J');
      expect(COLORFUL_PALETTE).toHaveProperty('L');
    });

    it('should use hex color format', () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;
      Object.values(COLORFUL_PALETTE).forEach((color) => {
        expect(color).toMatch(hexColorRegex);
      });
    });

    it('should not use black, white, or gray tones', () => {
      const grayTones = ['#000000', '#FFFFFF', '#808080', '#C0C0C0', '#696969'];
      Object.values(COLORFUL_PALETTE).forEach((color) => {
        expect(grayTones).not.toContain(color.toUpperCase());
      });
    });

    it('should have all unique colors', () => {
      const colors = Object.values(COLORFUL_PALETTE);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    });
  });

  describe('getColorForPiece', () => {
    it('should return correct color for each piece type', () => {
      expect(getColorForPiece('I')).toBe('#00D9FF');
      expect(getColorForPiece('O')).toBe('#FFD700');
      expect(getColorForPiece('T')).toBe('#B24BF3');
      expect(getColorForPiece('S')).toBe('#00FF7F');
      expect(getColorForPiece('Z')).toBe('#FF4757');
      expect(getColorForPiece('J')).toBe('#3742FA');
      expect(getColorForPiece('L')).toBe('#FF6348');
    });
  });

  describe('COLOR_PALETTE_ARRAY', () => {
    it('should contain all 7 colors', () => {
      expect(COLOR_PALETTE_ARRAY).toHaveLength(7);
    });

    it('should match COLORFUL_PALETTE values', () => {
      const paletteValues = Object.values(COLORFUL_PALETTE);
      expect(COLOR_PALETTE_ARRAY).toEqual(paletteValues);
    });
  });
});

describe('Glassmorphism Style', () => {
  it('should have semi-transparent background', () => {
    expect(GLASSMORPHISM_STYLE.background).toContain('rgba');
    expect(GLASSMORPHISM_STYLE.background).toContain('0.1');
  });

  it('should have backdrop-filter with blur', () => {
    expect(GLASSMORPHISM_STYLE.backdropFilter).toContain('blur');
    expect(GLASSMORPHISM_STYLE.backdropFilter).toContain('10px');
  });

  it('should have WebKit prefix for Safari support', () => {
    expect(GLASSMORPHISM_STYLE.WebkitBackdropFilter).toContain('blur');
  });

  it('should have gradient background', () => {
    expect(GLASSMORPHISM_STYLE.bodyGradient).toContain('linear-gradient');
    expect(GLASSMORPHISM_STYLE.bodyGradient).toContain('#E0C3FC');
    expect(GLASSMORPHISM_STYLE.bodyGradient).toContain('#8EC5FC');
  });

  it('should have fallback background for unsupported browsers', () => {
    expect(GLASSMORPHISM_STYLE.fallbackBackground).toContain('rgba');
  });
});
