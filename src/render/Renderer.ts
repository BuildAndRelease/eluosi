/**
 * Canvas Renderer
 *
 * Handles all Canvas rendering including grid, pieces, metallic effects,
 * animations, and UI elements (score, level, next piece preview).
 */

import type { GameState, Piece, Grid, GameAPI } from '../game/types';
import { CELL_SIZE, GRID_WIDTH, GRID_HEIGHT, ANIMATION_DURATIONS } from '../config/constants';
import { createMetallicGradient, addHighlight, addShadow } from './metallic-effects';

// Canvas layout constants
const SIDEBAR_WIDTH = 150;
const CANVAS_WIDTH = GRID_WIDTH * CELL_SIZE + SIDEBAR_WIDTH;
const CANVAS_HEIGHT = GRID_HEIGHT * CELL_SIZE;

// Gradient cache to avoid recreating on every frame
const gradientCache = new Map<string, CanvasGradient>();

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private game: GameAPI | null = null;

  // Animation state
  private clearingRows: number[] = [];
  private clearAnimationStart: number | null = null;
  private lockFlashPiece: Piece | null = null;
  private lockFlashStart: number | null = null;

  constructor(canvas: HTMLCanvasElement, game?: GameAPI) {
    this.canvas = canvas;
    this.game = game || null;

    // Resize canvas to include sidebar
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D rendering context');
    }

    this.ctx = ctx;
  }

  /** Set game reference for high score display */
  public setGame(game: GameAPI): void {
    this.game = game;
  }

  /** Clear the entire canvas */
  public clear(): void {
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /** Render complete game state */
  public render(state: GameState): void {
    this.clear();
    this.renderGrid(state.grid);

    if (state.currentPiece) {
      this.renderPiece(state.currentPiece);
    }

    // Render line clear animation
    if (this.clearingRows.length > 0 && this.clearAnimationStart !== null) {
      const elapsed = Date.now() - this.clearAnimationStart;
      const progress = Math.min(1, elapsed / ANIMATION_DURATIONS.LINE_CLEAR);
      this.renderLineClearAnimation(this.clearingRows, progress);

      if (progress >= 1) {
        this.clearingRows = [];
        this.clearAnimationStart = null;
      }
    }

    // Render lock flash
    if (this.lockFlashPiece && this.lockFlashStart !== null) {
      const elapsed = Date.now() - this.lockFlashStart;
      const progress = Math.min(1, elapsed / ANIMATION_DURATIONS.BLOCK_LOCK_FLASH);
      this.renderLockFlash(this.lockFlashPiece, 1 - progress);

      if (progress >= 1) {
        this.lockFlashPiece = null;
        this.lockFlashStart = null;
      }
    }

    this.renderSidebar(state);

    // Render overlay for paused/gameover states
    if (state.status === 'paused') {
      this.renderPauseOverlay();
    } else if (state.status === 'gameover') {
      this.renderGameOverOverlay(state.score);
    } else if (state.status === 'menu') {
      this.renderMenuOverlay();
    }
  }

  /** Render the game grid with locked blocks */
  public renderGrid(grid: Grid): void {
    // Background
    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(0, 0, GRID_WIDTH * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);

    // Grid lines
    this.ctx.strokeStyle = '#2a2a2a';
    this.ctx.lineWidth = 0.5;

    for (let x = 0; x <= GRID_WIDTH; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * CELL_SIZE, 0);
      this.ctx.lineTo(x * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);
      this.ctx.stroke();
    }

    for (let y = 0; y <= GRID_HEIGHT; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * CELL_SIZE);
      this.ctx.lineTo(GRID_WIDTH * CELL_SIZE, y * CELL_SIZE);
      this.ctx.stroke();
    }

    // Locked blocks
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const color = grid.cells[y]![x];
        if (color) {
          this.renderMetallicBlock(x, y, color);
        }
      }
    }
  }

  /** Render a single piece */
  public renderPiece(piece: Piece): void {
    const { shape, position, color } = piece;

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (shape[y]![x]) {
          const gridX = position.x + x;
          const gridY = position.y + y;

          if (gridY >= 0) {
            this.renderMetallicBlock(gridX, gridY, color);
          }
        }
      }
    }
  }

  /** Render next piece preview in sidebar */
  public renderNextPiece(piece: Piece): void {
    const previewX = GRID_WIDTH * CELL_SIZE + 20;
    const previewY = 80;
    const previewCellSize = 20;

    this.ctx.fillStyle = '#222';
    this.ctx.fillRect(previewX - 5, previewY - 5, 90, 90);

    const { shape, color } = piece;

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (shape[y]![x]) {
          const px = previewX + x * previewCellSize;
          const py = previewY + y * previewCellSize;

          const gradient = this.ctx.createLinearGradient(px, py, px + previewCellSize, py + previewCellSize);
          const lighter = this.lightenHex(color, 40);
          const darker = this.darkenHex(color, 30);
          gradient.addColorStop(0, lighter);
          gradient.addColorStop(0.5, color);
          gradient.addColorStop(1, darker);

          this.ctx.fillStyle = gradient;
          this.ctx.fillRect(px + 1, py + 1, previewCellSize - 2, previewCellSize - 2);
          this.ctx.strokeStyle = '#000';
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(px + 1, py + 1, previewCellSize - 2, previewCellSize - 2);
        }
      }
    }
  }

  /** Trigger line clear animation */
  public triggerLineClearAnimation(rows: number[]): void {
    this.clearingRows = rows;
    this.clearAnimationStart = Date.now();
  }

  /** Trigger block lock flash */
  public triggerLockFlash(piece: Piece): void {
    this.lockFlashPiece = piece;
    this.lockFlashStart = Date.now();
  }

  /** Render metallic block with gradient, highlight, and shadow */
  private renderMetallicBlock(x: number, y: number, color: string): void {
    const pixelX = x * CELL_SIZE + 1;
    const pixelY = y * CELL_SIZE + 1;
    const size = CELL_SIZE - 2;

    // Use cached gradient or create new one
    const cacheKey = `${color}-${size}`;
    let gradient = gradientCache.get(cacheKey);

    if (!gradient) {
      gradient = createMetallicGradient(this.ctx, pixelX, pixelY, size, color);
      gradientCache.set(cacheKey, gradient);
    }

    // Draw base block with metallic gradient
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(pixelX, pixelY, size, size);

    // Add highlight and shadow
    addHighlight(this.ctx, pixelX, pixelY, size);
    addShadow(this.ctx, pixelX, pixelY, size);

    // Border
    this.ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(pixelX, pixelY, size, size);
  }

  /** Render line clear animation (fade out) */
  private renderLineClearAnimation(rows: number[], progress: number): void {
    const alpha = 1 - progress;

    for (const row of rows) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
      this.ctx.fillRect(0, row * CELL_SIZE, GRID_WIDTH * CELL_SIZE, CELL_SIZE);
    }
  }

  /** Render block lock flash effect */
  private renderLockFlash(piece: Piece, alpha: number): void {
    const { shape, position } = piece;

    this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (shape[y]![x]) {
          const gridX = position.x + x;
          const gridY = position.y + y;

          if (gridY >= 0) {
            this.ctx.fillRect(
              gridX * CELL_SIZE + 1,
              gridY * CELL_SIZE + 1,
              CELL_SIZE - 2,
              CELL_SIZE - 2
            );
          }
        }
      }
    }
  }

  /** Render sidebar with score, level, lines, and next piece */
  private renderSidebar(state: GameState): void {
    const sideX = GRID_WIDTH * CELL_SIZE + 10;

    // Sidebar background
    this.ctx.fillStyle = '#1e1e1e';
    this.ctx.fillRect(GRID_WIDTH * CELL_SIZE, 0, SIDEBAR_WIDTH, CANVAS_HEIGHT);

    // Metallic border
    this.ctx.strokeStyle = '#555';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(GRID_WIDTH * CELL_SIZE, 0);
    this.ctx.lineTo(GRID_WIDTH * CELL_SIZE, CANVAS_HEIGHT);
    this.ctx.stroke();

    // Title
    this.renderMetallicText('NEXT', sideX, 30, 14);

    // Next piece preview
    if (state.nextPiece) {
      this.renderNextPiece(state.nextPiece);
    }

    // Score
    this.renderMetallicText('SCORE', sideX, 200, 12);
    this.renderValueText(state.score.toString(), sideX, 220, 16);

    // Level
    this.renderMetallicText('LEVEL', sideX, 260, 12);
    this.renderValueText(state.level.toString(), sideX, 280, 16);

    // Lines
    this.renderMetallicText('LINES', sideX, 320, 12);
    this.renderValueText(state.lines.toString(), sideX, 340, 16);

    // High score
    this.renderMetallicText('BEST', sideX, 380, 12);
    const highScore = this.game ? this.game.getHighScore() : 0;
    this.renderValueText(highScore.toString(), sideX, 400, 14);

    // Controls hint
    this.ctx.fillStyle = '#555';
    this.ctx.font = '9px monospace';
    this.ctx.fillText('← → Move', sideX, 460);
    this.ctx.fillText('↑ Rotate', sideX, 475);
    this.ctx.fillText('↓ Soft drop', sideX, 490);
    this.ctx.fillText('SPC Hard drop', sideX, 505);
    this.ctx.fillText('P Pause', sideX, 520);
    this.ctx.fillText('R Restart', sideX, 535);
  }

  /** Render metallic-styled label text */
  private renderMetallicText(text: string, x: number, y: number, size: number): void {
    this.ctx.font = `bold ${size}px monospace`;
    const gradient = this.ctx.createLinearGradient(x, y - size, x, y);
    gradient.addColorStop(0, '#e0e0e0');
    gradient.addColorStop(0.5, '#a0a0a0');
    gradient.addColorStop(1, '#c0c0c0');
    this.ctx.fillStyle = gradient;
    this.ctx.fillText(text, x, y);
  }

  /** Render value text (score, level, etc.) */
  private renderValueText(text: string, x: number, y: number, size: number): void {
    this.ctx.font = `${size}px monospace`;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(text, x, y);
  }

  /** Render pause overlay */
  private renderPauseOverlay(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(0, 0, GRID_WIDTH * CELL_SIZE, CANVAS_HEIGHT);

    this.ctx.font = 'bold 28px monospace';
    this.ctx.fillStyle = '#c0c0c0';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSED', (GRID_WIDTH * CELL_SIZE) / 2, CANVAS_HEIGHT / 2);
    this.ctx.font = '14px monospace';
    this.ctx.fillStyle = '#888';
    this.ctx.fillText('Press P to resume', (GRID_WIDTH * CELL_SIZE) / 2, CANVAS_HEIGHT / 2 + 30);
    this.ctx.textAlign = 'left';
  }

  /** Render game over overlay */
  private renderGameOverOverlay(score: number): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.ctx.fillRect(0, 0, GRID_WIDTH * CELL_SIZE, CANVAS_HEIGHT);

    const cx = (GRID_WIDTH * CELL_SIZE) / 2;
    this.ctx.textAlign = 'center';

    this.ctx.font = 'bold 28px monospace';
    this.ctx.fillStyle = '#dc143c';
    this.ctx.fillText('GAME OVER', cx, CANVAS_HEIGHT / 2 - 30);

    this.ctx.font = '16px monospace';
    this.ctx.fillStyle = '#c0c0c0';
    this.ctx.fillText(`Score: ${score}`, cx, CANVAS_HEIGHT / 2 + 10);

    this.ctx.font = '13px monospace';
    this.ctx.fillStyle = '#888';
    this.ctx.fillText('Press R to restart', cx, CANVAS_HEIGHT / 2 + 40);
    this.ctx.textAlign = 'left';
  }

  /** Render main menu overlay */
  private renderMenuOverlay(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, GRID_WIDTH * CELL_SIZE, CANVAS_HEIGHT);

    const cx = (GRID_WIDTH * CELL_SIZE) / 2;
    this.ctx.textAlign = 'center';

    this.ctx.font = 'bold 32px monospace';
    const gradient = this.ctx.createLinearGradient(cx - 80, 0, cx + 80, 0);
    gradient.addColorStop(0, '#c0c0c0');
    gradient.addColorStop(0.5, '#ffffff');
    gradient.addColorStop(1, '#c0c0c0');
    this.ctx.fillStyle = gradient;
    this.ctx.fillText('俄罗斯方块', cx, CANVAS_HEIGHT / 2 - 20);

    this.ctx.font = '14px monospace';
    this.ctx.fillStyle = '#888';
    this.ctx.fillText('Press any key to start', cx, CANVAS_HEIGHT / 2 + 20);
    this.ctx.textAlign = 'left';
  }

  private lightenHex(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
    const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(2.55 * percent));
    const b = Math.min(255, (num & 0x0000ff) + Math.round(2.55 * percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  private darkenHex(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent));
    const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(2.55 * percent));
    const b = Math.max(0, (num & 0x0000ff) - Math.round(2.55 * percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
}
