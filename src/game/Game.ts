/**
 * Game Controller
 *
 * Main game logic implementing the GameAPI interface.
 * Manages game state, piece movement, line clearing, and game flow.
 * Supports 2x speed multiplier for down arrow key.
 */

import type { GameAPI, GameState, GameStatus, Piece } from './types';
import { createGrid, getCompleteRows, shiftRowsDown, lockPiece } from './grid';
import { createRandomPiece } from './piece-factory';
import { isValidPosition, isTouchingBottom } from './collision';
import { rotatePiece } from './rotation';
import { FALL_SPEEDS, LOCK_DELAY } from '../config/constants';

export class Game implements GameAPI {
  private state: GameState;
  private animationFrameId: number | null = null;
  private lastFallTime: number = 0;
  private lockDelayStartTime: number | null = null;
  private highScore: number = 0;
  private speedMultiplier: number = 1.0;

  // Event callbacks
  public onScoreChange?: (score: number) => void;
  public onLevelChange?: (level: number) => void;
  public onLinesClear?: (count: number, rows: number[], gridColors: (string | null)[][]) => void;
  public onGameOver?: (finalScore: number) => void;
  public onStateChange?: (newState: GameStatus) => void;

  constructor() {
    this.state = this.createInitialState();
  }

  public setHighScore(score: number): void {
    this.highScore = score;
  }

  public getHighScore(): number {
    return this.highScore;
  }

  /**
   * Set speed multiplier from InputHandler
   * Called by game loop to apply 2x speed when down arrow is held
   */
  public setSpeedMultiplier(multiplier: number): void {
    this.speedMultiplier = multiplier;
  }

  private createInitialState(): GameState {
    return {
      status: 'menu',
      score: 0,
      level: 0,
      lines: 0,
      grid: createGrid(),
      currentPiece: null,
      nextPiece: createRandomPiece(),
      startTime: 0,
      lockDelayTimer: null,
    };
  }

  public start(): void {
    if (this.state.status !== 'menu' && this.state.status !== 'gameover') {
      return;
    }

    this.state = {
      ...this.createInitialState(),
      status: 'playing',
      currentPiece: createRandomPiece(),
      startTime: Date.now(),
    };

    this.onStateChange?.('playing');
    this.startGameLoop();
  }

  public pause(): void {
    if (this.state.status !== 'playing') {
      return;
    }

    this.state = { ...this.state, status: 'paused' };
    this.onStateChange?.('paused');
    this.stopGameLoop();
  }

  public resume(): void {
    if (this.state.status !== 'paused') {
      return;
    }

    this.state = { ...this.state, status: 'playing' };
    this.onStateChange?.('playing');
    this.startGameLoop();
  }

  public reset(): void {
    this.stopGameLoop();
    this.state = this.createInitialState();
    this.onStateChange?.('menu');
  }

  public moveLeft(): void {
    if (this.state.status !== 'playing' || !this.state.currentPiece) {
      return;
    }

    const newPiece: Piece = {
      ...this.state.currentPiece,
      position: { ...this.state.currentPiece.position, x: this.state.currentPiece.position.x - 1 },
    };

    if (isValidPosition(newPiece, this.state.grid)) {
      this.state = { ...this.state, currentPiece: newPiece };
      this.resetLockDelayIfTouching();
    }
  }

  public moveRight(): void {
    if (this.state.status !== 'playing' || !this.state.currentPiece) {
      return;
    }

    const newPiece: Piece = {
      ...this.state.currentPiece,
      position: { ...this.state.currentPiece.position, x: this.state.currentPiece.position.x + 1 },
    };

    if (isValidPosition(newPiece, this.state.grid)) {
      this.state = { ...this.state, currentPiece: newPiece };
      this.resetLockDelayIfTouching();
    }
  }

  public moveDown(): void {
    if (this.state.status !== 'playing' || !this.state.currentPiece) {
      return;
    }

    const newPiece: Piece = {
      ...this.state.currentPiece,
      position: { ...this.state.currentPiece.position, y: this.state.currentPiece.position.y + 1 },
    };

    if (isValidPosition(newPiece, this.state.grid)) {
      this.state = { ...this.state, currentPiece: newPiece };
    } else {
      // Start lock delay if not already started
      if (this.lockDelayStartTime === null) {
        this.lockDelayStartTime = Date.now();
      }
    }
  }

  public hardDrop(): void {
    if (this.state.status !== 'playing' || !this.state.currentPiece) {
      return;
    }

    // Find lowest valid position
    let piece = this.state.currentPiece;
    while (true) {
      const testPiece: Piece = {
        ...piece,
        position: { ...piece.position, y: piece.position.y + 1 },
      };

      if (!isValidPosition(testPiece, this.state.grid)) {
        break;
      }

      piece = testPiece;
    }

    this.state = { ...this.state, currentPiece: piece };
    this.lockCurrentPiece();
  }

  public rotate(): void {
    if (this.state.status !== 'playing' || !this.state.currentPiece) {
      return;
    }

    const rotatedPiece = rotatePiece(this.state.currentPiece, this.state.grid);
    this.state = { ...this.state, currentPiece: rotatedPiece };
    this.resetLockDelayIfTouching();
  }

  public getGameState(): Readonly<GameState> {
    return this.state;
  }

  private startGameLoop(): void {
    this.lastFallTime = Date.now();
    this.gameLoop();
  }

  private stopGameLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private gameLoop = (): void => {
    if (this.state.status !== 'playing') {
      return;
    }

    const now = Date.now();
    const fallSpeed = FALL_SPEEDS[Math.min(this.state.level, FALL_SPEEDS.length - 1)]!;

    // Apply speed multiplier (2x when down arrow is held, 1x otherwise)
    const adjustedFallSpeed = fallSpeed / this.speedMultiplier;

    // Auto-fall with speed multiplier
    if (now - this.lastFallTime >= adjustedFallSpeed) {
      this.moveDown();
      this.lastFallTime = now;
    }

    // Check lock delay
    if (this.lockDelayStartTime !== null && now - this.lockDelayStartTime >= LOCK_DELAY) {
      this.lockCurrentPiece();
    }

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  private lockCurrentPiece(): void {
    if (!this.state.currentPiece) {
      return;
    }

    // Lock piece into grid
    let newGrid = lockPiece(this.state.grid, this.state.currentPiece);

    // Check for complete rows
    const completeRows = getCompleteRows(newGrid);

    if (completeRows.length > 0) {
      // Store grid colors before clearing for particle effects
      const gridColors = newGrid.cells;

      // Clear rows and shift down
      newGrid = shiftRowsDown(newGrid, completeRows);

      // Update score and lines
      const newLines = this.state.lines + completeRows.length;
      const newScore = this.state.score + this.calculateScore(completeRows.length);
      const newLevel = Math.min(15, Math.floor(newScore / 500));

      this.state = {
        ...this.state,
        grid: newGrid,
        lines: newLines,
        score: newScore,
        level: newLevel,
      };

      this.onLinesClear?.(completeRows.length, completeRows, gridColors);
      this.onScoreChange?.(newScore);

      if (newLevel > this.state.level) {
        this.onLevelChange?.(newLevel);
      }
    } else {
      this.state = { ...this.state, grid: newGrid };
    }

    // Spawn next piece
    const nextPiece = this.state.nextPiece;

    if (!isValidPosition(nextPiece, newGrid)) {
      // Game over
      this.state = {
        ...this.state,
        status: 'gameover',
        currentPiece: null,
      };

      this.onGameOver?.(this.state.score);
      this.onStateChange?.('gameover');
      this.stopGameLoop();
      return;
    }

    this.state = {
      ...this.state,
      currentPiece: nextPiece,
      nextPiece: createRandomPiece(),
    };

    this.lockDelayStartTime = null;
  }

  private resetLockDelayIfTouching(): void {
    if (!this.state.currentPiece) {
      return;
    }

    if (isTouchingBottom(this.state.currentPiece, this.state.grid)) {
      this.lockDelayStartTime = Date.now();
    } else {
      this.lockDelayStartTime = null;
    }
  }

  private calculateScore(linesCleared: number): number {
    const baseScores: Record<number, number> = {
      1: 50,
      2: 300,
      3: 500,
      4: 1000,
    };

    return (baseScores[linesCleared] ?? 0) * (this.state.level + 1);
  }
}
