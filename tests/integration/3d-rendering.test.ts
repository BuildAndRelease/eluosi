/**
 * 3D Rendering Integration Tests
 *
 * Tests for 3D grid and piece rendering with performance validation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Renderer3D } from '../../src/render/Renderer3D';

// T029: Integration test for 3D grid rendering
describe('3D Grid Rendering', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let renderer: Renderer3D;
  const CELL_SIZE = 30;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    ctx = canvas.getContext('2d')!;
    renderer = new Renderer3D(ctx, CELL_SIZE);
  });

  it('should render a single 3D block without errors', () => {
    expect(() => {
      renderer.renderBlock(5, 10, '#ff0000');
    }).not.toThrow();
  });

  it('should render multiple blocks in a grid', () => {
    const gridWidth = 10;
    const gridHeight = 20;

    expect(() => {
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          if ((x + y) % 2 === 0) {
            renderer.renderBlock(x, y, '#00ff00');
          }
        }
      }
    }).not.toThrow();
  });

  it('should handle edge positions correctly', () => {
    expect(() => {
      renderer.renderBlock(0, 0, '#ff0000'); // Top-left
      renderer.renderBlock(9, 0, '#00ff00'); // Top-right
      renderer.renderBlock(0, 19, '#0000ff'); // Bottom-left
      renderer.renderBlock(9, 19, '#ffff00'); // Bottom-right
    }).not.toThrow();
  });

  it('should render blocks with different colors', () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];

    expect(() => {
      colors.forEach((color, index) => {
        renderer.renderBlock(index, 0, color);
      });
    }).not.toThrow();
  });
});

// T030: Integration test for 3D piece rendering
describe('3D Piece Rendering', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let renderer: Renderer3D;
  const CELL_SIZE = 30;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    ctx = canvas.getContext('2d')!;
    renderer = new Renderer3D(ctx, CELL_SIZE);
  });

  it('should render I-piece (4 blocks horizontal)', () => {
    const color = '#00ffff';

    expect(() => {
      for (let x = 0; x < 4; x++) {
        renderer.renderBlock(x, 0, color);
      }
    }).not.toThrow();
  });

  it('should render O-piece (2x2 square)', () => {
    const color = '#ffff00';

    expect(() => {
      renderer.renderBlock(0, 0, color);
      renderer.renderBlock(1, 0, color);
      renderer.renderBlock(0, 1, color);
      renderer.renderBlock(1, 1, color);
    }).not.toThrow();
  });

  it('should render T-piece shape', () => {
    const color = '#ff00ff';

    expect(() => {
      renderer.renderBlock(1, 0, color); // Top center
      renderer.renderBlock(0, 1, color); // Bottom left
      renderer.renderBlock(1, 1, color); // Bottom center
      renderer.renderBlock(2, 1, color); // Bottom right
    }).not.toThrow();
  });

  it('should render overlapping pieces correctly', () => {
    expect(() => {
      // First piece
      renderer.renderBlock(0, 0, '#ff0000');
      renderer.renderBlock(1, 0, '#ff0000');

      // Second piece (overlapping position)
      renderer.renderBlock(1, 0, '#00ff00');
      renderer.renderBlock(2, 0, '#00ff00');
    }).not.toThrow();
  });
});

// T031: Performance test for 200-block grid rendering
describe('3D Rendering Performance', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let renderer: Renderer3D;
  const CELL_SIZE = 30;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    ctx = canvas.getContext('2d')!;
    renderer = new Renderer3D(ctx, CELL_SIZE);
  });

  it('should render 200 blocks within 3ms', () => {
    const blockCount = 200;
    const blocks: Array<{ x: number; y: number; color: string }> = [];

    // Generate 200 random blocks
    for (let i = 0; i < blockCount; i++) {
      blocks.push({
        x: i % 10,
        y: Math.floor(i / 10),
        color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
      });
    }

    const startTime = performance.now();

    for (const block of blocks) {
      renderer.renderBlock(block.x, block.y, block.color);
    }

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(3);
    expect(blocks.length).toBe(200);
  });

  it('should maintain performance over multiple frames', () => {
    const blockCount = 200;
    const frameCount = 10;
    const frameTimes: number[] = [];

    // Generate blocks once
    const blocks: Array<{ x: number; y: number; color: string }> = [];
    for (let i = 0; i < blockCount; i++) {
      blocks.push({
        x: i % 10,
        y: Math.floor(i / 10),
        color: '#ff0000',
      });
    }

    // Render multiple frames
    for (let frame = 0; frame < frameCount; frame++) {
      const startTime = performance.now();

      for (const block of blocks) {
        renderer.renderBlock(block.x, block.y, block.color);
      }

      const endTime = performance.now();
      frameTimes.push(endTime - startTime);
    }

    // Calculate average
    const avgTime = frameTimes.reduce((sum, t) => sum + t, 0) / frameTimes.length;

    expect(avgTime).toBeLessThan(3);
    expect(Math.max(...frameTimes)).toBeLessThan(5); // No frame should exceed 5ms
  });

  it('should handle full grid (10x20 = 200 blocks) efficiently', () => {
    const gridWidth = 10;
    const gridHeight = 20;

    const startTime = performance.now();

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        renderer.renderBlock(x, y, '#00ff00');
      }
    }

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(3);
  });

  it('should render complex scene with varied colors efficiently', () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];
    const blockCount = 200;

    const startTime = performance.now();

    for (let i = 0; i < blockCount; i++) {
      const x = i % 10;
      const y = Math.floor(i / 10);
      const color = colors[i % colors.length]!;
      renderer.renderBlock(x, y, color);
    }

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(3);
  });
});
