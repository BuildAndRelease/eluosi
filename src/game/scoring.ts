/**
 * Scoring System
 *
 * Pure functions for calculating scores based on lines cleared.
 * Implements non-linear scoring formula:
 * - 1 line: 10 points
 * - 2 lines: 25 points (10 + 15 bonus)
 * - 3 lines: 40 points (10 + 15 + 15 bonus)
 * - 4 lines: 55 points (10 + 15 + 15 + 15 bonus)
 *
 * Formula: basePoints + comboBonus
 * - basePoints = linesCleared * 10
 * - comboBonus = (linesCleared - 1) * 5
 */

/**
 * Scoring table for line clears
 */
export const SCORING_TABLE = {
  1: 10,
  2: 25,
  3: 40,
  4: 55,
} as const;

/**
 * Calculate score for cleared lines
 * @param linesCleared - Number of lines cleared simultaneously (1-4)
 * @returns Points awarded
 * @throws Error if linesCleared is out of valid range
 */
export function calculateScore(linesCleared: number): number {
  if (linesCleared < 1 || linesCleared > 4) {
    throw new Error(`Invalid lines cleared: ${linesCleared}. Must be between 1 and 4.`);
  }

  return SCORING_TABLE[linesCleared as keyof typeof SCORING_TABLE];
}

/**
 * Calculate score using formula (for validation/testing)
 * @param linesCleared - Number of lines cleared simultaneously
 * @returns Points awarded
 */
export function calculateScoreFormula(linesCleared: number): number {
  const basePoints = linesCleared * 10;
  const comboBonus = (linesCleared - 1) * 5;
  return basePoints + comboBonus;
}

/**
 * Validate scoring table matches formula
 * @returns true if all entries match formula
 */
export function validateScoringTable(): boolean {
  for (let lines = 1; lines <= 4; lines++) {
    const tableScore = SCORING_TABLE[lines as keyof typeof SCORING_TABLE];
    const formulaScore = calculateScoreFormula(lines);
    if (tableScore !== formulaScore) {
      return false;
    }
  }
  return true;
}
