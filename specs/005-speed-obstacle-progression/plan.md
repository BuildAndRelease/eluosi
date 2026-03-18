# Implementation Plan: Progressive Speed and Obstacle Difficulty System

**Branch**: `005-speed-obstacle-progression` | **Date**: 2026-03-13 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-speed-obstacle-progression/spec.md`

## Summary

Replace the existing 4-step linear speed system (1x→2x→3x→4x capped at level 3+) with a uniform 3-step ramp (1x→1.67x→2.33x→3x capped at level 3), and update the obstacle-row system (same trigger: level 4+; gap count changes from exactly 1 to random 1–3; obstacle row color changes to uniform dark navy for visual distinction). Changes are confined to `src/game/leveling.ts`, `src/config/constants.ts`, `src/game/obstacle-rows.ts`, and their tests. No new files required.

## Technical Context

**Language/Version**: TypeScript 5.6 (strict mode enabled)
**Primary Dependencies**: Zero runtime dependencies; Vite 6.0 (build only)
**Storage**: N/A (feature does not affect persistence)
**Testing**: Vitest 4.0.18
**Target Platform**: Browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**Project Type**: Browser game (pure frontend, HTML5 Canvas)
**Performance Goals**: 60fps stable; input latency <50ms
**Constraints**: Zero runtime dependencies; strict TypeScript; functions <50 lines; files <800 lines
**Scale/Scope**: Single-player local game; no backend

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| TypeScript strict mode | PASS | All changes remain in typed `.ts` files |
| Zero runtime dependencies | PASS | No new dependencies introduced |
| TDD (write tests first) | REQUIRED | Unit tests for `leveling.ts` and `obstacle-rows.ts` must be written before implementation |
| 80% code coverage | REQUIRED | Existing coverage must be maintained; new branches must be tested |
| Functions <50 lines | PASS | All modified functions remain small |
| Files <800 lines | PASS | No file will exceed limit |
| Immutability | PASS | Pure functions only; no mutation |
| No hardcoded values | REQUIRED | Speed constants go in `constants.ts`, not inline |
| ESLint/Prettier | REQUIRED | Run lint after changes |
| Performance: 60fps | PASS | Speed calculation is O(1), no render impact |
| Colorful theme preserved | PASS | No visual theme changes required |

No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/005-speed-obstacle-progression/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (affected files only)

```text
src/
├── config/
│   └── constants.ts          # UPDATE: speed multipliers + obstacle gap config
├── game/
│   ├── leveling.ts           # UPDATE: getSpeedMultiplier() + LEVEL_CONFIG
│   └── obstacle-rows.ts      # UPDATE: generateObstacleRow() (1–3 gaps)

tests/
├── unit/
│   ├── leveling.test.ts      # UPDATE: rewrite speed multiplier tests
│   ├── obstacle-rows.test.ts # UPDATE: rewrite gap-count tests
│   └── speed-control.test.ts # UPDATE: verify new multiplier values
└── integration/
    └── speed-control.test.ts  # UPDATE: end-to-end level → speed verification
```

**Structure Decision**: Single-project layout (existing). No new directories or files.

## Phase 0: Research

**Research file**: [research.md](research.md)

No external unknowns. All design decisions resolved in spec and clarifications. Research summarizes existing codebase state and change scope.

---

## Phase 1: Design

### Data Model Changes

**File**: [data-model.md](data-model.md)

No new entities. Changes are to computed values only:

| Entity | Field | Before | After |
|--------|-------|--------|-------|
| SpeedSystem | level 0 multiplier | 1x | 1x (unchanged) |
| SpeedSystem | level 1 multiplier | 2x | 1.67x |
| SpeedSystem | level 2 multiplier | 3x | 2.33x |
| SpeedSystem | level 3 multiplier | 4x (cap) | 3x (cap) |
| SpeedSystem | level 4+ multiplier | 4x | 3x (cap unchanged) |
| SpeedSystem | obstacle trigger level | 4 | 4 (unchanged) |
| ObstacleRow | gap count | exactly 1 | random 1–3 |
| LEVEL_CONFIG | MAX_SPEED_MULTIPLIER | 4 | 3 |
| LEVEL_CONFIG | OBSTACLE_ROW_START_LEVEL | 4 | 4 (unchanged) |

### Interface Contracts

This is a pure browser game with no external API. No contract files needed.

### Implementation Design

#### Change 1: `src/config/constants.ts`

Replace `SPEED_MULTIPLIERS` map with new values. Add `OBSTACLE_ROW_MIN_GAPS` and `OBSTACLE_ROW_MAX_GAPS` constants.

```text
SPEED_MULTIPLIERS:
  0 → 1.0   (unchanged)
  1 → 1.67  (was 2)
  2 → 2.33  (was 3)
  3 → 3.0   (was 4; new cap)
  4+ → 3.0  (cap unchanged at 3)

New constants:
  OBSTACLE_ROW_MIN_GAPS = 1
  OBSTACLE_ROW_MAX_GAPS = 3
  MAX_SPEED_MULTIPLIER = 3   (was 4)
```

#### Change 2: `src/game/leveling.ts`

Update `getSpeedMultiplier()` with new formula and cap:

```text
Old: Math.min(level + 1, 4)
New: level >= 3 ? 3 : parseFloat((1 + level * (2 / 3)).toFixed(2))
   → level 0: 1.0
   → level 1: 1.67
   → level 2: 2.33
   → level 3+: 3.0 (exact — guarded by level >= 3 branch)
```

**Note on floating-point**: `1 + 3 * (2/3)` yields `2.999...` in IEEE 754, not `3.0`. The `level >= 3 ? 3` guard ensures the cap is always exactly `3` for levels 3+. The `toFixed(2)` plus `parseFloat` round intermediate values to 2 decimal places (1.67, 2.33) for test-assertion friendliness.

Update `LEVEL_CONFIG.MAX_SPEED_MULTIPLIER` from `4` to `3`.

`shouldAddObstacleRow()` and `getObstacleRowCount()` remain **unchanged** (still level 4+).

#### Change 3: `src/game/obstacle-rows.ts`

Update `generateObstacleRow()` to place 1–3 random gaps instead of exactly 1:

```text
Old: place exactly 1 null at random position
New: choose random gap count in [1, 3], then place gaps at random distinct positions
```

Update `validateObstacleRow()` to accept 1–3 gaps (not exactly 1).

#### Change 4: Tests (written FIRST — TDD)

Test files to update:

1. `tests/unit/leveling.test.ts`
   - Replace speed multiplier assertions: level 1 → 1.67, level 2 → 2.33, level 3 → 3
   - Replace cap assertion: previously `getSpeedMultiplier(3) === 4`, now `=== 3`
   - Update `LEVEL_CONFIG.MAX_SPEED_MULTIPLIER` check: `3` not `4`
   - Keep all threshold, `calculateLevel`, and obstacle-row-trigger tests unchanged

2. `tests/unit/obstacle-rows.test.ts`
   - Replace "exactly one gap" test with "1–3 gaps" test
   - Update `validateObstacleRow` tests: now valid with 1, 2, or 3 gaps; invalid with 0 or 4+

3. `tests/unit/speed-control.test.ts`
   - Update expected speed values for levels 1–3

4. `tests/integration/speed-control.test.ts`
   - Verify end-to-end: at level 1, drop interval = base / 1.67; at level 2 = base / 2.33; at level 3 = base / 3

### Quickstart

**File**: [quickstart.md](quickstart.md)

```bash
# Run tests
npm test

# Run only affected test files
npx vitest run tests/unit/leveling.test.ts tests/unit/obstacle-rows.test.ts

# Build
npm run build

# Lint
npm run lint
```

## Constitution Check (Post-Design)

All gates pass:
- No new runtime dependencies
- Changes confined to 2 source files + 4 test files
- All functions remain <50 lines, pure, immutable
- Constants extracted to `constants.ts` (no magic numbers inline)
- TDD order enforced: tests written → RED → implement → GREEN → lint

## Complexity Tracking

> No constitution violations. Section not required.
