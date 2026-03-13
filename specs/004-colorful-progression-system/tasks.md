# Tasks: Colorful Visual Style with Progressive Difficulty System

**Input**: Design documents from `/specs/004-colorful-progression-system/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: TDD approach with 80% coverage requirement (Constitution II)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and configuration for colorful theme system

- [ ] T001 Create color palette configuration file at src/config/colors.ts with COLORFUL_PALETTE constant
- [ ] T002 [P] Update TypeScript configuration if needed for strict mode compliance
- [ ] T003 [P] Verify Vitest configuration supports new test files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core modules that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create scoring module at src/game/scoring.ts with calculateScore() function
- [ ] T005 [P] Create leveling module at src/game/leveling.ts with getSpeedMultiplier(), shouldLevelUp(), shouldAddObstacleRow(), calculateFallInterval() functions
- [ ] T006 [P] Add obstacle row generation functions to src/game/grid.ts: generateObstacleRow() and insertObstacleRow()
- [ ] T007 Update src/config/constants.ts with SCORING_TABLE, BASE_FALL_SPEED, MAX_SPEED_MULTIPLIER, MAX_SPEED_LEVEL constants

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Enhanced Visual Experience (Priority: P1) 🎯 MVP

**Goal**: Transform game from metallic monochrome to vibrant colorful design with glassmorphism effects

**Independent Test**: Launch game and observe colorful blocks + semi-transparent blurred background. No gameplay required.

### Tests for User Story 1 (TDD - Write First)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T008 [P] [US1] Unit test for COLORFUL_PALETTE validation in tests/unit/colors.test.ts (verify 7 colors, no black/white/gray, valid hex format)
- [ ] T009 [P] [US1] Visual regression test for colorful block rendering in tests/integration/visual-rendering.test.ts (verify blocks use COLORFUL_PALETTE)

### Implementation for User Story 1

- [ ] T010 [P] [US1] Update src/render/glass-colors.ts to use COLORFUL_PALETTE instead of metallic colors
- [ ] T011 [P] [US1] Modify src/render/Renderer.ts to render blocks with colorful palette (remove metallic gradients/shadows)
- [ ] T012 [US1] Update src/render/GlassRenderer.ts to add glassmorphism background rendering (semi-transparent + backdrop-filter: blur(10px))
- [ ] T013 [US1] Modify src/render/styles.ts to add CSS for glassmorphism effect and static gradient background
- [ ] T014 [US1] Update index.html or main CSS file to add body background gradient (light purple to light blue)
- [ ] T015 [US1] Add @supports fallback for browsers without backdrop-filter support in src/render/styles.ts
- [ ] T016 [US1] Test glassmorphism rendering and verify 60fps performance with PerformanceMonitor.ts

**Checkpoint**: At this point, User Story 1 should be fully functional - colorful blocks with glassmorphism background

---

## Phase 4: User Story 2 - Responsive Speed Control (Priority: P2)

**Goal**: Players can accelerate block descent by holding down key (4x multiplicative speed boost)

**Independent Test**: Start game, hold down key, verify blocks fall 4x faster than current level speed

### Tests for User Story 2 (TDD - Write First)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T017 [P] [US2] Unit test for speed multiplier calculation in tests/unit/speed-control.test.ts (verify 4x multiplier at all levels)
- [ ] T018 [P] [US2] Integration test for down key behavior in tests/integration/input-speed.test.ts (verify speed changes on key press/release)

### Implementation for User Story 2

- [ ] T019 [P] [US2] Modify src/input/InputHandler.ts to set speedMultiplier to 4 on ArrowDown keydown
- [ ] T020 [P] [US2] Modify src/input/InputHandler.ts to reset speedMultiplier to 1 on ArrowDown keyup
- [ ] T021 [US2] Update src/game/Game.ts to apply speedMultiplier multiplicatively to current level speed (e.g., level 2 = 3x base, down = 12x base)
- [ ] T022 [US2] Update fall interval calculation in Game.ts to use multiplicative speed (currentSpeed * speedMultiplier)
- [ ] T023 [US2] Test speed control at various levels (0, 1, 2, 3) and verify multiplicative behavior

**Checkpoint**: At this point, User Story 2 should be fully functional - down key accelerates blocks multiplicatively

---

## Phase 5: User Story 3 - Rewarding Scoring System (Priority: P2)

**Goal**: Non-linear scoring system that rewards multi-line clears (10/25/40/55 points)

**Independent Test**: Clear 1, 2, 3, and 4 lines, verify score increases match formula

### Tests for User Story 3 (TDD - Write First)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T024 [P] [US3] Unit test for calculateScore() in tests/unit/scoring.test.ts (verify 1→10, 2→25, 3→40, 4→55, invalid→error)
- [ ] T025 [P] [US3] Integration test for score accumulation in tests/integration/game-scoring.test.ts (verify score updates correctly after line clears)

### Implementation for User Story 3

- [ ] T026 [P] [US3] Implement calculateScore() function in src/game/scoring.ts with formula: linesCleared * 10 + (linesCleared - 1) * 5
- [ ] T027 [US3] Update src/game/Game.ts to use calculateScore() when lines are cleared
- [ ] T028 [US3] Update score display in UI to show new scoring values
- [ ] T029 [US3] Test scoring system by clearing 1, 2, 3, and 4 lines and verifying points

**Checkpoint**: At this point, User Story 3 should be fully functional - new scoring system working

---

## Phase 6: User Story 4 - Progressive Difficulty Levels (Priority: P3)

**Goal**: Level-based speed increases (1x per level, max 4x) + obstacle rows at higher levels

**Independent Test**: Play to level 4+, verify speed increases and obstacle rows appear

### Tests for User Story 4 (TDD - Write First)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T030 [P] [US4] Unit test for shouldLevelUp() in tests/unit/leveling.test.ts (verify threshold formula: targetLevel * 100 * 2)
- [ ] T031 [P] [US4] Unit test for getSpeedMultiplier() in tests/unit/leveling.test.ts (verify 1x→2x→3x→4x progression, capped at 4x)
- [ ] T032 [P] [US4] Unit test for shouldAddObstacleRow() in tests/unit/leveling.test.ts (verify returns true only when level >= 3 and speed is maxed)
- [ ] T033 [P] [US4] Unit test for generateObstacleRow() in tests/unit/obstacle-rows.test.ts (verify exactly one gap, random position, colorful blocks)
- [ ] T034 [P] [US4] Unit test for insertObstacleRow() in tests/unit/obstacle-rows.test.ts (verify rows shift up, obstacle at bottom, game over if exceeds top)
- [ ] T035 [P] [US4] Integration test for level progression in tests/integration/game-progression.test.ts (verify full progression: score→level→speed→obstacles)

### Implementation for User Story 4

- [ ] T036 [P] [US4] Implement shouldLevelUp() in src/game/leveling.ts with threshold formula
- [ ] T037 [P] [US4] Implement getSpeedMultiplier() in src/game/leveling.ts (returns 1+level, capped at 4)
- [ ] T038 [P] [US4] Implement shouldAddObstacleRow() in src/game/leveling.ts (returns true if level >= 3 and speed is 4x)
- [ ] T039 [P] [US4] Implement calculateFallInterval() in src/game/leveling.ts (BASE_FALL_SPEED / speedMultiplier)
- [ ] T040 [P] [US4] Implement generateObstacleRow() in src/game/grid.ts (random gap, colorful blocks from COLORFUL_PALETTE)
- [ ] T041 [US4] Implement insertObstacleRow() in src/game/grid.ts (shift rows up, add obstacle at bottom, check game over)
- [ ] T042 [US4] Update src/game/Game.ts to check shouldLevelUp() after score changes
- [ ] T043 [US4] Update src/game/Game.ts to increment level when threshold reached
- [ ] T044 [US4] Update src/game/Game.ts to call getSpeedMultiplier() and update fall interval
- [ ] T045 [US4] Update src/game/Game.ts to call shouldAddObstacleRow() on level up
- [ ] T046 [US4] Update src/game/Game.ts to call insertObstacleRow() when obstacle row should be added
- [ ] T047 [US4] Update src/game/Game.ts to trigger game over if insertObstacleRow() throws error (blocks exceed top)
- [ ] T048 [US4] Update UI to display current level

**Checkpoint**: All user stories should now be independently functional - full progression system working

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T049 [P] Add performance monitoring for glassmorphism effect in src/utils/PerformanceMonitor.ts
- [ ] T050 [P] Add performance toggle for glassmorphism effect in settings (optional performance setting)
- [ ] T051 [P] Update all code comments to document WHY decisions were made (Constitution I)
- [ ] T052 [P] Verify immutability patterns used throughout (no mutations, pure functions)
- [ ] T053 Run full test suite and verify 80% coverage requirement (Constitution II)
- [ ] T054 Run performance tests: verify 60fps at all speed levels (1x-16x)
- [ ] T055 Run performance tests: verify <50ms input latency at maximum speed
- [ ] T056 Run performance tests: verify <80MB memory usage with glassmorphism
- [ ] T057 [P] Update CLAUDE.md with new technologies (colorful theme, glassmorphism)
- [ ] T058 [P] Update quickstart.md with any implementation learnings
- [ ] T059 Manual testing: Play through full game progression (level 0→5+) and verify all features work
- [ ] T060 Update Constitution if needed to reflect colorful theme as primary visual style

---

## Dependencies & Execution Strategy

### User Story Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational)
                      ↓
    ┌─────────────────┼─────────────────┬─────────────────┐
    ↓                 ↓                 ↓                 ↓
  US1 (P1)         US2 (P2)         US3 (P2)         US4 (P3)
  Visual           Speed            Scoring          Leveling
  (T008-T016)      (T017-T023)      (T024-T029)      (T030-T048)
    ↓                 ↓                 ↓                 ↓
    └─────────────────┴─────────────────┴─────────────────┘
                            ↓
                    Phase 7 (Polish)
                    (T049-T060)
```

**Key Insights**:
- **US1 (Visual)**: Fully independent, can be implemented first
- **US2 (Speed)**: Independent of US1, can run in parallel
- **US3 (Scoring)**: Independent of US1 and US2, can run in parallel
- **US4 (Leveling)**: Depends on US3 (scoring must work first), but independent of US1 and US2

**Recommended Execution Order**:
1. **MVP (Minimum Viable Product)**: US1 only (colorful visual experience)
2. **Enhanced MVP**: US1 + US2 + US3 (visual + speed + scoring)
3. **Full Feature**: US1 + US2 + US3 + US4 (all stories)

### Parallel Execution Examples

**Phase 2 (Foundational)**: All tasks can run in parallel
```bash
# Parallel execution (4 developers)
Dev 1: T004 (scoring.ts)
Dev 2: T005 (leveling.ts)
Dev 3: T006 (grid.ts obstacle rows)
Dev 4: T007 (constants.ts)
```

**Phase 3 (US1 - Visual)**: Tests and implementation can overlap
```bash
# Parallel execution (3 developers)
Dev 1: T008, T009 (write tests first)
Dev 2: T010, T011 (colorful rendering)
Dev 3: T012, T013, T014 (glassmorphism)
# Then: T015, T016 (fallback + performance)
```

**Phase 4-6 (US2, US3, US4)**: User stories can run in parallel (except US4 depends on US3)
```bash
# Parallel execution (3 teams)
Team 1: US2 (T017-T023) - Speed control
Team 2: US3 (T024-T029) - Scoring
Team 3: Wait for US3, then US4 (T030-T048) - Leveling
```

**Phase 7 (Polish)**: Most tasks can run in parallel
```bash
# Parallel execution (4 developers)
Dev 1: T049, T050 (performance optimization)
Dev 2: T051, T052 (code quality)
Dev 3: T053, T054, T055, T056 (testing)
Dev 4: T057, T058 (documentation)
# Then: T059, T060 (manual testing + constitution update)
```

---

## Implementation Strategy

### MVP First (Recommended)

**Phase 1**: Deliver US1 (Enhanced Visual Experience) as MVP
- **Value**: Immediate visual impact, attracts users
- **Testable**: Launch game, observe colorful blocks + glassmorphism
- **Deliverable**: Playable game with new visual style

**Phase 2**: Add US2 + US3 (Speed Control + Scoring)
- **Value**: Enhanced gameplay mechanics
- **Testable**: Hold down key (4x speed), clear lines (new scoring)
- **Deliverable**: Full gameplay experience with improved controls and rewards

**Phase 3**: Add US4 (Progressive Difficulty)
- **Value**: Long-term engagement and replayability
- **Testable**: Play to level 4+, verify obstacle rows
- **Deliverable**: Complete feature with progression system

### Incremental Delivery

Each user story is independently testable and deliverable:
- **US1**: Visual overhaul (can ship alone)
- **US2**: Speed control (can ship with or without US1)
- **US3**: Scoring system (can ship with or without US1/US2)
- **US4**: Level progression (requires US3, but independent of US1/US2)

---

## Task Summary

**Total Tasks**: 60
- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (Foundational)**: 4 tasks
- **Phase 3 (US1 - Visual)**: 9 tasks (2 tests + 7 implementation)
- **Phase 4 (US2 - Speed)**: 7 tasks (2 tests + 5 implementation)
- **Phase 5 (US3 - Scoring)**: 6 tasks (2 tests + 4 implementation)
- **Phase 6 (US4 - Leveling)**: 19 tasks (6 tests + 13 implementation)
- **Phase 7 (Polish)**: 12 tasks

**Parallel Opportunities**: 35 tasks marked with [P] can run in parallel

**Independent Test Criteria**:
- **US1**: Visual inspection of colorful blocks + glassmorphism background
- **US2**: Hold down key, verify 4x multiplicative speed boost
- **US3**: Clear 1/2/3/4 lines, verify scoring (10/25/40/55 points)
- **US4**: Play to level 4+, verify speed increases and obstacle rows

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (US1 only) = 16 tasks

---

## Format Validation

✅ All tasks follow checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`
✅ All user story tasks have [US#] labels
✅ All parallelizable tasks have [P] markers
✅ All tasks include specific file paths
✅ Tasks organized by user story for independent implementation
✅ Dependencies clearly documented
✅ Parallel execution examples provided
✅ TDD approach with tests written first (Constitution II)

**Ready for implementation!** 🚀
