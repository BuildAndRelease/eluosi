/**
 * Glass Block Color Schemes
 *
 * Semi-transparent glass-effect colors for 7 Tetris piece types.
 * Each piece has 3 visual properties:
 * - Base color (semi-transparent background)
 * - Border gradient (light top-left, dark bottom-right)
 * - Glow effect (outer shadow matching piece color)
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

export const GLASS_BLOCK_COLORS: Record<string, GlassBlockStyle> = {
  // I-piece: Cyan glass
  '#00FFFF': {
    base: 'rgba(34, 211, 238, 0.3)', // cyan-400/30
    borderLight: 'rgba(207, 250, 254, 0.7)', // cyan-100/70
    borderDark: 'rgba(8, 145, 178, 0.5)', // cyan-900/50
    glow: 'rgba(34, 211, 238, 0.5)',
  },

  // J-piece: Blue glass
  '#0000FF': {
    base: 'rgba(59, 130, 246, 0.3)', // blue-500/30
    borderLight: 'rgba(219, 234, 254, 0.7)', // blue-100/70
    borderDark: 'rgba(30, 58, 138, 0.5)', // blue-900/50
    glow: 'rgba(59, 130, 246, 0.5)',
  },

  // L-piece: Orange glass
  '#FFA500': {
    base: 'rgba(251, 146, 60, 0.3)', // orange-400/30
    borderLight: 'rgba(255, 237, 213, 0.7)', // orange-100/70
    borderDark: 'rgba(124, 45, 18, 0.5)', // orange-900/50
    glow: 'rgba(251, 146, 60, 0.5)',
  },

  // O-piece: Yellow glass
  '#FFFF00': {
    base: 'rgba(250, 204, 21, 0.3)', // yellow-400/30
    borderLight: 'rgba(254, 249, 195, 0.7)', // yellow-100/70
    borderDark: 'rgba(113, 63, 18, 0.5)', // yellow-900/50
    glow: 'rgba(250, 204, 21, 0.5)',
  },

  // S-piece: Green glass
  '#00FF00': {
    base: 'rgba(34, 197, 94, 0.3)', // green-500/30
    borderLight: 'rgba(220, 252, 231, 0.7)', // green-100/70
    borderDark: 'rgba(20, 83, 45, 0.5)', // green-900/50
    glow: 'rgba(34, 197, 94, 0.5)',
  },

  // T-piece: Purple glass
  '#800080': {
    base: 'rgba(168, 85, 247, 0.3)', // purple-500/30
    borderLight: 'rgba(243, 232, 255, 0.7)', // purple-100/70
    borderDark: 'rgba(88, 28, 135, 0.5)', // purple-900/50
    glow: 'rgba(168, 85, 247, 0.5)',
  },

  // Z-piece: Red glass
  '#FF0000': {
    base: 'rgba(239, 68, 68, 0.3)', // red-500/30
    borderLight: 'rgba(254, 226, 226, 0.7)', // red-100/70
    borderDark: 'rgba(127, 29, 29, 0.5)', // red-900/50
    glow: 'rgba(239, 68, 68, 0.5)',
  },
};

/**
 * Convert hex color to glass block style
 */
export function getGlassStyle(hexColor: string): GlassBlockStyle {
  const style = GLASS_BLOCK_COLORS[hexColor.toUpperCase()];
  if (!style) {
    // Fallback for unknown colors
    return {
      base: 'rgba(255, 255, 255, 0.3)',
      borderLight: 'rgba(255, 255, 255, 0.7)',
      borderDark: 'rgba(0, 0, 0, 0.5)',
      glow: 'rgba(255, 255, 255, 0.5)',
    };
  }
  return style;
}

/**
 * Parse rgba string to components
 */
export function parseRgba(rgba: string): { r: number; g: number; b: number; a: number } {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) {
    return { r: 255, g: 255, b: 255, a: 1 };
  }
  return {
    r: parseInt(match[1]!, 10),
    g: parseInt(match[2]!, 10),
    b: parseInt(match[3]!, 10),
    a: match[4] ? parseFloat(match[4]) : 1,
  };
}
