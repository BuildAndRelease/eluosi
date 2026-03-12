/**
 * Glass Block Renderer
 *
 * Renders Tetris blocks with glassmorphism effect using Canvas 2D API.
 * Each block shows semi-transparent glass appearance with:
 * - Base semi-transparent color
 * - Light/dark border gradient
 * - Inner highlights and shadows
 * - Outer glow effect
 */

import { getGlassStyle, parseRgba, type GlassBlockStyle } from './glass-colors';

export class GlassRenderer {
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;

  constructor(ctx: CanvasRenderingContext2D, cellSize: number) {
    this.ctx = ctx;
    this.cellSize = cellSize;
  }

  /**
   * Render a single glass block at grid position
   */
  public renderBlock(x: number, y: number, color: string): void {
    const style = getGlassStyle(color);
    const pixelX = x * this.cellSize;
    const pixelY = y * this.cellSize;

    // Draw outer glow
    this.drawGlow(pixelX, pixelY, style);

    // Draw base glass rectangle
    this.drawBase(pixelX, pixelY, style);

    // Draw border gradient
    this.drawBorder(pixelX, pixelY, style);

    // Draw inner highlights and shadows
    this.drawInnerEffects(pixelX, pixelY, style);
  }

  /**
   * Draw outer glow effect
   */
  private drawGlow(x: number, y: number, style: GlassBlockStyle): void {
    const rgba = parseRgba(style.glow);
    this.ctx.save();

    // Create radial gradient for glow
    const centerX = x + this.cellSize / 2;
    const centerY = y + this.cellSize / 2;
    const gradient = this.ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      this.cellSize * 0.8
    );

    gradient.addColorStop(0, `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`);
    gradient.addColorStop(1, `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 0)`);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(
      x - this.cellSize * 0.3,
      y - this.cellSize * 0.3,
      this.cellSize * 1.6,
      this.cellSize * 1.6
    );

    this.ctx.restore();
  }

  /**
   * Draw base semi-transparent rectangle
   */
  private drawBase(x: number, y: number, style: GlassBlockStyle): void {
    this.ctx.fillStyle = style.base;
    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
  }

  /**
   * Draw border with light/dark gradient
   */
  private drawBorder(x: number, y: number, style: GlassBlockStyle): void {
    this.ctx.save();
    this.ctx.lineWidth = 2;

    // Top and left borders (light)
    this.ctx.strokeStyle = style.borderLight;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + this.cellSize);
    this.ctx.lineTo(x, y);
    this.ctx.lineTo(x + this.cellSize, y);
    this.ctx.stroke();

    // Bottom and right borders (dark)
    this.ctx.strokeStyle = style.borderDark;
    this.ctx.beginPath();
    this.ctx.moveTo(x + this.cellSize, y);
    this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
    this.ctx.lineTo(x, y + this.cellSize);
    this.ctx.stroke();

    this.ctx.restore();
  }

  /**
   * Draw inner highlights and shadows for glass effect
   */
  private drawInnerEffects(x: number, y: number, _style: GlassBlockStyle): void {
    this.ctx.save();

    // Inner highlight (top-left)
    const highlightGradient = this.ctx.createLinearGradient(x, y, x + this.cellSize / 2, y + this.cellSize / 2);
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    this.ctx.fillStyle = highlightGradient;
    this.ctx.fillRect(x + 1, y + 1, this.cellSize / 3, this.cellSize / 3);

    // Inner shadow (bottom-right)
    const shadowGradient = this.ctx.createLinearGradient(
      x + this.cellSize,
      y + this.cellSize,
      x + this.cellSize / 2,
      y + this.cellSize / 2
    );
    shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = shadowGradient;
    this.ctx.fillRect(
      x + (this.cellSize * 2) / 3,
      y + (this.cellSize * 2) / 3,
      this.cellSize / 3,
      this.cellSize / 3
    );

    this.ctx.restore();
  }

  /**
   * Render grid of glass blocks
   */
  public renderGrid(grid: (string | null)[][], offsetX: number = 0, offsetY: number = 0): void {
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y]!.length; x++) {
        const color = grid[y]![x];
        if (color) {
          this.renderBlock(x + offsetX, y + offsetY, color);
        }
      }
    }
  }

  /**
   * Render a piece (4x4 shape matrix)
   */
  public renderPiece(
    shape: number[][],
    position: { x: number; y: number },
    color: string,
    offsetX: number = 0,
    offsetY: number = 0
  ): void {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y]!.length; x++) {
        if (shape[y]![x]) {
          this.renderBlock(position.x + x + offsetX, position.y + y + offsetY, color);
        }
      }
    }
  }
}
