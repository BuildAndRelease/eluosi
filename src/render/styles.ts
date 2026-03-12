/**
 * Color Styles and 3D Color Schemes
 *
 * Defines color palettes for 2D and 3D rendering modes.
 * 3D colors include three brightness levels for isometric faces.
 */

import type { PieceType } from '../game/types';

/**
 * 2D block colors (V1 - unchanged)
 * Used for metallic gradient rendering
 */
export const BLOCK_COLORS_2D: Record<PieceType, string> = {
  I: '#C0C0C0', // Silver
  O: '#FFD700', // Gold
  T: '#9370DB', // Purple
  S: '#32CD32', // Green
  Z: '#DC143C', // Red
  J: '#4169E1', // Blue
  L: '#FF8C00', // Orange
};

/**
 * 3D block colors with three faces
 * Top face: 100% brightness (lightest)
 * Left face: 70% brightness (medium)
 * Right face: 50% brightness (darkest)
 */
export interface BlockColor3D {
  top: string;
  left: string;
  right: string;
}

export const BLOCK_COLORS_3D: Record<PieceType, BlockColor3D> = {
  I: {
    top: '#00f0f0',   // Cyan - 100%
    left: '#00a8a8',  // Cyan - 70%
    right: '#007878', // Cyan - 50%
  },
  O: {
    top: '#f0f000',   // Yellow - 100%
    left: '#a8a800',  // Yellow - 70%
    right: '#787800', // Yellow - 50%
  },
  T: {
    top: '#a000f0',   // Purple - 100%
    left: '#7000a8',  // Purple - 70%
    right: '#500078', // Purple - 50%
  },
  S: {
    top: '#00f000',   // Green - 100%
    left: '#00a800',  // Green - 70%
    right: '#007800', // Green - 50%
  },
  Z: {
    top: '#f00000',   // Red - 100%
    left: '#a80000',  // Red - 70%
    right: '#780000', // Red - 50%
  },
  J: {
    top: '#0000f0',   // Blue - 100%
    left: '#0000a8',  // Blue - 70%
    right: '#000078', // Blue - 50%
  },
  L: {
    top: '#f0a000',   // Orange - 100%
    left: '#a87000',  // Orange - 70%
    right: '#785000', // Orange - 50%
  },
};

/**
 * Face brightness multipliers for 3D rendering
 */
export const FACE_BRIGHTNESS = {
  TOP: 1.0,   // 100% brightness
  LEFT: 0.7,  // 70% brightness
  RIGHT: 0.5, // 50% brightness
} as const;
