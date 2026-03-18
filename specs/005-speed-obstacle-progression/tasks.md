# Tasks: Progressive Speed and Obstacle Difficulty System

**Input**: Design documents from `/specs/005-speed-obstacle-progression/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, quickstart.md ✓

**TDD**: Constitution mandates TDD for core game logic. Tests MUST be written and FAIL before implementation.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup (Baseline Verification)

**Purpose**: Confirm the current test suite is green before any changes. Establishes a clean starting point.

- [ ] T001 Run `npm test` and confirm all existing tests pass before making any changes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No new shared infrastructure is needed. The existing project structure is complete. This phase is a documentation-only checkpoint.

**⚠️ CRITICAL**: Changes to `src/config/constants.ts` in Phase 3 affect both US1 and US2. Complete US1 constants changes before starting US2.

**Checkpoint**: Baseline green — user story implementation can begin.

---

## Phase 3: User Story 1 - Smooth Speed Progression (Priority: P1) 🎯 MVP

**Goal**: Replace the existing 1x→2x→3x→4x speed system with a uniform 1x→1.67x→2.33x→3x ramp capped at level 3.

**Independent Test**: Start a new game, earn 200 points (level 1) and verify drop speed is ~1.67x base; earn 400 points (level 2) → ~2.33x; earn 600 points (level 3) → 3x; earn 800 points (level 4) → still 3x (no increase).

### Tests for User Story 1 (TDD — write FIRST, must FAIL before implementation)

> **Write these tests FIRST and confirm RED before touching source files**

- [ ] T002 [US1] Rewrite speed multiplier assertions in `tests/unit/leveling.test.ts`: update `getSpeedMultiplier(1)` expected value from `2` to `~1.67`, `getSpeedMultiplier(2)` from `3` to `~2.33`, `getSpeedMultiplier(3)` from `4` to `3`, cap test from `4` to `3`; update `LEVEL_CONFIG.MAX_SPEED_MULTIPLIER` assertion from `4` to `3`; update integration progression test at end of file
- [ ] T003 [P] [US1] Update speed multiplier expected values in `tests/unit/speed-control.test.ts` to match new level 1=1.67x, level 2=2.33x, level 3=3x values
- [ ] T004 [P] [US1] Update speed multiplier expected values in `tests/integration/speed-control.test.ts` to verify drop intervals match new multipliers at each level
- [ ] T005 [US1] Run `npm test` and confirm T002–T004 tests FAIL (RED) with current source code

### Implementation for User Story 1

- [ ] T006 [US1] Update `SPEED_MULTIPLIERS` map in `src/config/constants.ts`: set level 1 to `1.67`, level 2 to `2.33`, level 3 to `3`; update `MAX_SPEED_MULTIPLIER` comment from 4 to 3 (depends on T005 confirming RED)
- [ ] T007 [US1] Update `getSpeedMultiplier()` in `src/game/leveling.ts`: replace `Math.min(level + 1, 4)` with `level >= 3 ? 3 : parseFloat((1 + level * (2 / 3)).toFixed(2))`; update function JSDoc to reflect new values (level 0=1x, level 1=1.67x, level 2=2.33x, level 3+=3x); add comment explaining IEEE 754 guard
- [ ] T008 [US1] Update `LEVEL_CONFIG.MAX_SPEED_MULTIPLIER` constant in `src/game/leveling.ts` from `4` to `3`
- [ ] T009 [US1] Run `npm test` and confirm T002–T004 tests now PASS (GREEN); confirm no regressions in other tests

**Checkpoint**: User Story 1 fully functional. Speed ramp is uniform and capped at 3x at level 3.

---

## Phase 4: User Story 2 - Obstacle Rows With Variable Gaps (Priority: P1)

**Goal**: Update obstacle row generation to place 1–3 random gaps per row (instead of exactly 1), and update validation accordingly.

> **Note**: The obstacle row insertion behavior (push-up on level 4+, garbage-row style) is **already implemented** in `insertObstacleRow()`. This phase only changes the gap count from exactly 1 to a random 1–3. Do NOT re-implement insertion logic.

**Independent Test**: Reach level 4, observe obstacle row at bottom. Over 20+ level-up events (can be triggered via test), confirm every added row has between 1 and 3 null cells and that gap positions vary.

### Tests for User Story 2 (TDD — write FIRST, must FAIL before implementation)

> **Write these tests FIRST and confirm RED before touching source files**

- [ ] T010 [US2] Rewrite gap-count assertions in `tests/unit/obstacle-rows.test.ts`: replace "should have exactly one gap (null)" test with "should have between 1 and 3 gaps" (`gapCount >= 1 && gapCount <= 3`); update `validateObstacleRow` tests to mark rows with 1, 2, or 3 gaps as valid, and rows with 0 or 4+ gaps as invalid
- [ ] T011 [US2] Run `npm test` and confirm T010 tests FAIL (RED) with current source code (current code asserts exactly 1 gap)

### Implementation for User Story 2

- [ ] T012 [US2] Add `OBSTACLE_ROW_MIN_GAPS = 1` and `OBSTACLE_ROW_MAX_GAPS = 3` constants to `src/config/constants.ts` (depends on T011 confirming RED)
- [ ] T013 [US2] Rewrite `generateObstacleRow()` in `src/game/obstacle-rows.ts`: (1) pick random `gapCount` in `[OBSTACLE_ROW_MIN_GAPS, OBSTACLE_ROW_MAX_GAPS]`; (2) select `gapCount` distinct random column indices; (3) fill all other columns with random palette colors; (4) update JSDoc to reflect 1–3 gaps
- [ ] T014 [US2] Update `validateObstacleRow()` in `src/game/obstacle-rows.ts`: replace `gapCount === 1` with `gapCount >= 1 && gapCount <= 3`; update JSDoc accordingly
- [ ] T015 [US2] Run `npm test` and confirm T010 tests PASS (GREEN); explicitly verify no regressions in: (a) `insertObstacleRow` tests in `tests/unit/obstacle-rows.test.ts` (FR-004 push-up behavior), (b) line-clear and gravity tests in `tests/integration/gameplay-loop.test.ts` (FR-007, FR-008), and (c) `insertObstacleRow` game-over throw test (FR-009)

**Checkpoint**: User Stories 1 AND 2 fully functional and tested independently.

---

## Phase 5: User Story 3 - Obstacle Row Visual Distinction (Priority: P2)

**Goal**: Obstacle row cells must be visually distinguishable from normal player-placed Tetris blocks at a glance.

**Independent Test**: Reach level 4 in a running game. Observe the bottom row — it must have a clearly different appearance from the colorful Tetris piece cells above it.

### Tests for User Story 3 (TDD — write FIRST, must FAIL before implementation)

> **Write these tests FIRST and confirm RED before touching source files**

- [ ] T016 [US3] Add visual distinction test to `tests/unit/obstacle-rows.test.ts`: assert that all non-null cells in generated obstacle rows equal `OBSTACLE_ROW_CELL_COLOR` (use the string literal `'#1a1a3e'` as expected value in the test until the constant exists)
- [ ] T017 [US3] Run `npm test` and confirm T016 test FAILS (RED) — current implementation fills cells with random palette colors, not `#1a1a3e`

### Implementation for User Story 3

- [ ] T018 [US3] Add `OBSTACLE_ROW_CELL_COLOR = '#1a1a3e'` constant to `src/config/constants.ts` (dark navy — clearly distinct from vibrant Tetris piece palette colors and compliant with constitution "no gray for blocks" rule; update T016 test to use the imported constant instead of the string literal)
- [ ] T019 [US3] Update `generateObstacleRow()` in `src/game/obstacle-rows.ts` to fill non-gap cells with `OBSTACLE_ROW_CELL_COLOR` instead of random palette colors; update JSDoc to document the visual distinction
- [ ] T020 [US3] Run `npm test` and confirm T016 test now PASSES (GREEN); confirm no regressions introduced; then manually smoke-test: reach level 4 in the running game and verify the bottom obstacle row is immediately visually distinguishable from Tetris piece colors within 2 seconds (SC-005 — manual verification required, not automatable)

**Checkpoint**: All three user stories fully functional. Obstacle rows are visually distinct.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass across all changes.

- [ ] T021 [P] Run `npm run type-check` and fix any TypeScript strict-mode errors introduced by the changes
- [ ] T022 [P] Run `npm run lint` and fix any ESLint errors or warnings
- [ ] T023 Run `npm test` for full suite — confirm 100% pass rate with no regressions
- [ ] T024 Run `npm run build` and confirm production build succeeds with no errors
- [ ] T025 [P] Review all modified functions for JSDoc comment completeness: `getSpeedMultiplier()`, `generateObstacleRow()`, `validateObstacleRow()`, and updated constants in `constants.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — documentation checkpoint only
- **Phase 3 (US1)**: Depends on Phase 2 — TDD tests written first (T002–T005), then implement (T006–T009)
- **Phase 4 (US2)**: Depends on Phase 3 completion (shared `constants.ts` file — avoid simultaneous edits)
- **Phase 5 (US3)**: Depends on Phase 4 completion (modifies same `obstacle-rows.ts` file)
- **Phase 6 (Polish)**: Depends on all user story phases complete

### User Story Dependencies

- **US1 (P1)**: Standalone — modifies `leveling.ts` and `constants.ts` speed section only
- **US2 (P1)**: Depends on US1 completion (shares `constants.ts`); modifies `obstacle-rows.ts`
- **US3 (P2)**: Depends on US2 completion (modifies same `obstacle-rows.ts`)

### Within Each User Story

1. Write tests → Confirm RED
2. Implement → Confirm GREEN
3. No proceeding until GREEN confirmed

### Parallel Opportunities

- T003 and T004 can run in parallel (different test files, no dependencies)
- T020 and T021 (type-check and lint) can run in parallel
- T018 can be written in parallel with T016–T017

---

## Parallel Example: User Story 1

```bash
# Write all US1 tests in parallel (different files):
Task: "Update tests/unit/leveling.test.ts speed assertions (T002)"
Task: "Update tests/unit/speed-control.test.ts (T003)"
Task: "Update tests/integration/speed-control.test.ts (T004)"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Baseline verification
2. Complete Phase 3: US1 speed ramp (TDD)
3. Complete Phase 4: US2 gap count (TDD)
4. **STOP and VALIDATE**: Both core mechanics work
5. Polish (Phase 6)

### Full Delivery (All 3 Stories)

1. Complete MVP above
2. Add Phase 5: US3 visual distinction
3. Final polish pass

### Single Developer Order

T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012 → T013 → T014 → T015 → T016 → T017 → T018 → T019 → T020 → T021 → T022 → T023 → T024 → T025

---

## Notes

- [P] tasks = different files, no dependencies on other incomplete tasks in same phase
- TDD is MANDATORY per constitution — never skip the RED confirmation step
- `constants.ts` is a shared file — complete US1 constants changes before starting US2
- The `validateObstacleRow()` function is used in tests only; updating it is safe
- `Game.ts` drop-interval formula is **not touched** — only multiplier values change
- `shouldAddObstacleRow()` and `getObstacleRowCount()` are **not touched** — logic unchanged
- `insertObstacleRow()` is **not touched** — garbage-row push behavior is already correct
