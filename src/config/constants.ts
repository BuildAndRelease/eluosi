/**
 * Game Constants
 *
 * Central configuration for all game parameters including grid dimensions,
 * timing values, scoring rules, and animation durations.
 */

// Grid dimensions
export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;
export const CELL_SIZE = 30; // pixels

// Timing constants (milliseconds)
export const LOCK_DELAY = 500; // Time before block locks after touching bottom
export const ANIMATION_DURATIONS = {
  LINE_CLEAR: 250, // Line clear animation duration (configurable)
  BLOCK_LOCK_FLASH: 100, // Block lock flash effect
  LEVEL_UP: 500, // Level up celebration effect
};

// Fall speeds by level (milliseconds per cell)
export const FALL_SPEEDS = [
  1000, // Level 0
  900,  // Level 1
  800,  // Level 2
  700,  // Level 3
  600,  // Level 4
  500,  // Level 5
  400,  // Level 6
  300,  // Level 7
  200,  // Level 8
  100,  // Level 9+
];

// Scoring values (new colorful progression system)
// Non-linear scoring: 1 line: 10pts, 2 lines: 25pts, 3 lines: 40pts, 4 lines: 55pts
export const SCORING_TABLE = {
  1: 10,
  2: 25,
  3: 40,
  4: 55,
} as const;

// Level progression (new system)
// Level-up threshold: (target_level) * 100 * 2
// Example: Level 1 = 200pts, Level 2 = 400pts, Level 3 = 600pts
export const LEVEL_THRESHOLDS = {
  1: 200,
  2: 400,
  3: 600,
  4: 800,
  5: 1000,
  6: 1200,
  7: 1400,
  8: 1600,
  9: 1800,
  10: 2000,
} as const;

// Speed multipliers by level (new system)
// Level 0: 1x, Level 1: 2x, Level 2: 3x, Level 3+: 4x (capped)
export const SPEED_MULTIPLIERS = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  // Level 4+ stays at 4x (max speed)
} as const;

// Down key speed multiplier (multiplicative with level speed)
// Example: Level 2 (3x) + Down key (4x) = 12x base speed
export const DOWN_KEY_MULTIPLIER = 4;

// Obstacle row configuration
export const OBSTACLE_ROW_START_LEVEL = 4; // Obstacle rows start at level 4
export const MAX_LEVEL = 15;

// Soft drop speed multiplier
export const SOFT_DROP_MULTIPLIER = 10;

// Performance targets
export const TARGET_FPS = 60;
export const MAX_INPUT_LATENCY_MS = 50;
export const MAX_AUDIO_LATENCY_MS = 100;

// Metallic colors for each block type
export const BLOCK_COLORS = {
  I: '#C0C0C0', // Silver
  O: '#FFD700', // Gold
  T: '#9370DB', // Purple
  S: '#32CD32', // Green
  Z: '#DC143C', // Red
  J: '#4169E1', // Blue
  L: '#FF8C00', // Orange
} as const;

// Audio settings
export const DEFAULT_VOLUME = 50; // 0-100
export const AUDIO_FILE_PATHS = {
  MOVE: '/assets/sounds/move.mp3',
  ROTATE: '/assets/sounds/rotate.mp3',
  DROP: '/assets/sounds/drop.mp3',
  HARD_DROP: '/assets/sounds/hard_drop.mp3',
  CLEAR: '/assets/sounds/clear.mp3',
  GAME_OVER: '/assets/sounds/game_over.mp3',
} as const;

// localStorage keys
export const STORAGE_KEYS = {
  HIGH_SCORE: 'eluosi-high-score',
  GAME_DATA: 'eluosi-game-data',
  SETTINGS: 'eluosi-settings',
} as const;
