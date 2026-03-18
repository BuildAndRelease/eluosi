# Data Model: Progressive Speed and Obstacle Difficulty System

**Feature**: 005-speed-obstacle-progression
**Date**: 2026-03-13

## Overview

No new entities. This feature modifies computed values within existing entities. The `GameState`, `Grid`, and `Piece` interfaces are untouched.

## Modified Computed Values

### SpeedMultiplier

| Level | Before (feature 004) | After (feature 005) |
|-------|---------------------|---------------------|
| 0     | 1x                  | 1x                  |
| 1     | 2x                  | 1.67x (2/3 step)    |
| 2     | 3x                  | 2.33x (2/3 step)    |
| 3     | 4x (cap)            | 3x (cap)            |
| 4+    | 4x (cap)            | 3x (cap)            |

**Formula**: `Math.min(1 + (level * (2/3)), 3)`

**Drop interval formula** (in `Game.ts` — unchanged):
```
dropIntervalMs = FALL_SPEEDS[level] / (speedMultiplier * downKeyMultiplier)
```

### ObstacleRow

| Attribute | Before (feature 004) | After (feature 005) |
|-----------|---------------------|---------------------|
| Trigger level | 4+ | 4+ (unchanged) |
| Gap count | exactly 1 | random 1–3 |
| Gap positions | 1 random column | 1–3 distinct random columns |
| Visual style | random palette colors | random palette colors (unchanged) |
| Insertion behavior | push rows up (garbage) | push rows up (garbage, unchanged) |

**Gap generation algorithm**:
1. Choose `gapCount` randomly from `[1, 2, 3]` (uniform)
2. Shuffle column indices `[0..9]` and pick first `gapCount` as gap positions
3. Set those positions to `null`; fill remainder with random palette colors

### Constants (src/config/constants.ts)

| Constant | Before | After |
|----------|--------|-------|
| `SPEED_MULTIPLIERS[1]` | `2` | `1.67` |
| `SPEED_MULTIPLIERS[2]` | `3` | `2.33` |
| `SPEED_MULTIPLIERS[3]` | `4` | `3` |
| `MAX_SPEED_MULTIPLIER` (in LEVEL_CONFIG) | `4` | `3` |
| `OBSTACLE_ROW_MIN_GAPS` | (new) | `1` |
| `OBSTACLE_ROW_MAX_GAPS` | (new) | `3` |

## Unchanged Entities

- `GameState` interface — no field changes
- `Grid` interface — no field changes
- `Piece` interface — no field changes
- `FALL_SPEEDS` array — no value changes
- Level threshold formula (`targetLevel * 100 * 2`) — unchanged
- `shouldAddObstacleRow()` logic — unchanged
- `getObstacleRowCount()` logic — unchanged
- `insertObstacleRow()` logic — unchanged
- Scoring table — unchanged

## Validation Rules

### Speed Multiplier
- Must be ≥ 1.0 at all levels
- Must be ≤ 3.0 at all levels
- Must be monotonically non-decreasing with level
- At level 3+, must equal exactly 3.0

### Obstacle Row
- Gap count must be in range [1, 3] inclusive
- Gap positions must be distinct column indices within [0, GRID_WIDTH-1]
- Non-gap cells must be non-null (valid hex color)
- Row width must equal GRID_WIDTH (10)
