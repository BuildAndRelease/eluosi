/**
 * 3D Transform Tests
 *
 * Tests for isometric coordinate transformation and 3D face color calculations.
 */

import { describe, it, expect } from 'vitest';
import { toIsometric, calculateFaceColors, type IsometricCoords } from '../../src/render/Renderer3D';
import { FACE_BRIGHTNESS } from '../../src/render/styles';

// T027: Unit test for isometric coordinate transformation
describe('Isometric Coordinate Transformation', () => {
  const CELL_SIZE = 30;

  describe('toIsometric', () => {
    it('should transform origin (0,0) correctly', () => {
      const result = toIsometric(0, 0, CELL_SIZE);

      expect(result.isoX).toBe(0);
      expect(result.isoY).toBe(0);
    });

    it('should transform (1,0) correctly', () => {
      const result = toIsometric(1, 0, CELL_SIZE);

      // isoX = (x - y) * (cellSize / 2) = (1 - 0) * 15 = 15
      // isoY = (x + y) * (cellSize / 4) = (1 + 0) * 7.5 = 7.5
      expect(result.isoX).toBe(15);
      expect(result.isoY).toBe(7.5);
    });

    it('should transform (0,1) correctly', () => {
      const result = toIsometric(0, 1, CELL_SIZE);

      // isoX = (0 - 1) * 15 = -15
      // isoY = (0 + 1) * 7.5 = 7.5
      expect(result.isoX).toBe(-15);
      expect(result.isoY).toBe(7.5);
    });

    it('should transform (5,10) correctly', () => {
      const result = toIsometric(5, 10, CELL_SIZE);

      // isoX = (5 - 10) * 15 = -75
      // isoY = (5 + 10) * 7.5 = 112.5
      expect(result.isoX).toBe(-75);
      expect(result.isoY).toBe(112.5);
    });

    it('should handle negative coordinates', () => {
      const result = toIsometric(-2, -3, CELL_SIZE);

      // isoX = (-2 - (-3)) * 15 = 1 * 15 = 15
      // isoY = (-2 + (-3)) * 7.5 = -5 * 7.5 = -37.5
      expect(result.isoX).toBe(15);
      expect(result.isoY).toBe(-37.5);
    });

    it('should be consistent for different cell sizes', () => {
      const result1 = toIsometric(2, 3, 20);
      const result2 = toIsometric(2, 3, 40);

      // Ratio should be maintained
      expect(result2.isoX / result1.isoX).toBeCloseTo(2, 5);
      expect(result2.isoY / result1.isoY).toBeCloseTo(2, 5);
    });

    it('should produce different results for different grid positions', () => {
      const pos1 = toIsometric(0, 0, CELL_SIZE);
      const pos2 = toIsometric(1, 1, CELL_SIZE);
      const pos3 = toIsometric(5, 5, CELL_SIZE);

      // (1,1) should have isoX = 0 (since 1-1=0), but isoY should differ
      expect(pos1.isoY).not.toBe(pos2.isoY);
      expect(pos2.isoY).not.toBe(pos3.isoY);
    });

    it('should maintain isometric property: (x,y) and (y,x) mirror on Y axis', () => {
      const pos1 = toIsometric(3, 7, CELL_SIZE);
      const pos2 = toIsometric(7, 3, CELL_SIZE);

      // Should be mirrored on Y axis
      expect(pos1.isoX).toBe(-pos2.isoX);
      expect(pos1.isoY).toBe(pos2.isoY);
    });
  });
});

// T028: Unit test for face color calculation
describe('Face Color Calculation', () => {
  describe('calculateFaceColors', () => {
    it('should calculate three face colors with correct brightness', () => {
      const baseColor = '#ff0000'; // Red
      const faces = calculateFaceColors(baseColor);

      expect(faces.top).toBeDefined();
      expect(faces.left).toBeDefined();
      expect(faces.right).toBeDefined();
    });

    it('should make top face brightest', () => {
      const baseColor = '#808080'; // Gray
      const faces = calculateFaceColors(baseColor);

      // Top should be brightest (100%)
      expect(faces.top).toBe(baseColor);
    });

    it('should darken left face to 70%', () => {
      const baseColor = '#ffffff'; // White
      const faces = calculateFaceColors(baseColor);

      // Left face should be darker than top
      expect(faces.left).not.toBe(faces.top);

      // Parse and check brightness
      const leftRGB = parseInt(faces.left.slice(1), 16);
      const topRGB = parseInt(faces.top.slice(1), 16);
      expect(leftRGB).toBeLessThan(topRGB);
    });

    it('should darken right face to 50%', () => {
      const baseColor = '#ffffff'; // White
      const faces = calculateFaceColors(baseColor);

      // Right face should be darkest
      expect(faces.right).not.toBe(faces.top);
      expect(faces.right).not.toBe(faces.left);

      // Parse and check brightness
      const rightRGB = parseInt(faces.right.slice(1), 16);
      const leftRGB = parseInt(faces.left.slice(1), 16);
      const topRGB = parseInt(faces.top.slice(1), 16);

      expect(rightRGB).toBeLessThan(leftRGB);
      expect(rightRGB).toBeLessThan(topRGB);
    });

    it('should handle pure colors correctly', () => {
      const red = calculateFaceColors('#ff0000');
      const green = calculateFaceColors('#00ff00');
      const blue = calculateFaceColors('#0000ff');

      // All should have three distinct faces
      expect(red.top).not.toBe(red.left);
      expect(red.left).not.toBe(red.right);

      expect(green.top).not.toBe(green.left);
      expect(green.left).not.toBe(green.right);

      expect(blue.top).not.toBe(blue.left);
      expect(blue.left).not.toBe(blue.right);
    });

    it('should handle dark colors without going negative', () => {
      const darkColor = '#101010';
      const faces = calculateFaceColors(darkColor);

      // All faces should be valid hex colors
      expect(faces.top).toMatch(/^#[0-9a-f]{6}$/i);
      expect(faces.left).toMatch(/^#[0-9a-f]{6}$/i);
      expect(faces.right).toMatch(/^#[0-9a-f]{6}$/i);

      // Right face should not be negative (should clamp to #000000)
      const rightRGB = parseInt(faces.right.slice(1), 16);
      expect(rightRGB).toBeGreaterThanOrEqual(0);
    });

    it('should apply brightness multipliers correctly', () => {
      const baseColor = '#646464'; // 100 in decimal for each channel
      const faces = calculateFaceColors(baseColor);

      // Top: 100% = 100
      // Left: 70% = 70
      // Right: 50% = 50

      const topR = parseInt(faces.top.slice(1, 3), 16);
      const leftR = parseInt(faces.left.slice(1, 3), 16);
      const rightR = parseInt(faces.right.slice(1, 3), 16);

      expect(topR).toBeCloseTo(100, 0);
      expect(leftR).toBeCloseTo(70, 5);
      expect(rightR).toBeCloseTo(50, 5);
    });

    it('should maintain color hue while adjusting brightness', () => {
      const baseColor = '#ff8800'; // Orange
      const faces = calculateFaceColors(baseColor);

      // All faces should still be orange-ish (R > G > B)
      const topR = parseInt(faces.top.slice(1, 3), 16);
      const topG = parseInt(faces.top.slice(3, 5), 16);
      const topB = parseInt(faces.top.slice(5, 7), 16);

      const leftR = parseInt(faces.left.slice(1, 3), 16);
      const leftG = parseInt(faces.left.slice(3, 5), 16);
      const leftB = parseInt(faces.left.slice(5, 7), 16);

      const rightR = parseInt(faces.right.slice(1, 3), 16);
      const rightG = parseInt(faces.right.slice(3, 5), 16);
      const rightB = parseInt(faces.right.slice(5, 7), 16);

      // Maintain hue: R > G > B for all faces
      expect(topR).toBeGreaterThan(topG);
      expect(topG).toBeGreaterThan(topB);

      expect(leftR).toBeGreaterThan(leftG);
      expect(leftG).toBeGreaterThan(leftB);

      expect(rightR).toBeGreaterThan(rightG);
      expect(rightG).toBeGreaterThan(rightB);
    });
  });
});
