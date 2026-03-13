/**
 * Glass Colors Helper
 *
 * Helper functions for applying colorful styles to rendered blocks.
 * Integrates with the glassmorphism theme and COLORFUL_PALETTE.
 */

import { COLORFUL_PALETTE, type PieceColor } from '../config/colors';
import type { PieceType } from '../game/types';

/**
 * Get colorful style for a block
 * @param pieceType - The Tetris piece type
 * @returns Hex color code
 */
export function getBlockColor(pieceType: PieceType): string {
  return COLORFUL_PALETTE[pieceType as PieceColor];
}

/**
 * Apply colorful fill style to canvas context
 * @param ctx - Canvas 2D rendering context
 * @param pieceType - The Tetris piece type
 */
export function applyColorfulFill(ctx: CanvasRenderingContext2D, pieceType: PieceType): void {
  ctx.fillStyle = getBlockColor(pieceType);
}

/**
 * Apply colorful stroke style to canvas context
 * @param ctx - Canvas 2D rendering context
 * @param pieceType - The Tetris piece type
 * @param alpha - Opacity (0-1), default 1
 */
export function applyColorfulStroke(
  ctx: CanvasRenderingContext2D,
  pieceType: PieceType,
  alpha: number = 1
): void {
  const color = getBlockColor(pieceType);
  if (alpha < 1) {
    // Convert hex to rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else {
    ctx.strokeStyle = color;
  }
}

/**
 * Create gradient for colorful block (adds depth)
 * @param ctx - Canvas 2D rendering context
 * @param x - X position
 * @param y - Y position
 * @param width - Block width
 * @param height - Block height
 * @param pieceType - The Tetris piece type
 * @returns CanvasGradient
 */
export function createColorfulGradient(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  pieceType: PieceType
): CanvasGradient {
  const baseColor = getBlockColor(pieceType);
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height);

  // Lighter at top-left
  gradient.addColorStop(0, lightenColor(baseColor, 20));
  // Base color in middle
  gradient.addColorStop(0.5, baseColor);
  // Darker at bottom-right
  gradient.addColorStop(1, darkenColor(baseColor, 20));

  return gradient;
}

/**
 * Lighten a hex color
 * @param hex - Hex color code
 * @param percent - Percentage to lighten (0-100)
 * @returns Lightened hex color
 */
export function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, ((num >> 16) & 0xff) + amt);
  const G = Math.min(255, ((num >> 8) & 0xff) + amt);
  const B = Math.min(255, (num & 0xff) + amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

/**
 * Darken a hex color
 * @param hex - Hex color code
 * @param percent - Percentage to darken (0-100)
 * @returns Darkened hex color
 */
export function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, ((num >> 16) & 0xff) - amt);
  const G = Math.max(0, ((num >> 8) & 0xff) - amt);
  const B = Math.max(0, (num & 0xff) - amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

/**
 * Glass block style interface
 */
export interface GlassBlockStyle {
  /** Base semi-transparent color */
  base: string;
  /** Light border color (top-left) */
  borderLight: string;
  /** Dark border color (bottom-right) */
  borderDark: string;
  /** Glow color for outer shadow */
  glow: string;
}

/**
 * Convert hex color to glass block style with semi-transparency
 * @param hexColor - Hex color code
 * @returns Glass block style with rgba colors
 */
export function hexToGlassStyle(hexColor: string): GlassBlockStyle {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  return {
    base: `rgba(${r}, ${g}, ${b}, 0.3)`,
    borderLight: `rgba(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)}, 0.7)`,
    borderDark: `rgba(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 50)}, 0.5)`,
    glow: `rgba(${r}, ${g}, ${b}, 0.5)`,
  };
}

/**
 * Get glass style for a piece type
 * @param pieceType - The Tetris piece type
 * @returns Glass block style
 */
export function getGlassStyleForPiece(pieceType: PieceType): GlassBlockStyle {
  const hexColor = getBlockColor(pieceType);
  return hexToGlassStyle(hexColor);
}

/**
 * Get glass style from color string (backward compatibility)
 * @param color - Hex color code
 * @returns Glass block style
 */
export function getGlassStyle(color: string): GlassBlockStyle {
  return hexToGlassStyle(color);
}
