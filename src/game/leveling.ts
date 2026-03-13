/**
 * Leveling System
 *
 * Pure functions for level progression and speed management.
 * - Level 0: Base speed (1x)
 * - Level 1: 2x speed
 * - Level 2: 3x speed
 * - Level 3+: 4x speed (capped)
 * - Level 4+: Obstacle rows added each level
 *
 * Level-up threshold: (target_level) * 100 * 2
 * Example: Level 1 requires 200 points, Level 2 requires 400 points
 */

/**
 * Calculate score threshold required to reach a specific level
 * @param targetLevel - The level to reach (1, 2, 3, ...)
 * @returns Score required to reach that level
 */
export function getLevelThreshold(targetLevel: number): number {
  if (targetLevel < 1) {
    throw new Error(`Invalid target level: ${targetLevel}. Must be >= 1.`);
  }
  return targetLevel * 100 * 2;
}

/**
 * Determine if player should level up based on current score
 * @param currentScore - Player's current score
 * @param currentLevel - Player's current level
 * @returns true if player has reached next level threshold
 */
export function shouldLevelUp(currentScore: number, currentLevel: number): boolean {
  const nextLevelThreshold = getLevelThreshold(currentLevel + 1);
  return currentScore >= nextLevelThreshold;
}

/**
 * Calculate current level based on score
 * @param score - Player's current score
 * @returns Current level (0, 1, 2, ...)
 */
export function calculateLevel(score: number): number {
  let level = 0;
  while (shouldLevelUp(score, level)) {
    level++;
  }
  return level;
}

/**
 * Get speed multiplier for a given level
 * Speed increases by 1x per level, capped at 4x
 * @param level - Current level (0, 1, 2, ...)
 * @returns Speed multiplier (1x, 2x, 3x, 4x)
 */
export function getSpeedMultiplier(level: number): number {
  if (level < 0) {
    throw new Error(`Invalid level: ${level}. Must be >= 0.`);
  }
  // Level 0: 1x, Level 1: 2x, Level 2: 3x, Level 3+: 4x (capped)
  return Math.min(level + 1, 4);
}

/**
 * Determine if obstacle row should be added at this level
 * Obstacle rows start at level 4 (when speed is already maxed at 4x)
 * @param level - Current level
 * @returns true if obstacle row should be added
 */
export function shouldAddObstacleRow(level: number): boolean {
  return level >= 4;
}

/**
 * Calculate how many obstacle rows should exist at a given level
 * One obstacle row per level starting from level 4
 * @param level - Current level
 * @returns Number of obstacle rows (0 for levels 0-3, level-3 for level 4+)
 */
export function getObstacleRowCount(level: number): number {
  if (level < 4) {
    return 0;
  }
  return level - 3;
}

/**
 * Level progression configuration
 */
export const LEVEL_CONFIG = {
  /** Maximum speed multiplier (4x base speed) */
  MAX_SPEED_MULTIPLIER: 4,

  /** Level at which obstacle rows start appearing */
  OBSTACLE_ROW_START_LEVEL: 4,

  /** Score multiplier for level threshold calculation */
  THRESHOLD_MULTIPLIER: 200, // target_level * 100 * 2
} as const;
