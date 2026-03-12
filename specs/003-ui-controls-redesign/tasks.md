# Tasks: UI Controls and Visual Redesign

**Input**: Design documents from `/specs/003-ui-controls-redesign/`
**Prerequisites**: plan.md, spec.md

**Tests**: Tests included per constitution requirement (TDD mandatory, 80% coverage)

**Organization**: Tasks grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths follow existing structure: `src/input/`, `src/render/`, `src/game/`, `tests/unit/`, `tests/integration/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for UI redesign

- [ ] T001 Review existing V2 codebase structure and identify integration points for CSS-based rendering
- [ ] T002 [P] Create index.html structure with gradient background containers
- [ ] T003 [P] Create src/styles/glassmorphism.css for glass effect styles
- [ ] T004 [P] Verify browser compatibility for backdrop-filter support

**Checkpoint**: Project structure ready, CSS foundation in place

---

## Phase 2: Foundational Infrastructure (BLOCKING)

**Purpose**: Core systems that both user stories depend on

- [ ] T005 Create CSS gradient background with blur circles in index.html
- [ ] T006 [P] Implement frosted glass border styles in src/styles/glassmorphism.css
- [ ] T007 [P] Create glass block style definitions for 7 piece types in src/render/styles.ts
- [ ] T008 Update Renderer to apply CSS classes instead of Canvas drawing in src/render/Renderer.ts
- [ ] T009 [P] Add performance monitoring utilities for CSS effects in src/utils/PerformanceMonitor.ts
- [ ] T010 Verify 60 FPS with all CSS effects active

**Checkpoint**: Visual foundation complete, CSS rendering pipeline working

---

## Phase 3: User Story 1 - Improved Drop Controls (Priority: P1)

**Goal**: Players can use down arrow for 2x speed and spacebar for instant drop

**Independent Test**: Press down arrow during block fall (observes 2x speed) and press spacebar (observes instant drop)

### Tests for User Story 1 (TDD - Write First)

- [ ] T011 [P] [US1] Write unit test for 2x speed multiplier calculation in tests/unit/controls.test.ts
- [ ] T012 [P] [US1] Write unit test for instant drop positioning in tests/unit/controls.test.ts
- [ ] T013 [P] [US1] Write integration test for down arrow keydown/keyup in tests/integration/controls.test.ts
- [ ] T014 [P] [US1] Write integration test for spacebar instant drop in tests/integration/controls.test.ts
- [ ] T015 [P] [US1] Write performance test for <50ms input latency in tests/integration/controls.test.ts
- [ ] T015a [P] [US1] Write integration test for rapid key switching (down arrow ↔ spacebar) in tests/integration/controls.test.ts

### Implementation for User Story 1

- [ ] T016 [US1] Modify InputHandler to handle down arrow for 2x speed (including rapid switching edge case) in src/input/InputHandler.ts
- [ ] T017 [US1] Modify InputHandler to handle spacebar for instant drop in src/input/InputHandler.ts
- [ ] T018 [US1] Remove existing fast drop acceleration (spacebar hold) from FastDropManager in src/utils/FastDropManager.ts
- [ ] T019 [US1] Update Game loop to apply 2x multiplier for down arrow in src/game/Game.ts
- [ ] T020 [US1] Wire spacebar to hardDrop() method in src/input/InputHandler.ts
- [ ] T021 [US1] Update control hints in console log in src/main.ts
- [ ] T022 [US1] Verify all US1 tests pass and achieve 80%+ coverage

**Checkpoint**: Controls working correctly - down arrow 2x, spacebar instant drop

---

## Phase 4: User Story 2 - Glassmorphism Visual Style (Priority: P2)

**Goal**: Players see modern glass-effect blocks with gradient background and frosted border

**Independent Test**: Observe game board and verify gradient background, frosted border, and semi-transparent glass blocks are visible

### Tests for User Story 2 (TDD - Write First)

- [ ] T023 [P] [US2] Write visual regression test for gradient background in tests/visual/background.test.ts
- [ ] T024 [P] [US2] Write visual regression test for frosted glass border in tests/visual/border.test.ts
- [ ] T025 [P] [US2] Write visual regression test for glass block styles in tests/visual/blocks.test.ts
- [ ] T026 [P] [US2] Write cross-browser compatibility test in tests/integration/browser-compat.test.ts
- [ ] T027 [P] [US2] Write performance test for 60 FPS with CSS effects in tests/integration/performance.test.ts

### Implementation for User Story 2

- [ ] T028 [P] [US2] Implement gradient background HTML structure in index.html
- [ ] T029 [P] [US2] Implement frosted glass border CSS in src/styles/glassmorphism.css
- [ ] T030 [P] [US2] Define glass block styles for I-piece in src/render/styles.ts
- [ ] T031 [P] [US2] Define glass block styles for J-piece in src/render/styles.ts
- [ ] T032 [P] [US2] Define glass block styles for L-piece in src/render/styles.ts
- [ ] T033 [P] [US2] Define glass block styles for O-piece in src/render/styles.ts
- [ ] T034 [P] [US2] Define glass block styles for S-piece in src/render/styles.ts
- [ ] T035 [P] [US2] Define glass block styles for T-piece in src/render/styles.ts
- [ ] T036 [P] [US2] Define glass block styles for Z-piece in src/render/styles.ts
- [ ] T037 [US2] Update Renderer to apply glass CSS classes to blocks in src/render/Renderer.ts
- [ ] T038 [US2] Remove old 3D isometric rendering code from Renderer3D.ts
- [ ] T039 [US2] Add @supports fallback for browsers without backdrop-filter in src/styles/glassmorphism.css
- [ ] T040 [US2] Verify all US2 tests pass and achieve 80%+ coverage

**Checkpoint**: All visual effects working - gradient, frosted border, glass blocks

---

## Phase 5: Integration & Polish

**Purpose**: Ensure both user stories work together seamlessly and meet performance targets

- [ ] T041 [P] Integration test: Controls work with new glass rendering in tests/integration/full-integration.test.ts
- [ ] T042 [P] Integration test: All visual effects render correctly in tests/integration/full-integration.test.ts
- [ ] T043 Performance validation: 60fps with all effects active
- [ ] T044 Performance validation: <50ms input latency for both controls
- [ ] T045 Performance validation: Memory usage <80MB
- [ ] T046 [P] Edge case: Rapid key switching (down arrow + spacebar)
- [ ] T047 [P] Edge case: Glass effects on overlapping blocks
- [ ] T048 [P] Edge case: Gradient background on different screen sizes
- [ ] T049 Code cleanup and refactoring for maintainability
- [ ] T050 [P] Update README with new controls and visual features
- [ ] T051 [P] Add inline documentation comments per constitution
- [ ] T052 Run full test suite and verify 80%+ coverage
- [ ] T053 Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] T054 Visual validation against reference design
- [ ] T055 Final performance profiling and optimization

**Note**: SC-005 (90% player approval) is a post-launch metric requiring user testing after deployment. Not included in pre-launch tasks.

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Phase 1 (Setup)** → MUST complete first
2. **Phase 2 (Foundational)** → MUST complete before Phase 3 & 4
3. **Phase 3 (US1) & Phase 4 (US2)** → Can run in parallel (independent stories)
4. **Phase 5 (Integration)** → MUST wait for Phase 3 & 4 to complete

### Parallel Execution Strategy

**Team of 3 developers**:
1. Phase 1 & 2: All developers collaborate (foundational work)
2. Once Foundational is done:
   - Developer A: User Story 1 (Controls)
   - Developer B: User Story 2 (Visual effects)
   - Developer C: Test infrastructure and documentation
3. Stories complete and integrate independently
4. Team reconvenes for Phase 5 integration testing

---

## Task Summary

- **Total Tasks**: 56
- **Setup Phase**: 4 tasks
- **Foundational Phase**: 6 tasks (BLOCKING)
- **User Story 1 (P1)**: 13 tasks (6 tests + 7 implementation)
- **User Story 2 (P2)**: 18 tasks (5 tests + 13 implementation)
- **Integration & Polish**: 15 tasks
- **Parallel Opportunities**: 29 tasks marked [P]

---

## Performance Targets

- **Frame Rate**: 60 FPS stable with all CSS effects active
- **Input Latency**: <50ms for down arrow and spacebar
- **Memory**: <80MB total with glass effects
- **CSS Rendering**: Hardware-accelerated backdrop-filter
- **Test Coverage**: 80%+ for all new code

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- TDD workflow: Write tests FIRST, ensure they FAIL, then implement
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution compliance: Zero dependencies, immutability, 80% coverage, CSS-only visual effects
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
