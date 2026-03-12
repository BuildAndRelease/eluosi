/**
 * Renderer3D - Isometric 3D Block Rendering
 *
 * Renders Tetris blocks with isometric 3D perspective using Canvas 2D API.
 * Each block shows three faces (top, left, right) with different brightness levels.
 */

import { FACE_BRIGHTNESS } from './styles';

/**
 * Isometric coordinates in pixel space
 */
export interface IsometricCoords {
  isoX: number;
  isoY: number;
}

/**
 * Three face colors for 3D block rendering
 */
export interface FaceColors {
  top: string;
  left: string;
  right: string;
}

/**
 * Transform grid coordinates to isometric pixel coordinates
 *
 * @param gridX Grid X coordinate
 * @param gridY Grid Y coordinate
 * @param cellSize Cell size in pixels
 * @returns Isometric pixel coordinates
 */
export function toIsometric(gridX: number, gridY: number, cellSize: number): IsometricCoords {
  const isoX = (gridX - gridY) * (cellSize / 2);
  const isoY = (gridX + gridY) * (cellSize / 4);

  return { isoX, isoY };
}

/**
 * Calculate face colors with brightness adjustments
 *
 * @param baseColor Base hex color
 * @returns Three face colors (top, left, right)
 */
export function calculateFaceColors(baseColor: string): FaceColors {
  const rgb = parseInt(baseColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;

  // Top face: 100% brightness
  const topR = r;
  const topG = g;
  const topB = b;

  // Left face: 70% brightness
  const leftR = Math.max(0, Math.round(r * FACE_BRIGHTNESS.LEFT));
  const leftG = Math.max(0, Math.round(g * FACE_BRIGHTNESS.LEFT));
  const leftB = Math.max(0, Math.round(b * FACE_BRIGHTNESS.LEFT));

  // Right face: 50% brightness
  const rightR = Math.max(0, Math.round(r * FACE_BRIGHTNESS.RIGHT));
  const rightG = Math.max(0, Math.round(g * FACE_BRIGHTNESS.RIGHT));
  const rightB = Math.max(0, Math.round(b * FACE_BRIGHTNESS.RIGHT));

  return {
    top: `#${((topR << 16) | (topG << 8) | topB).toString(16).padStart(6, '0')}`,
    left: `#${((leftR << 16) | (leftG << 8) | leftB).toString(16).padStart(6, '0')}`,
    right: `#${((rightR << 16) | (rightG << 8) | rightB).toString(16).padStart(6, '0')}`,
  };
}

/**
 * Renderer3D - Isometric 3D block rendering
 */
export class Renderer3D {
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;

  constructor(ctx: CanvasRenderingContext2D, cellSize: number) {
    this.ctx = ctx;
    this.cellSize = cellSize;
  }

  /**
   * Render a single 3D block at grid position
   *
   * @param gridX Grid X coordinate
   * @param gridY Grid Y coordinate
   * @param color Base block color
   */
  public renderBlock(gridX: number, gridY: number, color: string): void {
    const { isoX, isoY } = toIsometric(gridX, gridY, this.cellSize);
    const faces = calculateFaceColors(color);

    // Calculate face dimensions
    const halfWidth = this.cellSize / 2;
    const quarterHeight = this.cellSize / 4;

    // Render right face (darkest)
    this.ctx.fillStyle = faces.right;
    this.ctx.beginPath();
    this.ctx.moveTo(isoX, isoY);
    this.ctx.lineTo(isoX + halfWidth, isoY + quarterHeight);
    this.ctx.lineTo(isoX + halfWidth, isoY + quarterHeight + this.cellSize / 2);
    this.ctx.lineTo(isoX, isoY + this.cellSize / 2);
    this.ctx.closePath();
    this.ctx.fill();

    // Render left face (medium)
    this.ctx.fillStyle = faces.left;
    this.ctx.beginPath();
    this.ctx.moveTo(isoX, isoY);
    this.ctx.lineTo(isoX - halfWidth, isoY + quarterHeight);
    this.ctx.lineTo(isoX - halfWidth, isoY + quarterHeight + this.cellSize / 2);
    this.ctx.lineTo(isoX, isoY + this.cellSize / 2);
    this.ctx.closePath();
    this.ctx.fill();

    // Render top face (lightest)
    this.ctx.fillStyle = faces.top;
    this.ctx.beginPath();
    this.ctx.moveTo(isoX, isoY);
    this.ctx.lineTo(isoX + halfWidth, isoY + quarterHeight);
    this.ctx.lineTo(isoX, isoY + quarterHeight * 2);
    this.ctx.lineTo(isoX - halfWidth, isoY + quarterHeight);
    this.ctx.closePath();
    this.ctx.fill();

    // Add subtle outline
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }
}
