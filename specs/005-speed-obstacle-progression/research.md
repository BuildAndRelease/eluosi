# Research: Progressive Speed and Obstacle Difficulty System

**Feature**: 005-speed-obstacle-progression
**Date**: 2026-03-13

## Existing Codebase State

### Speed System (Current — to be replaced)

**File**: `src/game/leveling.ts:57-63`

```typescript
// Current implementation
export function getSpeedMultiplier(level: number): number {
  return Math.min(level + 1, 4); // 1x, 2x, 3x, 4x (capped)
}
```

**File**: `src/config/constants.ts:62-68`

```typescript
export const SPEED_MULTIPLIERS = {
  0: 1, 1: 2, 2: 3, 3: 4  // cap at 4
} as const;
```

**Drop speed formula** (`src/game/Game.ts:214-230`):
```
adjustedFallSpeed = baseFallSpeed[level] / (levelMultiplier * downKeyMultiplier)
```
This formula is unchanged. Only `levelMultiplier` values change.

### Obstacle Row System (Current — gap count to change)

**File**: `src/game/obstacle-rows.ts:15-34`

- Currently generates exactly 1 gap (null) at a random position
- `validateObstacleRow()` currently checks for exactly 1 null
- `insertObstacleRow()` — unchanged; garbage-row push behavior already implemented correctly
- Trigger level: 4+ (unchanged per spec)

### Base Fall Speeds (Unchanged)

**File**: `src/config/constants.ts:22-33`

```
Level 0: 1000ms, Level 1: 900ms, Level 2: 800ms, Level 3: 700ms ...
```

These values are NOT changed. The new speed multiplier is applied on top, same as before.

## Decisions

### Decision 1: Speed Multiplier Formula

- **Decision**: `level >= 3 ? 3 : parseFloat((1 + level * (2 / 3)).toFixed(2))`
- **Rationale**: Produces clean values: level 0 → 1.0, level 1 → 1.67, level 2 → 2.33, level 3+ → 3 (exact). The `level >= 3 ? 3` guard avoids IEEE 754 floating-point error where `1 + 3 * (2/3) = 2.9999999999999998` instead of `3.0`. `toFixed(2)` rounds intermediate levels to 2 decimal places for predictable test assertions.
- **Alternatives considered**:
  - `Math.min(1 + level * (2/3), 3)`: Fails at level 3 due to IEEE 754 — yields `2.999...` not `3.0`
  - Lookup table `[1, 5/3, 7/3, 3][Math.min(level, 3)]`: Equivalent and safe, slightly less self-documenting

### Decision 2: Obstacle Row Gap Count

- **Decision**: Random 1–3 gaps per row (count and positions randomized per row)
- **Rationale**: Confirmed in clarification Q3. Variable gap count adds strategic variety.
- **Implementation**: Pick random count in `[1, 3]`, then pick that many distinct random column indices to set null.
- **Alternatives considered**:
  - Always 1 gap (current behavior): Too predictable at high levels
  - Always 3 gaps: Too easy to clear

### Decision 3: validateObstacleRow Update

- **Decision**: Update `validateObstacleRow()` to accept 1–3 gaps
- **Rationale**: The existing function is used in tests to verify correctness. It must reflect the new gap range to remain useful.
- **New check**: `gapCount >= 1 && gapCount <= 3`

### Decision 4: No Changes to Obstacle Trigger Level

- **Decision**: Obstacle rows still start at level 4 (unchanged)
- **Rationale**: Spec states "3级后续每升一级底部出现一个障碍行" (after level 3, each level-up adds one obstacle row). Level 4 is the first level after level 3. Existing `shouldAddObstacleRow(level >= 4)` logic is correct.

### Decision 5: LEVEL_CONFIG.MAX_SPEED_MULTIPLIER

- **Decision**: Update from `4` to `3`
- **Rationale**: The constant is referenced in tests (`getSpeedMultiplier(3) === LEVEL_CONFIG.MAX_SPEED_MULTIPLIER`). Must be kept in sync.

## Change Impact Matrix

| File | Change Type | Risk | Notes |
|------|------------|------|-------|
| `src/config/constants.ts` | Modify constants | Low | No logic, just values |
| `src/game/leveling.ts` | Modify pure function | Low | Pure function, fully testable |
| `src/game/obstacle-rows.ts` | Modify pure function | Low | Randomness tested statistically |
| `tests/unit/leveling.test.ts` | Rewrite speed tests | Low | Values change, structure same |
| `tests/unit/obstacle-rows.test.ts` | Update gap assertions | Low | Change exact-1 to 1-3 range |
| `tests/unit/speed-control.test.ts` | Update expected values | Low | Values change only |
| `tests/integration/speed-control.test.ts` | Update expected values | Low | Values change only |
| `src/game/Game.ts` | No change | None | Formula unchanged |

## Conclusion

All NEEDS CLARIFICATION items resolved. No external dependencies, libraries, or APIs to research. Changes are surgical, low-risk modifications to two pure-function source files and four test files.
