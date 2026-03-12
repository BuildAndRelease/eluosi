/**
 * Metallic Visual Effects
 *
 * Functions to generate metallic gradients, highlights, and shadows
 * for the Tetris block rendering.
 */

/**
 * Create a metallic gradient for a block
 *
 * @param ctx - Canvas 2D context
 * @param x - Block x position (pixels)
 * @param y - Block y position (pixels)
 * @param size - Block size (pixels)
 * @param baseColor - Base hex color
 * @returns CanvasGradient with metallic effect
 */
export function createMetallicGradient(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  baseColor: string
): CanvasGradient {
  // 135° diagonal gradient for metallic sheen
  const gradient = ctx.createLinearGradient(x, y, x + size, y + size);

  // Parse base color and create lighter/darker variants
  const lighter = lightenColor(baseColor, 40);
  const darker = darkenColor(baseColor, 30);

  gradient.addColorStop(0, lighter);
  gradient.addColorStop(0.4, baseColor);
  gradient.addColorStop(0.7, darker);
  gradient.addColorStop(1, lightenColor(baseColor, 20));

  return gradient;
}

/**
 * Add semi-transparent white highlight to top-left of block
 */
export function addHighlight(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
): void {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.fillRect(x + 1, y + 1, size * 0.4, 3);
  ctx.fillRect(x + 1, y + 1, 3, size * 0.4);
}

/**
 * Add semi-transparent black shadow to bottom-right of block
 */
export function addShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(x + size - 4, y + size * 0.6, 3, size * 0.4);
  ctx.fillRect(x + size * 0.6, y + size - 4, size * 0.4, 3);
}

/**
 * Lighten a hex color by a percentage
 */
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(2.55 * percent));
  const b = Math.min(255, (num & 0x0000ff) + Math.round(2.55 * percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Darken a hex color by a percentage
 */
function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent));
  const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(2.55 * percent));
  const b = Math.max(0, (num & 0x0000ff) - Math.round(2.55 * percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
