# Quickstart: Colorful Visual Style with Progressive Difficulty System

**Feature**: 004-colorful-progression-system
**Date**: 2026-03-13
**Audience**: Developers implementing or maintaining this feature

## Overview

This guide helps developers understand the colorful theme architecture, scoring/leveling system, and glassmorphism rendering pipeline. Use this as a reference when implementing or debugging the feature.

---

## 1. Architecture Overview

### 1.1 Module Responsibilities

```
┌─────────────────────────────────────────────────────────────┐
│                    Feature Components                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Scoring    │  │   Leveling   │  │  Obstacle    │     │
│  │   System     │  │   System     │  │    Rows      │     │
│  │              │  │              │  │              │     │
│  │ scoring.ts   │  │ leveling.ts  │  │  grid.ts     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         ↓                  ↓                  ↓             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Game Controller (Game.ts)                │  │
│  │  - Orchestrates scoring, leveling, obstacle rows     │  │
│  │  - Manages game state transitions                    │  │
│  │  - Emits events for UI updates                       │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓                                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Rendering System (Renderer.ts)              │  │
│  │  - Colorful blocks (COLORFUL_PALETTE)                │  │
│  │  - Glassmorphism background (CSS backdrop-filter)    │  │
│  │  - Static gradient background                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Data Flow

```
User Input (Arrow Keys)
    ↓
InputHandler.ts
    ↓
Game.ts (moveLeft/moveRight/moveDown/rotate)
    ↓
Collision Detection → Line Clearing
    ↓
scoring.ts: calculateScore(linesCleared)
    ↓
Game.ts: score += points
    ↓
leveling.ts: shouldLevelUp(score, level)
    ↓
Game.ts: level += 1
    ↓
leveling.ts: shouldAddObstacleRow(level)
    ↓
grid.ts: insertObstacleRow(grid, obstacleRow)
    ↓
Renderer.ts: render(gameState)
    ↓
Canvas (Visual Output)
```

---

## 2. Key Concepts

### 2.1 Colorful Palette

**Location**: `src/config/colors.ts`

**Purpose**: Define vibrant colors for 7 Tetris blocks, replacing metallic theme.

**Usage**:
```typescript
import { COLORFUL_PALETTE } from '../config/colors';

// Get color for specific piece type
const color = COLORFUL_PALETTE[piece.type]; // e.g., '#00D9FF' for I-piece

// Use in rendering
ctx.fillStyle = color;
ctx.fillRect(x, y, width, height);
```

**Color Palette**:
- I (Cyan): `#00D9FF`
- O (Yellow): `#FFD700`
- T (Purple): `#B24BF3`
- S (Green): `#00FF7F`
- Z (Red): `#FF4757`
- J (Blue): `#3742FA`
- L (Orange): `#FF6348`

**Design Notes**:
- All colors are WCAG AA compliant (4.5:1 contrast ratio)
- High saturation (80-90%) for vibrant appearance
- Distinct hues for easy differentiation

---

### 2.2 Glassmorphism Effect

**Location**: `src/render/GlassRenderer.ts`, `src/render/styles.ts`

**Purpose**: Create semi-transparent blurred background for game area.

**CSS Implementation**:
```css
.game-area {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

/* Fallback for unsupported browsers */
@supports not (backdrop-filter: blur(10px)) {
  .game-area {
    background: rgba(255, 255, 255, 0.15);
  }
}
```

**Background Gradient**:
```css
body {
  background: linear-gradient(135deg,
    hsl(220, 70%, 95%) 0%,
    hsl(260, 60%, 92%) 50%,
    hsl(200, 65%, 94%) 100%
  );
}
```

**Performance Considerations**:
- Blur radius: 10px (balance between aesthetics and performance)
- Static gradient (no animation) to reduce GPU load
- Use `will-change: backdrop-filter` for GPU acceleration
- Monitor frame rate with PerformanceMonitor.ts

**Fallback Strategy**:
- If frame rate drops below 55fps: Disable backdrop-filter
- Use semi-transparent background only (no blur)
- Add UI toggle for glassmorphism effect

---

### 2.3 Scoring System

**Location**: `src/game/scoring.ts`

**Formula**: `score = linesCleared * 10 + (linesCleared - 1) * 5`

**Scoring Table**:
| Lines | Points | Calculation |
|-------|--------|-------------|
| 1 | 10 | 1×10 + 0×5 |
| 2 | 25 | 2×10 + 1×5 |
| 3 | 40 | 3×10 + 2×5 |
| 4 | 55 | 4×10 + 3×5 |

**Usage**:
```typescript
import { calculateScore } from './scoring';

// When lines are cleared
const linesCleared = 3;
const points = calculateScore(linesCleared); // Returns 40
this.state.score += points;
```

**Error Handling**:
```typescript
// Throws error if linesCleared < 1 or > 4
try {
  const points = calculateScore(0); // Invalid
} catch (error) {
  console.error(error); // "Invalid linesCleared: 0. Must be 1-4."
}
```

---

### 2.4 Leveling System

**Location**: `src/game/leveling.ts`

**Level Threshold Formula**: `threshold = targetLevel * 100 * 2`

**Level Progression**:
| Level | Threshold (Points) | Speed Multiplier |
|-------|-------------------|------------------|
| 0 | 0 (start) | 1x |
| 1 | 200 | 2x |
| 2 | 400 | 3x |
| 3 | 600 | 4x (max) |
| 4+ | 800+ | 4x + obstacle rows |

**Usage**:
```typescript
import { shouldLevelUp, getSpeedMultiplier, shouldAddObstacleRow } from './leveling';

// Check if player should level up
if (shouldLevelUp(this.state.score, this.state.level)) {
  this.state.level += 1;

  // Update speed
  const speedMultiplier = getSpeedMultiplier(this.state.level);

  // Check if obstacle row should be added
  if (shouldAddObstacleRow(this.state.level)) {
    const obstacleRow = generateObstacleRow(this.state.grid.width, COLORFUL_PALETTE);
    this.state.grid = insertObstacleRow(this.state.grid, obstacleRow);
  }
}
```

**Speed Calculation**:
```typescript
import { calculateFallInterval } from './leveling';

const BASE_FALL_SPEED = 1000; // 1 second per cell
const downKeyMultiplier = this.isDownKeyHeld ? 4 : 1;

const fallInterval = calculateFallInterval(
  BASE_FALL_SPEED,
  this.state.level,
  downKeyMultiplier
);

// Example: Level 2, down key held
// fallInterval = 1000 / (3 * 4) = 83ms per cell
```

---

### 2.5 Obstacle Rows

**Location**: `src/game/grid.ts`

**Purpose**: Add challenge at higher levels by inserting rows with random gaps from bottom.

**Generation**:
```typescript
import { generateObstacleRow } from './grid';
import { COLORFUL_PALETTE } from '../config/colors';

// Generate obstacle row with random gap
const obstacleRow = generateObstacleRow(10, Object.values(COLORFUL_PALETTE));

// Example output:
// ['#00D9FF', '#FFD700', null, '#B24BF3', '#00FF7F', '#FF4757', '#3742FA', '#FF6348', '#00D9FF', '#FFD700']
//                        ↑ Random gap position
```

**Insertion**:
```typescript
import { insertObstacleRow } from './grid';

try {
  const neertObstacleRow(this.state.grid, obstacleRow);
  this.state.grid = newGrid;
} catch (error) {
  // Game over if insertion causes blocks to exceed top
  this.state.status = 'gameover';
  this.onGameOver?.(this.state.score);
}
```

**Behavior**:
- Shifts all existing rows up by 1
- Inserts obstacle row at bottom (row 19)
- Throws error if any block exceeds row 0 (game over)
- Gap position is random (0 to width-1)
- Block colors are random from COLORFUL_PALETTE

---

## 3. Implementation Checklist

### 3.1 Phase 1: Setup

- [ ] Create `src/config/colors.ts` with COLORFUL_PALETTE
- [ ] Create `src/game/scoring.ts` with calculateScore()
- [ ] Create `src/game/leveling.ts` with level progression logic
- [ ] Update `src/game/grid.ts` with obstacle row functions

### 3.2 Phase 2: Game Logic

- [ ] Modify `Game.ts` to use calculateScore() on line clear
- [ ] Modify `Game.ts` to check shouldLevelUp() after scoring
- [ ] Modify `Game.ts` to add obstacle rows at level 3+
- [ ] Update speed calculation to use getSpeedMultiplier()
- [ ] Modify `InputHandler.ts` to set 4x multiplier on down key

### 3.3 Phase 3: Rendering

- [ ] Update `Renderer.ts` to use COLORFUL_PALETTE
- [ ] Modify `GlassRenderer.ts` to render glassmorphism background
- [ ] Update `styles.ts` with backdrop-filter CSS
- [ ] Add static gradient background to body element
- [ ] Remove metallic effects (gradients, shadows, highlights)

### 3.4 Phase 4: Testing

- [ ] Write unit tests for scoring.ts (6 tests)
- [ ] Write unit tests for leveling.ts (8 tests)
- [ ] Write unit tests for obstacle row generation (4 tests)
- [ ] Write integration tests for game progression (6 tests)
- [ ] Verify 80% code coverage
- [ ] Performance test: Verify 60fps with glassmorphism
- [ ] Performance test: Verify <50ms input latency at 16x speed

### 3.5 Phase 5: Polish

- [ ] Add performance toggle for glassmorphism effect
- [ ] Update UI to display current level
- [ ] Add visual feedback for level-up (optional)
- [ ] Update documentation (code comments)
- [ ] Update CLAUDE.md with new technologies

---

## 4. Testing Strategy

### 4.1 Unit Tests

**Run Tests**:
```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

**Test Files**:
- `tests/unit/scoring.test.ts`
- `tests/unit/leveling.test.ts`
- `tests/unit/obstacle-rows.test.ts`

**Example Test**:
```typescript
import { describe, it, expect } from 'vitest';
import { calculateScore } from '../src/game/scoring';

describe('calculateScore', () => {
  it('should return 10 points for 1 line', () => {
    expect(calculateScore(1)).toBe(10);
  });

  it('should return 25 points for 2 lines', () => {
    expect(calculateScore(2)).toBe(25);
  });

  it('should throw error for invalid input', () => {
    expect(() => calculateScore(0)).toThrow();
    expect(() => calculateScore(5)).toThrow();
  });
});
```

### 4.2 Integration Tests

**Test File**: `tests/integration/game-progression.test.ts`

**Scenarios**:
1. Clear 1 line → score increases by 10
2. Clear 4 lines → score increases by 55
3. Reach 200 points → level increases to 1
4. Reach level 3 → speed multiplier is 4x
5. Level up at level 3+ → obstacle row added
6. Obstacle row causes game over → status = 'gameover'

**Example Test**:
```typescript
import { describe, it, expect } from 'vitest';
import { Game } from '../src/game/Game';

describe('Game Progression', () => {
  it('should level up when reaching threshold', () => {
    const game = new Game();
    game.start();

    // Simulate clearing lines to reach 200 points
    // (4 lines × 5 times = 55 × 5 = 275 points)
    for (let i = 0; i < 5; i++) {
      // Clear 4 lines (55 points each)
      game.onLinesClear?.(4, [0, 1, 2, 3], []);
    }

    const state = game.getGameState();
    expect(state.score).toBe(275);
    expect(state.level).toBe(1); // Leveled up at 200 points
  });
});
```

### 4.3 Performance Tests

**Frame Rate Test**:
```typescript
import { PerformanceMonitor } from '../src/utils/PerformanceMonitor';

const monitor = new PerformanceMonitor();
monitor.start();

// Run game for 60 seconds
setTimeout(() => {
  const avgFps = monitor.getAverageFPS();
  expect(avgFps).toBeGreaterThanOrEqual(60);
}, 60000);
```

**Input Latency Test**:
```typescript
const startTime = performance.now();
game.moveLeft();
const endTime = performance.now();
const latency = endTime - startTime;

expect(latency).toBeLessThan(50); // <50ms requirement
```

---

## 5. Debugging Tips

### 5.1 Common Issues

**Issue**: Glassmorphism not rendering
- **Check**: Browser support for `backdrop-filter`
- **Solution**: Test in Chrome 76+, Firefox 103+, Safari 9+
- **Fallback**: Verify `@supports` rule is working

**Issue**: Frame rate drops below 60fps
- **Check**: PerformanceMonitor.ts output
- **Solution**: Disable backdrop-filter, use semi-transparent background only
- **Tool**: Chrome DevTools Performance tab

**Issue**: Obstacle row not appearing
- **Check**: Level is >= 3
- **Check**: `shouldAddObstacleRow()` returns true
- **Debug**: Add console.log in `insertObstacleRow()`

**Issue**: Scoring incorrect
- **Check**: `calculateScore()` input (1-4 only)
- **Check**: Score accumulation logic in Game.ts
- **Debug**: Add console.log in `onLinesClear` callback

### 5.2 Debug Tools

**Enable Debug Mode**:
```typescript
// In main.ts
const DEBUG = true;

if (DEBUG) {
  console.log('GameState:', game.getGameState());
  console.log('FPS:', performanceMonitor.getCurrentFPS());
}
```

**Performance Monitoring**:
```typescript
import { PerformanceMonitor } from './utils/PerformanceMonitor';

const monitor = new PerformanceMonitor();
monitor.start();

// Check frame rate
setInterval(() => {
  console.log('FPS:', monitor.getCurrentFPS());
}, 1000);
```

---

## 6. Next Steps

After implementing this feature:

1. **Update Constitution**: Amend Constitution VII to support multiple visual themes
2. **Performance Validation**: Run full performance test suite
3. **User Testing**: Gather feedback on colorful style and difficulty progression
4. **Future Work**: Consider theme system to allow users to switch between metallic and colorful styles

---

## 7. Resources

- **Spec**: [spec.md](./spec.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Constitution**: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)
- **WCAG Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **CSS backdrop-filter Support**: https://caniuse.com/css-backdrop-filter

---

**Quickstart Complete**: Ready for implementation. Good luck! 🎨🎮
