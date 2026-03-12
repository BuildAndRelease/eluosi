# Tasks: Core Tetris Game

**Input**: Design documents from `/specs/001-core-tetris-game/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md, quickstart.md

**Tests**: TDD is MANDATORY per constitution - all test tasks included

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Vite project with TypeScript template in repository root
- [ ] T002 Configure tsconfig.json with strict mode enabled and target ES2020
- [ ] T003 [P] Install dev dependencies: vitest, @vitest/ui, eslint, prettier, @typescript-eslint/parser, @typescript-eslint/eslint-plugin
- [ ] T004 [P] Configure ESLint with TypeScript rules in .eslintrc.json
- [ ] T005 [P] Configure Prettier in .prettierrc
- [ ] T006 [P] Configure Vitest in vitest.config.ts with coverage settings (80% threshold)
- [ ] T007 Create project directory structure: src/game/, src/render/, src/audio/, src/input/, src/storage/, src/config/, tests/unit/, tests/integration/
- [ ] T008 Create index.html with Canvas element (#game-canvas) and basic metallic-themed styling
- [ ] T009 Create src/config/constants.ts with game constants (GRID_WIDTH=10, GRID_HEIGHT=20, CELL_SIZE=30, FALL_SPEEDS array, SCORE_VALUES, etc.)
- [ ] T010 Create src/game/types.ts with TypeScript interfaces (PieceType, GameStatus, Position, Piece, Grid, GameState, PersistentData, Settings, AudioAsset)
- [ ] T011 [P] Add npm scripts to package.json: dev, build, preview, test, test:watch, test:coverage, lint, lint:fix, format, type-check
- [ ] T012 Create .gitignore with node_modules/, dist/, coverage/, .DS_Store
- [ ] T013 [P] Source and download 6 metallic sound effects from Freesound.org (CC0 license): move.mp3, rotate.mp3, drop.mp3, hard_drop.mp3, clear.mp3, game_over.mp3 and save to assets/sounds/
- [ ] T014 Verify project builds and runs with `npm run dev` (empty Canvas displays)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T015 Create tests/unit/collision.test.ts with test cases for boundary collision detection (left, right, bottom, top)
- [ ] T016 Create src/game/collision.ts with isValidPosition() function implementing collision detection for grid boundaries and locked blocks
- [ ] T017 Create tests/unit/piece-shapes.test.ts with test cases for all 7 Tetromino shapes and 4 rotation states each
- [ ] T018 Create src/game/piece-shapes.ts with PIECE_SHAPES constant defining all 7 block types (I, O, T, S, Z, J, L) with 4×4 matrices for each rotation
- [ ] T019 Create tests/unit/piece-factory.test.ts with test cases for random piece generation and spawn position
- [ ] T020 Create src/game/piece-factory.ts with createPiece() and createRandomPiece() functions (spawn at row 0, columns 3-6)
- [ ] T021 Create tests/unit/grid.test.ts with test cases for grid initialization, cell operations, row detection, and row clearing
- [ ] T022 Create src/game/grid.ts with Grid class (10×20 matrix, isEmpty(), set(), clear(), getCompleteRows(), shiftRowsDown())
- [ ] T023 Create tests/unit/rotation.test.ts with test cases for 90° clockwise rotation and simplified SRS wall kicks
- [ ] T024 Create src/game/rotation.ts with rotatePiece() function implementing clockwise rotation and wall kick offsets
- [ ] T025 Run test coverage report and verify foundational logic has ≥80% coverage

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Gameplay (Priority: P1) 🎯 MVP

**Goal**: Complete playable Tetris with movement, rotation, line clearing, and game over

**Independent Test**: Start game, move/rotate blocks, clear at least one line, reach game over

### Tests for User Story 1

- [ ] T027 [P] [US1] Create tests/unit/game-state.test.ts with test cases for game state initialization, transitions (menu→playing→gameover), and state updates
- [ ] T028 [P] [US1] Create tests/unit/movement.test.ts with test cases for moveLeft(), moveRight(), moveDown(), hardDrop() with collision checks
- [ ] T029 [P] [US1] Create tests/unit/locking.test.ts with test cases for lock delay (500ms), lock on timeout, and lock cancellation on movement
- [ ] T030 [P] [US1] Create tests/unit/line-clearing.test.ts with test cases for detecting complete rows, clearing 1-4 lines, and shifting blocks down
- [ ] T031 [P] [US1] Create tests/integration/gameplay-loop.test.ts with test cases for full game cycle (start→move→lock→clear→gameover)

### Implementation for User Story 1

- [ ] T032 [US1] Create src/game/Game.ts with Game class implementing GameAPI interface (start(), pause(), resume(), reset(), moveLeft(), moveRight(), moveDown(), hardDrop(), rotate(), getGameState())
- [ ] T033 [US1] Implement automatic piece falling in Game.ts with requestAnimationFrame loop and level-based fall speed
- [ ] T034 [US1] Implement lock delay mechanism in Game.ts (500ms timer, reset on movement/rotation, lock on expiry)
- [ ] T035 [US1] Implement line clearing logic in Game.ts (detect complete rows, remove them, shift blocks down)
- [ ] T036 [US1] Implement game over detection in Game.ts (check if new piece can spawn at top center)
- [ ] T037 [US1] Create src/render/Renderer.ts with Renderer class (initialize Canvas context, clear(), renderGrid(), renderPiece(), renderNextPiece())
- [ ] T038 [US1] Implement basic block rendering in Renderer.ts (solid colors, no metallic effects yet)
- [ ] T039 [US1] Create src/input/InputHandler.ts with keyboard event listeners (ArrowLeft, ArrowRight, ArrowDown, ArrowUp, Space, P, R)
- [ ] T040 [US1] Connect InputHandler to Game API methods in src/main.ts
- [ ] T041 [US1] Create src/main.ts entry point with game loop (update game state, render, requestAnimationFrame)
- [ ] T042 [US1] Verify User Story 1 acceptance scenarios: start game, move blocks, rotate, clear line, game over
- [ ] T043 [US1] Run test coverage for US1 and verify ≥80% coverage for game logic

**Checkpoint**: MVP complete - fully playable Tetris game

---

## Phase 4: User Story 2 - Scoring and Progression (Priority: P2)

**Goal**: Add scoring system, level progression, and difficulty scaling

**Independent Test**: Play until clearing multiple lines, verify score formula (base × (level+1)), confirm level increases every 500 points with speed changes

### Tests for User Story 2

- [ ] T043 [P] [US2] Create tests/unit/scoring.test.ts with test cases for score calculation (50/300/500/1000 × (level+1) for 1/2/3/4 lines)
- [ ] T044 [P] [US2] Create tests/unit/level-progression.test.ts with test cases for level increases every 500 points (max level 15)
- [ ] T045 [P] [US2] Create tests/unit/difficulty.test.ts with test cases for fall speed changes per level (1000ms→100ms)

### Implementation for User Story 2

- [ ] T046 [US2] Implement scoring logic in Game.ts (calculateScore() method using base scores from constants)
- [ ] T047 [US2] Implement level progression in Game.ts (check score threshold, increment level, update fall speed)
- [ ] T048 [US2] Add score display to Renderer.ts (renderScore(), renderLevel(), renderLines())
- [ ] T049 [US2] Add event callbacks to Game.ts (onScoreChange, onLevelChange, onLinesClear)
- [ ] T050 [US2] Verify User Story 2 acceptance scenarios: clear 1/2/3/4 lines, verify scores, level up at 500 points, speed increases
- [ ] T051 [US2] Run test coverage for US2 and verify ≥80% coverage

**Checkpoint**: Scoring and progression complete

---

## Phase 5: User Story 3 - Visual Feedback and Metallic Theme (Priority: P3)

**Goal**: Add metallic visual effects, animations, and polished UI

**Independent Test**: Visual inspection of metallic gradients, observe line clear animation (200-300ms), verify 60fps stable

### Tests for User Story 3

- [ ] T052 [P] [US3] Create tests/unit/metallic-effects.test.ts with test cases for gradient generation for each block type
- [ ] T053 [P] [US3] Create tests/integration/rendering-performance.test.ts with test cases for 60fps validation and frame time measurement

### Implementation for User Story 3

- [ ] T054 [P] [US3] Create src/render/metallic-effects.ts with functions to generate metallic gradients (createMetallicGradient(), addHighlight(), addShadow())
- [ ] T055 [US3] Update Renderer.ts to use metallic effects for block rendering (replace solid colors with gradients)
- [ ] T056 [US3] Implement line clear animation in Renderer.ts (fade out over 250ms with easing, configurable via LINE_CLEAR_ANIMATION_DURATION in constants.ts)
- [ ] T057 [US3] Implement block lock flash effect in Renderer.ts (subtle white flash on lock)
- [ ] T058 [US3] Implement level up celebration effect in Renderer.ts (brief visual effect)
- [ ] T059 [US3] Add metallic UI styling to Renderer.ts (brushed metal backgrounds, borders, text effects)
- [ ] T060 [US3] Optimize rendering performance in Renderer.ts (dirty rectangle tracking, cache gradients, minimize redraws)
- [ ] T061 [US3] Verify User Story 3 acceptance scenarios: metallic blocks visible, animations smooth, 60fps stable, <50ms input latency
- [ ] T062 [US3] Profile rendering with Chrome DevTools and verify 60fps maintained

**Checkpoint**: Visual polish complete

---

## Phase 6: User Story 4 - Audio Feedback (Priority: P4)

**Goal**: Add metallic sound effects for all game actions

**Independent Test**: Perform each action, verify corresponding sound plays within 100ms, test volume control and mute

### Tests for User Story 4

- [ ] T063 [P] [US4] Create tests/unit/sound-manager.test.ts with test cases for audio loading, playback, volume control, and mute
- [ ] T064 [P] [US4] Create tests/integration/audio-latency.test.ts with test cases for <100ms audio latency

### Implementation for User Story 4

- [ ] T065 [P] [US4] Source 6 metallic sound effects from Freesound.org (CC0 license): move.mp3, rotate.mp3, drop.mp3, hard_drop.mp3, clear.mp3, game_over.mp3
- [ ] T066 [US4] Create assets/sounds/ directory and add all 6 sound files
- [ ] T067 [US4] Create src/audio/SoundManager.ts with SoundManager class (initialize AudioContext, load sounds, play(), setVolume(), mute())
- [ ] T068 [US4] Integrate SoundManager with Game.ts (play sounds on movement, rotation, drop, hard drop, line clear, game over)
- [ ] T069 [US4] Add volume control UI in Renderer.ts (slider 0-100%)
- [ ] T070 [US4] Add mute button in Renderer.ts
- [ ] T071 [US4] Verify User Story 4 acceptance scenarios: all sounds play correctly, volume control works, mute works, <100ms latency
- [ ] T072 [US4] Test audio in multiple browsers (Chrome, Firefox, Safari, Edge)

**Checkpoint**: Audio feedback complete

---

## Phase 7: User Story 5 - Game State Management (Priority: P5)

**Goal**: Add pause/resume, restart, high score persistence

**Independent Test**: Pause (game freezes), resume (continues), restart (new game), verify high score persists across browser sessions

### Tests for User Story 5

- [ ] T073 [P] [US5] Create tests/unit/storage-manager.test.ts with test cases for localStorage read/write, error handling, data validation
- [ ] T074 [P] [US5] Create tests/integration/persistence.test.ts with test cases for high score persistence, settings persistence, graceful degradation on localStorage errors

### Implementation for User Story 5

- [ ] T075 [US5] Create src/storage/StorageManager.ts with StorageManager class (save(), load(), validateData(), handleErrors())
- [ ] T076 [US5] Implement pause/resume in Game.ts (freeze timers, stop game loop, display "PAUSED" message)
- [ ] T077 [US5] Implement restart in Game.ts (reset state, start new game)
- [ ] T078 [US5] Implement high score tracking in Game.ts (compare on game over, update if beaten)
- [ ] T079 [US5] Integrate StorageManager with Game.ts (save high score, load on startup, save settings)
- [ ] T080 [US5] Add high score display to Renderer.ts (show on main menu and game over screen)
- [ ] T081 [US5] Add next block preview to Renderer.ts (render nextPiece in preview area)
- [ ] T082 [US5] Verify User Story 5 acceptance scenarios: pause/resume works, restart works, high score persists, next block preview visible
- [ ] T083 [US5] Test localStorage persistence by closing/reopening browser

**Checkpoint**: All user stories complete - fully featured game

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [ ] T084 [P] Add detailed code comments to all non-trivial functions in src/game/, src/render/, src/audio/, src/input/, src/storage/
- [ ] T085 [P] Create tests/unit/edge-cases.test.ts with test cases for edge cases (localStorage full, audio context suspended, rapid input, etc.)
- [ ] T086 [P] Optimize memory usage (profile with Chrome DevTools, verify <50MB, fix any leaks)
- [ ] T087 [P] Optimize bundle size (run `npm run build`, verify dist/ <500KB, enable code splitting if needed)
- [ ] T088 Run full test suite with coverage report and verify ≥80% coverage across all modules
- [ ] T089 Run ESLint and fix all warnings/errors (`npm run lint:fix`)
- [ ] T090 Run Prettier to format all code (`npm run format`)
- [ ] T091 Run TypeScript type check and fix all errors (`npm run type-check`)
- [ ] T092 Test in Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ and fix any compatibility issues
- [ ] T093 Perform performance testing: verify 60fps stable, <50ms input latency, <2s load time, <50MB memory
- [ ] T094 Create production build (`npm run build`) and verify all assets load correctly
- [ ] T095 Validate against all success criteria from spec.md (functional, visual, audio, performance, quality)
- [ ] T096 Run quickstart.md validation (follow setup guide, verify all steps work)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Enhances US1 rendering but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Adds audio to US1 actions but independently testable
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Adds state management to US1 but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD workflow)
- Models/utilities before services
- Services before UI/rendering
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task T026: "Create tests/unit/game-state.test.ts"
Task T027: "Create tests/unit/movement.test.ts"
Task T028: "Create tests/unit/locking.test.ts"
Task T029: "Create tests/unit/line-clearing.test.ts"
Task T030: "Create tests/integration/gameplay-loop.test.ts"

# After tests written and failing, implement in sequence:
Task T031: "Create Game.ts" (depends on tests)
Task T032-T035: "Implement game logic" (sequential, same file)
Task T036-T037: "Create Renderer.ts" (parallel with T038-T039)
Task T038-T039: "Create InputHandler.ts" (parallel with T036-T037)
Task T040: "Create main.ts" (depends on Game, Renderer, InputHandler)
Task T041-T042: "Verify and test" (depends on implementation)
```
Task T036-T037: "Create Renderer.ts" (parallel with T038-T039)
Task T038-T039: "Create InputHandler.ts" (parallel with T036-T037)
Task T040: "Create main.ts" (depends on Game, Renderer, InputHandler)
Task T041-T042: "Verify and test" (depends on implementation)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- TDD is MANDATORY: Write tests FIRST, verify they FAIL, then implement
- Verify tests fail before implementing (RED phase)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Run `npm run test:coverage` frequently to track progress toward 80% target
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
