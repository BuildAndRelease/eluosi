# Tasks: Tetris 3D Visual Enhancements

**Input**: Design documents from `/specs/002-3d-visual-enhancements/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included per constitution requirement (TDD mandatory, 80% coverage)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths follow existing V1 structure: `src/render/`, `src/input/`, `src/utils/`, `tests/unit/`, `tests/integration/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for 3D enhancements

- [X] T001 Review existing V1 codebase structure and identify integration points
- [X] T002 [P] Create src/utils/AnimationManager.ts file structure
- [X] T003 [P] Update tsconfig.json if needed for new modules
- [X] T004 [P] Add 3D color scheme constants to src/render/styles.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Implement AnimationManager class in src/utils/AnimationManager.ts with lifecycle management
- [X] T006 [P] Write unit tests for AnimationManager in tests/unit/animation-manager.test.ts
- [X] T007 [P] Create ParticlePool class skeleton in src/render/Effects.ts with object pooling
- [X] T008 [P] Write unit tests for ParticlePool in tests/unit/particle-system.test.ts
- [X] T009 Integrate AnimationManager into main game loop in src/main.ts
- [X] T010 [P] Add performance monitoring utilities for FPS tracking

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Enhanced Visual Feedback (Priority: P1) 🎯 MVP

**Goal**: Players experience immediate visual feedback when completing rows through particle explosion effects

**Independent Test**: Complete a single row and observe particle explosion sequence with blocks breaking into particles that scatter and fall

### Tests for User Story 1 (TDD - Write First)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [P] [US1] Write unit test for Particle physics simulation in tests/unit/particle-system.test.ts
- [X] T012 [P] [US1] Write unit test for ParticleEmitter spawn logic in tests/unit/particle-system.test.ts
- [X] T013 [P] [US1] Write integration test for row clear triggering particle explosion in tests/integration/particle-animation.test.ts
- [X] T014 [P] [US1] Write integration test for multiple simultaneous row explosions in tests/integration/particle-animation.test.ts
- [X] T015 [P] [US1] Write performance test for 150 active particles maintaining 60fps in tests/integration/particle-animation.test.ts

### Implementation for User Story 1

- [X] T016 [P] [US1] Implement Particle interface and ParticleEmitter class in src/render/Effects.ts
- [X] T017 [US1] Implement EffectsManager.createRowClearExplosion() method in src/render/Effects.ts
- [X] T018 [US1] Implement EffectsManager.createMultiRowExplosion() method in src/render/Effects.ts
- [X] T019 [US1] Implement EffectsManager.update() with gravity and particle lifecycle in src/render/Effects.ts
- [X] T020 [US1] Implement EffectsManager.render() with fade-out effect in src/render/Effects.ts
- [X] T021 [US1] Implement EffectsManager.stopEmitter() and stopAll() for game over interruption in src/render/Effects.ts
- [X] T022 [US1] Integrate EffectsManager into Renderer.render() in src/render/Renderer.ts
- [ ] T023 [US1] Implement block spawn delay during particle animation in src/game/Game.ts
- [X] T024 [US1] Hook row clear event to trigger particle explosions in src/game/Game.ts
- [X] T025 [US1] Add game over interruption logic to stop animations in src/game/Game.ts
- [X] T026 [US1] Verify all US1 tests pass and achieve 80%+ coverage

**Checkpoint**: At this point, User Story 1 should be fully functional - particle explosions work independently

---

## Phase 4: User Story 2 - 3D Block Appearance (Priority: P2)

**Goal**: Players see blocks with depth and dimension through isometric 3D rendering

**Independent Test**: Observe any block on the game board and verify it displays with depth, shadows, and highlights (three visible faces)

### Tests for User Story 2 (TDD - Write First)

- [X] T027 [P] [US2] Write unit test for isometric coordinate transformation in tests/unit/3d-transforms.test.ts
- [X] T028 [P] [US2] Write unit test for face color calculation (top/left/right) in tests/unit/3d-transforms.test.ts
- [X] T029 [P] [US2] Write integration test for 3D grid rendering in tests/integration/3d-rendering.test.ts
- [X] T030 [P] [US2] Write integration test for 3D piece rendering in tests/integration/3d-rendering.test.ts
- [X] T031 [P] [US2] Write performance test for 200-block grid rendering <3ms in tests/integration/3d-rendering.test.ts

### Implementation for User Story 2

- [X] T032 [P] [US2] Create Renderer3D class skeleton in src/render/Renderer3D.ts
- [X] T033 [P] [US2] Implement toIsometric() coordinate transformation in src/render/Renderer3D.ts
- [X] T034 [P] [US2] Implement calculateFaceColors() with brightness levels in src/render/Renderer3D.ts
- [X] T035 [US2] Implement drawTopFace() method in src/render/Renderer3D.ts
- [X] T036 [US2] Implement drawLeftFace() method in src/render/Renderer3D.ts
- [X] T037 [US2] Implement drawRightFace() method in src/render/Renderer3D.ts
- [X] T038 [US2] Implement renderBlock() with all three faces in src/render/Renderer3D.ts
- [X] T039 [US2] Implement renderGrid() with depth sorting in src/render/Renderer3D.ts
- [X] T040 [US2] Implement renderPiece() for falling pieces in src/render/Renderer3D.ts
- [X] T041 [US2] Add highlight and shadow effects in src/render/Renderer3D.ts
- [X] T042 [US2] Integrate Renderer3D into main Renderer in src/render/Renderer.ts
- [X] T043 [US2] Update 3D color schemes for 7 piece types in src/render/styles.ts
- [X] T044 [US2] Add gradient caching for performance in src/render/Renderer3D.ts
- [X] T045 [US2] Verify all US2 tests pass and achieve 80%+ coverage

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - particles + 3D blocks

---

## Phase 5: User Story 3 - Fast Drop Control (Priority: P3)

**Goal**: Players can use spacebar for smooth linear acceleration to 8x speed over 0.2 seconds

**Independent Test**: Press spacebar during block fall and observe smooth acceleration from normal to 8x speed with visible motion

### Tests for User Story 3 (TDD - Write First)

- [X] T046 [P] [US3] Write unit test for fast drop speed multiplier calculation in tests/unit/fast-drop.test.ts
- [X] T047 [P] [US3] Write unit test for linear acceleration curve in tests/unit/fast-drop.test.ts
- [X] T048 [P] [US3] Write integration test for spacebar activation/deactivation in tests/integration/fast-drop.test.ts
- [X] T049 [P] [US3] Write integration test for acceleration ramp-up timing in tests/integration/fast-drop.test.ts
- [X] T050 [P] [US3] Write performance test for <50ms input latency in tests/integration/fast-drop.test.ts

### Implementation for User Story 3

- [X] T051 [P] [US3] Add FastDropState interface to src/input/InputHandler.ts
- [X] T052 [US3] Implement activateFastDrop() method in src/input/InputHandler.ts
- [X] T053 [US3] Implement deactivateFastDrop() method in src/input/InputHandler.ts
- [X] T054 [US3] Implement getSpeedMultiplier() with linear interpolation in src/input/InputHandler.ts
- [X] T055 [US3] Add spacebar keydown event listener in src/input/InputHandler.ts
- [X] T056 [US3] Add spacebar keyup event listener in src/input/InputHandler.ts
- [X] T057 [US3] Integrate speed multiplier into Game.update() drop timing in src/game/Game.ts
- [X] T058 [US3] Add optional motion blur trail effect in src/render/Renderer.ts
- [X] T059 [US3] Verify all US3 tests pass and achieve 80%+ coverage

**Checkpoint**: All user stories should now be independently functional - particles + 3D + fast drop

---

## Phase 6: Integration & Polish

**Purpose**: Ensure all three user stories work together seamlessly and meet performance targets

- [ ] T060 [P] Integration test: Particle explosions with 3D blocks in tests/integration/full-integration.test.ts
- [ ] T061 [P] Integration test: Fast drop with 3D rendering in tests/integration/full-integration.test.ts
- [ ] T062 [P] Integration test: All three features together in tests/integration/full-integration.test.ts
- [ ] T063 Performance validation: 60fps with all features active
- [ ] T064 Performance validation: <50ms input latency for fast drop
- [ ] T065 Performance validation: Memory usage <80MB after 10 minutes gameplay
- [ ] T066 [P] Edge case: Game over interrupts particle animation correctly
- [ ] T067 [P] Edge case: Multiple simultaneous row clears work correctly
- [ ] T068 [P] Edge case: Fast drop repeated presses handled correctly
- [ ] T069 Code cleanup and refactoring for maintainability
- [ ] T070 [P] Update quickstart.md with usage examples
- [ ] T071 [P] Add inline documentation comments per constitution
- [ ] T072 Run full test suite and verify 80%+ coverage
- [ ] T073 Browser compatibility testing (Chrome, Firefox, Safari, Edge)
- [ ] T074 Visual regression testing (optional - compare 3D appearance)
- [ ] T075 Visual validation against reference image (https://pic.rmb.bdstatic.com/bjh/bb919506478d/250619/302dd43e59f5e31433d45464b21c3bb2.jpeg?for=bg)
- [ ] T076 Final performance profiling and optimization

**Note**: SC-005 (90% player approval) is a post-launch metric requiring user testing after deployment. Not included in pre-launch tasks.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Integration & Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1 (different rendering system)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2 (input handling only)

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD workflow)
- Unit tests before implementation
- Implementation tasks in logical order (data structures → logic → integration)
- Integration tests after implementation
- Story complete and verified before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003, T004)
- All Foundational tasks marked [P] can run in parallel (T006, T007, T008, T010)
- Once Foundational phase completes, all three user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (TDD - write first):
Task: "Write unit test for Particle physics simulation in tests/unit/particle-system.test.ts"
Task: "Write unit test for ParticleEmitter spawn logic in tests/unit/particle-system.test.ts"
Task: "Write integration test for row clear triggering particle explosion in tests/integration/particle-animation.test.ts"
Task: "Write integration test for multiple simultaneous row explosions in tests/integration/particle-animation.test.ts"
Task: "Write performance test for 150 active particles maintaining 60fps in tests/integration/particle-animation.test.ts"

# Launch all data structure tasks for User Story 1 together:
Task: "Implement Particle interface and data structure in src/render/Effects.ts"
Task: "Implement ParticleEmitter class with spawn and update methods in src/render/Effects.ts"
```

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together (TDD - write first):
Task: "Write unit test for isometric coordinate transformation in tests/unit/3d-transforms.test.ts"
Task: "Write unit test for face color calculation (top/left/right) in tests/unit/3d-transforms.test.ts"
Task: "Write integration test for 3D grid rendering in tests/integration/3d-rendering.test.ts"
Task: "Write integration test for 3D piece rendering in tests/integration/3d-rendering.test.ts"
Task: "Write performance test for 200-block grid rendering <3ms in tests/integration/3d-rendering.test.ts"

# Launch all coordinate/color tasks for User Story 2 together:
Task: "Implement toIsometric() coordinate transformation in src/render/Renderer3D.ts"
Task: "Implement calculateFaceColors() with brightness levels in src/render/Renderer3D.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Particle Explosions)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - players get satisfying row clear feedback

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - particle explosions!)
3. Add User Story 2 → Test independently → Deploy/Demo (MVP + 3D blocks!)
4. Add User Story 3 → Test independently → Deploy/Demo (Full feature set!)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Particle system)
   - Developer B: User Story 2 (3D rendering)
   - Developer C: User Story 3 (Fast drop)
3. Stories complete and integrate independently
4. Team reconvenes for Phase 6 integration testing

---

## Task Summary

- **Total Tasks**: 75
- **Setup Phase**: 4 tasks
- **Foundational Phase**: 6 tasks (BLOCKING)
- **User Story 1 (P1)**: 15 tasks (5 tests + 10 implementation)
- **User Story 2 (P2)**: 19 tasks (5 tests + 14 implementation)
- **User Story 3 (P3)**: 14 tasks (5 tests + 9 implementation)
- **Integration & Polish**: 17 tasks
- **Parallel Opportunities**: 35 tasks marked [P]

---

## Performance Targets

- **Frame Rate**: 60 FPS stable during all animations and 3D rendering
- **Input Latency**: <50ms for fast drop activation
- **Memory**: <80MB total with particle system active
- **Particle Update**: <5ms for 150 active particles
- **3D Rendering**: <3ms for 200-block grid
- **Test Coverage**: 80%+ for all new code

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- TDD workflow: Write tests FIRST, ensure they FAIL, then implement
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution compliance: Zero dependencies, immutability, 80% coverage, <400 lines per file
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
