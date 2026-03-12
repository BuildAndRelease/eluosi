/**
 * Type Definitions
 *
 * Core TypeScript interfaces and types for the Tetris game.
 * Defines the structure of game entities, state, and data models.
 */

// Piece types (7 standard Tetromino shapes)
export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

// Game status states
export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameover';

// Sound effect types
export type SoundType = 'move' | 'rotate' | 'drop' | 'hard_drop' | 'clear' | 'game_over';

/**
 * Position on the game grid
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Tetromino piece
 */
export interface Piece {
  type: PieceType;
  rotation: number; // 0-3 (0°, 90°, 180°, 270°)
  position: Position;
  shape: number[][]; // 4×4 matrix (1 = filled, 0 = empty)
  color: string; // Hex color code
}

/**
 * Game grid (10×20 matrix)
 */
export interface Grid {
  cells: (string | null)[][]; // null = empty, string = hex color of locked block
  width: number;
  height: number;
}

/**
 * User settings
 */
export interface Settings {
  volume: number; // 0-100
  showGrid: boolean;
}

/**
 * Persistent data stored in localStorage
 */
export interface PersistentData {
  highScore: number;
  totalGames: number;
  totalLines: number;
  lastPlayTime: number; // timestamp
  settings: Settings;
}

/**
 * Complete game state
 */
export interface GameState {
  status: GameStatus;
  score: number;
  level: number;
  lines: number;
  grid: Grid;
  currentPiece: Piece | null;
  nextPiece: Piece;
  startTime: number; // timestamp
  lockDelayTimer: number | null; // milliseconds remaining before lock
}

/**
 * Audio asset
 */
export interface AudioAsset {
  type: SoundType;
  buffer: AudioBuffer;
  duration: number; // milliseconds
  format: string; // 'mp3' | 'webm'
}

/**
 * Game API interface (public methods)
 */
export interface GameAPI {
  // Control methods
  start(): void;
  pause(): void;
  resume(): void;
  reset(): void;

  // Movement methods
  moveLeft(): void;
  moveRight(): void;
  moveDown(): void;
  hardDrop(): void;
  rotate(): void;

  // Query methods
  getGameState(): Readonly<GameState>;
  getHighScore(): number;

  // Event callbacks (optional)
  onScoreChange?: (score: number) => void;
  onLevelChange?: (level: number) => void;
  onLinesClear?: (count: number) => void;
  onGameOver?: (finalScore: number) => void;
  onStateChange?: (newState: GameStatus) => void;
}
