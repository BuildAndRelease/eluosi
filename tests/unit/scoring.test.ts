/**
 * Unit Tests: Scoring System
 *
 * Tests for non-linear scoring formula (10/25/40/55 points).
 */

import { describe, it, expect } from 'vitest';
import { calculateScore, calculateScoreFormula, validateScoringTable, SCORING_TABLE } from '../../src/game/scoring';

describe('Scoring System', () => {
  describe('SCORING_TABLE', () => {
    it('should have correct point values for 1-4 lines', () => {
      expect(SCORING_TABLE[1]).toBe(10);
      expect(SCORING_TABLE[2]).toBe(25);
      expect(SCORING_TABLE[3]).toBe(40);
      expect(SCORING_TABLE[4]).toBe(55);
    });

    it('should match the formula: basePoints + comboBonus', () => {
      // Formula: linesCleared * 10 + (linesCleared - 1) * 5
      expect(validateScoringTable()).toBe(true);
    });
  });

  describe('calculateScore', () => {
    it('should return 10 points for 1 line', () => {
      expect(calculateScore(1)).toBe(10);
    });

    it('should return 25 points for 2 lines', () => {
      expect(calculateScore(2)).toBe(25);
    });

    it('should return 40 points for 3 lines', () => {
      expect(calculateScore(3)).toBe(40);
    });

    it('should return 55 points for 4 lines', () => {
      expect(calculateScore(4)).toBe(55);
    });

    it('should throw error for invalid line counts', () => {
      expect(() => calculateScore(0)).toThrow();
      expect(() => calculateScore(5)).toThrow();
      expect(() => calculateScore(-1)).toThrow();
    });
  });

  describe('calculateScoreFormula', () => {
    it('should match table values', () => {
      for (let lines = 1; lines <= 4; lines++) {
        const tableScore = SCORING_TABLE[lines as keyof typeof SCORING_TABLE];
        const formulaScore = calculateScoreFormula(lines);
        expect(formulaScore).toBe(tableScore);
      }
    });

    it('should follow formula: basePoints + comboBonus', () => {
      // 1 line: 10 + 0 = 10
      expect(calculateScoreFormula(1)).toBe(10);

      // 2 lines: 20 + 5 = 25
      expect(calculateScoreFormula(2)).toBe(25);

      // 3 lines: 30 + 10 = 40
      expect(calculateScoreFormula(3)).toBe(40);

      // 4 lines: 40 + 15 = 55
      expect(calculateScoreFormula(4)).toBe(55);
    });
  });

  describe('Scoring Strategy', () => {
    it('should reward multi-line clears more than single lines', () => {
      const single = calculateScore(1);
      const double = calculateScore(2);
      const triple = calculateScore(3);
      const tetris = calculateScore(4);

      // Double should be more than 2x single
      expect(double).toBeGreaterThan(single * 2);

      // Triple should be more than 3x single
      expect(triple).toBeGreaterThan(single * 3);

      // Tetris should be more than 4x single
      expect(tetris).toBeGreaterThan(single * 4);
    });

    it('should have increasing marginal value per line', () => {
      // Points per line should increase with combo size
      const pointsPerLine1 = calculateScore(1) / 1; // 10
      const pointsPerLine2 = calculateScore(2) / 2; // 12.5
      const pointsPerLine3 = calculateScore(3) / 3; // 13.33
      const pointsPerLine4 = calculateScore(4) / 4; // 13.75

      expect(pointsPerLine2).toBeGreaterThan(pointsPerLine1);
      expect(pointsPerLine3).toBeGreaterThan(pointsPerLine2);
      expect(pointsPerLine4).toBeGreaterThan(pointsPerLine3);
    });
  });
});
