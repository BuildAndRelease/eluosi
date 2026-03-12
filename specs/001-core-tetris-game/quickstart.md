# Quickstart Guide: Core Tetris Game

**Feature**: Core Tetris Game
**Created**: 2026-03-12
**Purpose**: Get developers up and running quickly

---

## Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **Editor**: VS Code recommended (with TypeScript support)

---

## Quick Setup (5 minutes)

### 1. Clone and Install

```bash
cd /Users/ids/Desktop/WorkSpace/eluosi
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Verify Setup

You should see:
- Empty Canvas element on the page
- No TypeScript errors in terminal
- Hot reload working (edit `src/main.ts` and see changes)

---

## Project Structure

```
eluosi/
├── src/
│   ├── main.ts              # Entry point
│   ├── game/                # Core game logic
│   │   ├── Game.ts          # Main game controller
│   │   ├── Piece.ts         # Tetromino logic
│   │   ├── Grid.ts          # Play area
│   │   └── types.ts         # TypeScript interfaces
│   ├── render/              # Canvas rendering
│   │   └── Renderer.ts
│   ├── input/               # Keyboard handling
│   │   └── InputHandler.ts
│   ├── audio/               # Sound effects
│   │   └── SoundManager.ts
│   ├── storage/             # localStorage wrapper
│   │   └── StorageManager.ts
│   └── config/              # Constants
│       └── constants.ts
├── assets/sounds/           # Audio files
├── tests/                   # Unit + integration tests
└── index.html               # HTML entry point
```

---

## Development Workflow

### Running the Game

```bash
# Development mode (hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint TypeScript
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

---

## Key Files

### `src/main.ts`

Entry point that initializes the game:

```typescript
import { Game } from './game/Game';
import { Renderer } from './render/Renderer';
import { InputHandler } from './input/InputHandler';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const game = new Game();
const renderer = new Renderer(canvas);
const input = new InputHandler(game);

// Game loop
function gameLoop() {
  game.update();
  renderer.render(game.getGameState());
  requestAnimationFrame(gameLoop);
}

gameLoop();
```

### `src/game/types.ts`

Core TypeScript interfaces:

```typescript
export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameover';

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: PieceType;
  rotation: number;
  position: Position;
  shape: number[][];
  color: string;
}

export interface GameState {
  status: GameStatus;
  score: number;
  level: number;
  lines: number;
  grid: Grid;
  currentPiece: Piece | null;
  nextPiece: Piece;
  startTime: number;
  lockDelayTimer: number | null;
}
```

### `src/config/constants.ts`

Game configuration:

```typescript
export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;
export const CELL_SIZE = 30; // pixels

export const FALL_SPEEDS = [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100];
export const LOCK_DELAY = 500; // ms
export const LINE_CLEAR_ANIMATION_DURATION = 250; // ms

export const SCORE_VALUES = {
  1: 50,
  2: 300,
  3: 500,
  4: 1000
};

export const PIECE_COLORS = {
  I: '#e0e0e0', // Silver
  O: '#ffd700', // Gold
  T: '#9370db', // Purple
  S: '#32cd32', // Green
  Z: '#ff6347', // Red
  J: '#4169e1', // Blue
  L: '#ff8c00'  // Orange
};
```

---

## Common Tasks

### Adding a New Feature

1. Create feature branch: `git checkout -b feature/my-feature`
2. Write tests first (TDD): `tests/unit/my-feature.test.ts`
3. Implement feature: `src/game/my-feature.ts`
4. Run tests: `npm test`
5. Verify coverage: `npm run test:coverage` (must be ≥80%)
6. Lint and format: `npm run lint && npm run format`
7. Commit: `git commit -m "feat: add my feature"`

### Debugging

#### Chrome DevTools

1. Open DevTools (F12)
2. Go to Sources tab
3. Set breakpoints in TypeScript files
4. Refresh page to hit breakpoints

#### Performance Profiling

1. Open DevTools Performance tab
2. Click Record
3. Play game for 10-15 seconds
4. Stop recording
5. Check for:
   - Frame rate (should be 60fps)
   - Long tasks (should be <16ms)
   - Memory leaks (heap should be stable)

#### Memory Profiling

1. Open DevTools Memory tab
2. Take heap snapshot
3. Play game for 5 minutes
4. Take another snapshot
5. Compare snapshots (memory should be <50MB)

### Testing Strategies

#### Unit Tests

Test individual functions in isolation:

```typescript
import { describe, it, expect } from 'vitest';
import { isValidPosition } from '../game/collision';

describe('collision detection', () => {
  it('should detect left boundary collision', () => {
    const piece = createPiece('I', 0, { x: -1, y: 0 });
    const grid = createEmptyGrid();
    expect(isValidPosition(piece, grid)).toBe(false);
  });
});
```

#### Integration Tests

Test multiple components together:

```typescript
import { describe, it, expect } from 'vitest';
import { Game } from '../game/Game';

describe('game flow', () => {
  it('should clear line and update score', () => {
    const game = new Game();
    game.start();

    // Fill bottom row
    fillRow(game, 19);

    // Drop piece to complete line
    game.hardDrop();

    expect(game.getGameState().lines).toBe(1);
    expect(game.getGameState().score).toBe(50);
  });
});
```

---

## Troubleshooting

### TypeScript Errors

**Problem**: `Cannot find module './types'`

**Solution**: Check import path is correct and file exists

```typescript
// ❌ Wrong
import { Piece } from './types';

// ✅ Correct
import { Piece } from './game/types';
```

### Canvas Not Rendering

**Problem**: Black screen, no game visible

**Solution**: Check Canvas is properly initialized

```typescript
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
if (!canvas) {
  throw new Error('Canvas element not found');
}

const ctx = canvas.getContext('2d');
if (!ctx) {
  throw new Error('Could not get 2D context');
}
```

### Audio Not Playing

**Problem**: No sound effects

**Solution**: Check Web Audio API initialization

```typescript
// User interaction required to start AudioContext
document.addEventListener('click', () => {
  audioContext.resume();
}, { once: true });
```

### Performance Issues

**Problem**: Frame rate drops below 60fps

**Solution**: Profile and optimize

1. Check Chrome DevTools Performance tab
2. Look for long tasks (>16ms)
3. Optimize rendering (reduce redraws)
4. Use dirty rectangle technique

```typescript
// Only redraw changed cells
function renderDirtyRectangles(dirtyRects: Rect[]) {
  dirtyRects.forEach(rect => {
    ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    renderRect(rect);
  });
}
```

### localStorage Errors

**Problem**: `QuotaExceededError`

**Solution**: Handle gracefully

```typescript
try {
  localStorage.setItem('eluosi-game-data', JSON.stringify(data));
} catch (e) {
  if (e instanceof DOMException && e.name === 'QuotaExceededError') {
    console.warn('localStorage full, continuing without persistence');
  }
}
```

---

## Performance Targets

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Frame Rate | 60fps stable | Chrome DevTools Performance tab |
| Input Latency | <50ms | Manual testing with timestamp logging |
| Load Time | <2s | Chrome DevTools Network tab (Finish time) |
| Memory Usage | <50MB | Chrome DevTools Memory tab (heap snapshot) |
| Bundle Size | <500KB | Check `dist/` folder after `npm run build` |

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm test                 # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report

# Code Quality
npm run lint             # Check for linting errors
npm run lint:fix         # Fix linting errors automatically
npm run format           # Format code with Prettier
npm run type-check       # Check TypeScript types

# Utilities
npm run clean            # Clean dist/ and node_modules/
npm run analyze          # Analyze bundle size
```

---

## Next Steps

1. **Read the spec**: [spec.md](./spec.md)
2. **Review the plan**: [plan.md](./plan.md)
3. **Check the data model**: [data-model.md](./data-model.md)
4. **Explore the API**: [contracts/game-api.md](./contracts/game-api.md)
5. **Start coding**: Begin with Phase 2.1 (Project Setup)

---

## Getting Help

- **Constitution**: `.specify/memory/constitution.md` (project principles)
- **Spec**: `specs/001-core-tetris-game/spec.md` (requirements)
- **Plan**: `specs/001-core-tetris-game/plan.md` (implementation plan)
- **Issues**: Report bugs or ask questions in project issues

---

## Tips for Success

1. **Follow TDD**: Write tests first, then implement
2. **Keep it simple**: Avoid over-engineering
3. **Comment your code**: Explain WHY, not just WHAT
4. **Test in multiple browsers**: Don't just use Chrome
5. **Profile early**: Check performance from Day 4 onwards
6. **Commit often**: Small, focused commits
7. **Run tests before committing**: `npm test && npm run lint`
8. **Check coverage**: Maintain ≥80% coverage

---

## Example Session

```bash
# Day 1: Project Setup
npm install
npm run dev
# Verify empty Canvas renders

# Day 2: Core Logic
npm run test:watch
# Write tests for collision detection
# Implement collision detection
# Verify tests pass

# Day 3: More Logic
# Write tests for rotation
# Implement rotation with wall kicks
# Verify tests pass

# Day 4: Rendering
npm run dev
# Implement Canvas rendering
# Add metallic effects
# Check 60fps in DevTools

# Day 5: Input & Audio
# Add keyboard handlers
# Load sound effects
# Test input latency <50ms

# Day 6: Persistence
# Implement localStorage wrapper
# Test high score persistence
# Profile memory usage

# Day 7: Testing & Release
npm run test:coverage
npm run lint
npm run build
# Deploy to production
```
