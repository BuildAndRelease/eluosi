# Data Model: Colorful Visual Style with Progressive Difficulty System

**Feature**: 004-colorful-progression-system
**Date**: 2026-03-13
**Status**: Complete

## Overview

This document defines the data structures, state management, and entity relationships for the colorful visual style and progressive difficulty system. All changes maintain immutability principles and zero-dependency constraints.

---

## 1. Core Entities

### 1.1 GameState (Extended)

**Purpose**: Complete game state including new level and scoring fields

**Current Structure** (from `src/game/types.ts`):
```typescript
export interface GameState {
  status: GameStatus;
  score: number;
  level: number;        // ✅ Already exists
  lines: number;
  grid: Grid;
  currentPiece: Piece | null;
  nextPiece: Piece;
  startTime: number;
  lockDelayTimer: number | null;
}
```

**Changes Required**: ✅ **NO CHANGES** - `level` field already exists in GameState

**Validation Rules**:
- `level`: Non-negative integer, starts at 0, increases monotonically
- `score`: Non-negative integer, starts at 0, increases monotonically
- `lines`: Non-negative integer, tracks total lines cleared
- Level and score never decrease (cumulative progression)

---

### 1.2 Grid (Extended)

**Purpose**: Game grid with obstacle row generation capability

**Current Structure** (from `src/game/types.ts`):
```typescript
export interface Grid {
  cells: (string | null)[][];  // null = empty, string = hex color
  width: number;                // 10 columns
  height: number;               // 20 rows
}
```

**Changes Required**: ✅ **NO CHANGES** - Existing structure supports obstacle rows

**New Functions** (in `src/game/grid.ts`):
```typescript
/**
 * Generate obstacle row with random gap
 * @param width Grid width (typically 10)
 * @param colorPalette Array of hex color codes
 * @returns Row array with one null (gap) and colored blocks
 */
export function generateObstacleRow(
  width: number,
  colorPalette: string[]
): (string | null)[];

/**
 * Insert obstacle row at bottom and shift existing rows up
 * @param grid Current grid state
 * @param obstacleRow Generated obstacle row
 * @returns New grid with obstacle row inserted
 * @throws Error if insertion causes game over (blocks exceed top)
 */
export function insertObstacleRow(
  grid: Grid,
  obstacleRow: (string | null)[]
): Grid;
```

**Validation Rules**:
- Obstacle row must have exactly one `null` (gap)
- Gap position must be random (0 to width-1)
- Block colors must be from standard 7-color palette
- Insertion shifts all rows up by 1
- Game over if any block exceeds row 0 after insertion

---

### 1.3 ColorPalette (New)

**Purpose**: Define vibrant color palette for colorful blocks

**Structure** (new file: `src/config/colors.ts`):
```typescript
/**
 * Colorful block palette (replaces metallic colors)
 * Each color is vibrant (80-90% saturation) and WCAG AA compliant
 */
export const COLORFUL_PALETTE: Record<PieceType, string> = {
  I: '#00D9FF', // Cyan
  O: '#FFD700', // Yellow
  T: '#B24BF3', // Purple
  S: '#00FF7F', // Green
  Z: '#FF4757', // Red
  J: '#3742FA', // Blue
  L: '#FF6348', // Orange
};

/**
 * Background gradient for glassmorphism effect
 */
export const BACKGROUND_GRADIENT = `
  linear-gradient(135deg,
    hsl(220, 70%, 95%) 0%,
    hsl(260, 60%, 92%) 50%,
    hsl(200, 65%, 94%) 100%
  )
`;

/**
 * Glassmorphism CSS properties
 */
export const GLASSMORPHISM_STYLE = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)', // Safari support
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '12px',
};
```

**Validation Rules**:
- All colors must be valid hex codes (#RRGGBB format)
- Colors must meet WCAG AA contrast ratio (4.5:1 minimum)
- No black (#000000), white (#FFFFFF), or gray tones

---

### 1.4 ScoringConfig (New)

**Purpose**: Define scoring rules and level progression thresholds

**Structure** (new file: `src/game/scoring.ts`):
```typescript
/**
 * Scoring table for line clears
 * Formula: linesCleared * 10 + (linesCleared - 1) * 5
 */
export const SCORING_TABLE: Record<number, number> = {
  1: 10,  // 1 line
  2: 25,  // 2 lines
  3: 40,  // 3 lines
  4: 55,  // 4 lines
};

/**
 * Calculate score for cleared lines
 * @param linesCleared Number of lines cleared simultaneously (1-4)
 * @returns Points awarded
 */
export function calculateScore(linesCleared: number): number {
  if (linesCleared < 1 || linesCleared > 4) {
    throw new Error(`Invalid linesCleared: ${linesCleared}. Must be 1-4.`);
  }
  return SCORING_TABLE[linesCleared];
}

/**
 * Calculate level-up threshold
 * Formula: targetLevel * 100 * 2
 * @param targetLevel Level to reach (1, 2, 3, ...)
 * @returns Points required to reach target level
 */
export function getLevelThreshold(targetLevel: number): number {
  if (targetLevel < 1) {
    throw new Error(`Invalid targetLevel: ${targetLevel}. Must be >= 1.`);
  }
  return targetLevel * 100 * 2;
}

/**
 * Check if player should level up
 * @param currentScore Current score
 * @param currentLevel Current level
 * @returns True if score >= threshold for next level
 */
export function shouldLevelUp(currentScore: number, currentLevel: number): boolean {
  const nextLevel = currentLevel + 1;
  const threshold = getLevelThreshold(nextLevel);
  return currentScore >= threshold;
}
```

**Validation Rules**:
- `linesCleared` must be 1-4 (Tetris maximum)
- `targetLevel` must be >= 1 (level 0 is starting level)
- Score and level must be non-negative integers

---

### 1.5 LevelingConfig (New)

**Purpose**: Define level-based speed multipliers and obstacle row triggers

**Structure** (new file: `src/game/leveling.ts`):
```typescript
/**
 * Maximum speed multiplier (reached at level 3)
 */
export const MAX_SPEED_MULTIPLIER = 4;

/**
 * Level at which max speed is reached
 */
export const MAX_SPEED_LEVEL = 3;

/**
 * Calculate speed multiplier for current level
 * Formula: 1 + level (capped at MAX_SPEED_MULTIPLIER)
 * @param level Current level (0, 1, 2, 3, ...)
 * @returns Speed multiplier (1x, 2x, 3x, 4x max)
 */
export function getSpeedMultiplier(level: number): number {
  if (level < 0) {
    throw new Error(`Invalid level: ${level}. Must be >= 0.`);
  }
  return Math.min(1 + level, MAX_SPEED_MULTIPLIER);
}

/**
 * Check if obstacle row should be added on level up
 * @param newLevel Level just reached
 * @returns True if level >= MAX_SPEED_LEVEL (level 3+)
 */
export function shouldAddObstacleRow(newLevel: number): boolean {
  return newLevel >= MAX_SPEED_LEVEL;
}

/**
 * Calculate fall interval (milliseconds per cell)
 * @param baseInterval Base fall speed (e.g., 1000ms)
 * @param level Current level
 * @param downKeyMultiplier Multiplier when down key held (4x)
 * @returns Fall interval in milliseconds
 */
export function calculateFallInterval(
  baseInterval: number,
  level: number,
  downKeyMultiplier: number = 1
): number {
  const levelMultiplier = getSpeedMultiplier(level);
  return baseInterval / (levelMultiplier * downKeyMultiplier);
}
```

**Validation Rules**:
- `level` must be non-negative integer
- `baseInterval` must be positive number (milliseconds)
- `downKeyMultiplier` must be 1 (normal) or 4 (down key held)
- Fall interval must be >= 16ms (60fps minimum, ~16.67ms per frame)

---

## 2. State Transitions

### 2.1 Level Progression Flow

```
[Game Start]
    ↓
level = 0, score = 0
    ↓
[Player clears lines]
    ↓
score += calculateScore(linesCleared)
    ↓
[Check level up]
    ↓
if (shouldLevelUp(score, level))
    ↓
level += 1
    ↓
[Check obstacle row]
    ↓
if (shouldAddObstacleRow(level))
    ↓
obstacleRow = generateObstacleRow(grid.width, COLORFUL_PALETTE)
    ↓
grid = insertObstacleRow(grid, obstacleRow)
    ↓
[Check game over]
    ↓
if (grid has blocks in row 0)
    ↓
status = 'gameover'
```

**Invariants**:
- Level never decreases
- Score never decreases
- Speed multiplier never exceeds 4x
- Obstacle rows only added at level 3+
- Game over check performed after every obstacle row insertion

---

### 2.2 Speed Calculation Flow

```
[Game Loop Tick]
    ↓
levelMultiplier = getSpeedMultiplier(level)
    ↓
downKeyMultiplier = isDownKeyHeld ? 4 : 1
    ↓
fallInterval = calculateFallInterval(BASE_FALL_SPEED, level, downKeyMultiplier)
    ↓
[Wait fallInterval milliseconds]
    ↓
[Move piece down one cell]
```

**Examples**:
- Level 0, no down key: `1000 / (1 * 1) = 1000ms`
- Level 0, down key: `1000 / (1 * 4) = 250ms`
- Level 2, no down key: `1000 / (3 * 1) = 333ms`
- Level 2, down key: `1000 / (3 * 4) = 83ms`
- Level 3+, down key: `1000 / (4 * 4) = 62ms` (fastest possible)

---

### 2.3 Obstacle Row Insertion Flow

```
[Level Up to 3+]
    ↓
gapPosition = random(0, grid.width - 1)
    ↓
obstacleRow = []
    ↓
for each column x:
    if (x === gapPosition)
        obstacleRow[x] = null
    else
        obstacleRow[x] = randomColor(COLORFUL_PALETTE)
    ↓
newGrid = { ...grid }
    ↓
// Shift all rows up
for row = 0 to height - 2:
    newGrid.cells[row] = grid.cells[row + 1]
    ↓
// Insert obstacle row at bottom
newGrid.cells[height - 1] = obstacleRow
    ↓
// Check game over
if (newGrid.cells[0].some(cell => cell !== null))
    throw GameOverError
    ↓
return newGrid
```

**Edge Cases**:
- Gap at column 0 (left edge): Valid
- Gap at column 9 (right edge): Valid
- Multiple obstacle rows: Each has independent random gap
- Clearing obstacle row: Treated like normal row, scoring applies

---

## 3. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Game.ts                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ GameState                                               │ │
│  │ - status, score, level, lines, grid, pieces            │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ onLinesClear(count)                                     │ │
│  │   → score += calculateScore(count)                      │ │
│  │   → if (shouldLevelUp(score, level))                    │ │
│  │       → level += 1                                      │ │
│  │       → if (shouldAddObstacleRow(level))                │ │
│  │           → grid = insertObstacleRow(grid, ...)         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      Renderer.ts                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ render(gameState)                                       │ │
│  │   → drawBackground(BACKGROUND_GRADIENT)                 │ │
│  │   → drawGlassmorphism(GLASSMORPHISM_STYLE)             │ │
│  │   → drawGrid(grid, COLORFUL_PALETTE)                    │ │
│  │   → drawPiece(currentPiece, COLORFUL_PALETTE)           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    InputHandler.ts                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ onKeyDown('ArrowDown')                                  │ │
│  │   → game.setSpeedMultiplier(4)                          │ │
│  │                                                          │ │
│  │ onKeyUp('ArrowDown')                                    │ │
│  │   → game.setSpeedMultiplier(1)                          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Immutability Patterns

All state updates follow immutability principles:

```typescript
// ❌ BAD: Mutating existing state
function addObstacleRow(grid: Grid): void {
  grid.cells.unshift(generateObstacleRow(grid.width));
  grid.cells.pop();
}

// ✅ GOOD: Creating new state
function addObstacleRow(grid: Grid): Grid {
  const obstacleRow = generateObstacleRow(grid.width, COLORFUL_PALETTE);
  const newCells = [
    ...grid.cells.slice(1), // Shift rows up
    obstacleRow,            // Add at bottom
  ];
  return {
    ...grid,
    cells: newCells,
  };
}
```

**Benefits**:
- Easier debugging (state history preserved)
- Enables undo/replay functionality (future feature)
- Prevents accidental mutations
- Aligns with functional programming principles

---

## 5. Performance Considerations

### 5.1 Memory Usage

| Entity | Size Estimate | Count | Total |
|--------|---------------|-------|-------|
| GameState | ~2KB | 1 | 2KB |
| Grid (10×20) | ~4KB | 1 | 4KB |
| ColorPalette | ~200B | 1 | 200B |
| Obstacle Row | ~200B | 1/level | ~2KB (max 10 levels) |
| **Total** | | | **~8KB** |

**Impact**: Negligible memory overhead (<1% of 80MB budget)

### 5.2 Computation Complexity

| Operation | Complexity | Frequency | Impact |
|-----------|------------|-----------|--------|
| calculateScore() | O(1) | Per line clear | Negligible |
| shouldLevelUp() | O(1) | Per line clear | Negligible |
| getSpeedMultiplier() | O(1) | Per frame (60fps) | Negligible |
| generateObstacleRow() | O(n) | Per level-up (rare) | Negligible |
| insertObstacleRow() | O(n*m) | Per level-up (rare) | Negligible |

**Impact**: All operations are O(1) or O(n) with small n (grid width = 10). No performance concerns.

---

## 6. Testing Strategy

### 6.1 Unit Tests

**scoring.test.ts**:
- `calculateScore(1)` returns 10
- `calculateScore(2)` returns 25
- `calculateScore(3)` returns 40
- `calculateScore(4)` returns 55
- `calculateScore(0)` throws error
- `calculateScore(5)` throws error

**leveling.test.ts**:
- `getLevelThreshold(1)` returns 200
- `getLevelThreshold(2)` returns 400
- `shouldLevelUp(200, 0)` returns true
- `shouldLevelUp(199, 0)` returns false
- `getSpeedMultiplier(0)` returns 1
- `getSpeedMultiplier(3)` returns 4
- `getSpeedMultiplier(5)` returns 4 (capped)
- `shouldAddObstacleRow(2)` returns false
- `shouldAddObstacleRow(3)` returns true

**obstacle-rows.test.ts**:
- `generateObstacleRow(10)` returns array with exactly one null
- Gap position is random (test 100 iterations, verify distribution)
- Block colors are from COLORFUL_PALETTE
- `insertObstacleRow()` shifts rows up correctly
- `insertObstacleRow()` throws error if game over

### 6.2 Integration Tests

**game-progression.test.ts**:
- Clear 1 line → score increases by 10
- Clear 4 lines → score increases by 55
- Reach 200 points → level increases to 1
- Reach level 3 → speed multiplier is 4x
- Level up at level 3+ → obstacle row added
- Obstacle row insertion causes game over → status = 'gameover'

---

## Summary

**Data Model Changes**:
- ✅ GameState: No changes needed (level field exists)
- ✅ Grid: No changes needed (supports obstacle rows)
- ✅ New: ColorPalette (colors.ts)
- ✅ New: ScoringConfig (scoring.ts)
- ✅ New: LevelingConfig (leveling.ts)

**Key Principles**:
- Immutability: All state updates create new objects
- Pure Functions: Scoring and leveling logic is side-effect free
- Type Safety: Strict TypeScript types for all entities
- Performance: O(1) operations for critical path (game loop)

**Next Steps**:
- Phase 1: Create quickstart.md
- Phase 2: Implement scoring.ts and leveling.ts
- Phase 2: Modify Game.ts to use new modules
- Phase 2: Update Renderer.ts for colorful blocks
- Phase 2: Write comprehensive tests (80% coverage)

---

**Data Model Complete**: Ready for implementation phase.
