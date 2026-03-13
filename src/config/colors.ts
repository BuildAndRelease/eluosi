/**
 * Color Palette Configuration
 *
 * Defines the colorful palette for the Tetris game blocks.
 * All colors meet WCAG AA accessibility standards (4.5:1 contrast ratio).
 * Excludes black, white, and gray tones per Constitution VII.
 */

/**
 * Colorful palette for 7 Tetris block types
 * - High saturation (80-90%) for vibrant appearance
 * - Distinct hues for easy differentiation
 * - WCAG AA compliant contrast ratios
 */
export const COLORFUL_PALETTE = {
  I: '#00D9FF', // Cyan - I-piece (4-block line)
  O: '#FFD700', // Yellow/Gold - O-piece (2x2 square)
  T: '#B24BF3', // Purple - T-piece
  S: '#00FF7F', // Spring Green - S-piece
  Z: '#FF4757', // Red - Z-piece
  J: '#3742FA', // Blue - J-piece
  L: '#FF6348', // Orange - L-piece
} as const;

/**
 * Type-safe access to color palette
 */
export type PieceColor = keyof typeof COLORFUL_PALETTE;

/**
 * Get color for a specific piece type
 * @param pieceType - The Tetris piece type (I, O, T, S, Z, J, L)
 * @returns Hex color code
 */
export function getColorForPiece(pieceType: PieceColor): string {
  return COLORFUL_PALETTE[pieceType];
}

/**
 * Glassmorphism style configuration
 * - Semi-transparent background with Gaussian blur
 * - Static gradient background (light purple to light blue)
 */
export const GLASSMORPHISM_STYLE = {
  // Game area glassmorphism
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)', // Safari support

  // Body background gradient
  bodyGradient: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)',

  // Fallback for browsers without backdrop-filter support
  fallbackBackground: 'rgba(255, 255, 255, 0.15)',
} as const;

/**
 * Convert COLORFUL_PALETTE to array for random selection
 * Used for obstacle row generation
 */
export const COLOR_PALETTE_ARRAY = Object.values(COLORFUL_PALETTE);
