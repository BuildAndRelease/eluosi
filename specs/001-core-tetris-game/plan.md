# Implementation Plan: Core Tetris Game

**Branch**: `001-core-tetris-game` | **Date**: 2026-03-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-core-tetris-game/spec.md`

## Summary

Build a complete browser-based Tetris game with metallic visual theme, featuring classic gameplay mechanics (7 block types, rotation, line clearing, scoring), smooth 60fps rendering on HTML5 Canvas, metallic sound effects via Web Audio API, and localStorage persistence for high scores. Zero runtime dependencies, pure TypeScript implementation targeting modern browsers.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode enabled)
**Primary Dependencies**: ZERO runtime dependencies (Vite for build only)
**Storage**: localStorage (browser native API)
**Testing**: Vitest (unit + integration tests, 80% coverage target)
**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**Project Type**: Browser game (single-page application)
**Performance Goals**: 60fps stable, <50ms input latency, <2s load time
**Constraints**: <50MB memory, zero runtime dependencies, offline-capable, no backend
**Scale/Scope**: Single-player game, ~2000-3000 LOC, 7 game screens/states

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Code Quality Standards
- [x] Code simplicity: Minimal implementation, no over-engineering
- [x] Detailed comments: All non-trivial logic documented
- [x] Immutability: Pure functions for game state management
- [x] File organization: Feature-based structure (game/, render/, audio/, input/)
- [x] Functions <50 lines, files <800 lines
- [x] No hardcoded values (use constants)

### ✅ Testing Standards (NON-NEGOTIABLE)
- [x] TDD workflow for core game logic
- [x] 80% minimum coverage target
- [x] Unit tests: collision detection, rotation, line clearing, scoring
- [x] Integration tests: game state transitions, localStorage
- [x] Performance tests: 60fps validation

### ✅ User Experience Consistency
- [x] <50ms input latency requirement
- [x] 60fps stable frame rate
- [x] Intuitive keyboard controls (arrows, space, P, R)
- [x] Visual/audio feedback for all actions
- [x] <2s load time

### ✅ Performance Requirements
- [x] 60fps during gameplay
- [x] <50ms input to visual feedback
- [x] <2s first screen render
- [x] <50MB memory footprint
- [x] No memory leaks

### ✅ TypeScript & Dependency Management
- [x] TypeScript strict mode enabled
- [x] ZERO runtime dependencies
- [x] Dev dependencies only: Vite, Vitest, ESLint, Prettier
- [x] No frameworks (React/Vue/Angular)
- [x] No game engines (Phaser/PixiJS)

### ✅ Technical Constraints
- [x] HTML5 Canvas for rendering
- [x] Web Audio API for sound
- [x] localStorage for persistence
- [x] Vite for build tooling
- [x] No backend/CDN dependencies

### ✅ Design Principles
- [x] Metallic visual style (gradients, highlights, shadows)
- [x] Metallic sound effects (6 types)
- [x] Minimalist UI
- [x] 200-300ms line clear animation
- [x] 500ms lock delay

**Status**: ✅ ALL GATES PASSED - No violations, ready for Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-core-tetris-game/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: Technical research
├── data-model.md        # Phase 1: Game state data model
├── quickstart.md        # Phase 1: Development guide
├── contracts/           # Phase 1: Public API contracts
│   └── game-api.md      # GameAPI interface documentation
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
eluosi/
├── index.html           # Entry point with Canvas element
├── package.json         # Project metadata + dev dependencies
├── tsconfig.json        # TypeScript strict configuration
├── vite.config.ts       # Vite build configuration
├── .eslintrc.json       # ESLint rules
├── .prettierrc          # Prettier formatting
├── src/
│   ├── main.ts          # Application entry point
│   ├── game/            # Core game logic
│   │   ├── Game.ts      # Main game controller
│   │   ├── Piece.ts     # Tetromino definitions + logic
│   │   ├── Grid.ts      # 10×20 game grid management
│   │   ├── collision.ts # Collision detection system
│   │   ├── scoring.ts   # Score/level calculation
│   │   └── types.ts     # TypeScript interfaces
│   ├── render/          # Canvas rendering
│   │   ├── Renderer.ts  # Main renderer
│   │   ├── metallic.ts  # Metallic visual effects
│   │   └── animations.ts# Line clear animations
│   ├── input/           # Keyboard input handling
│   │   └── InputHandler.ts
│   ├── audio/           # Sound effects
│   │   └── SoundManager.ts
│   ├── storage/         # localStorage wrapper
│   │   └── StorageManager.ts
│   ├── config/          # Game constants
│   │   └── constants.ts # Block shapes, colors, speeds
│   └── utils/           # Helper functions
│       └── helpers.ts
├── assets/
│   └── sounds/          # Audio files (MP3/WebM)
│       ├── move.mp3
│       ├── rotate.mp3
│       ├── drop.mp3
│       ├── hard_drop.mp3
│       ├── clear.mp3
│       └── game_over.mp3
├── tests/
│   ├── unit/            # Unit tests
│   │   ├── collision.test.ts
│   │   ├── scoring.test.ts
│   │   ├── rotation.test.ts
│   │   └── grid.test.ts
│   └── integration/     # Integration tests
│       ├── game-flow.test.ts
│       ├── storage.test.ts
│       └── input.test.ts
└── dist/                # Production build output
```

**Structure Decision**: Single project structure chosen. Pure frontend game with no backend, so no need for separate frontend/backend directories. Feature-based organization (game/, render/, audio/, input/) aligns with constitution's modular design principle and single responsibility. Assets directory for sound files, tests directory with unit/integration split for 80% coverage target.

## Complexity Tracking

> **No violations detected - this section intentionally left empty**

All constitution gates passed without exceptions. Implementation follows all principles:
- Zero runtime dependencies (only dev tools)
- TypeScript strict mode
- Feature-based file organization
- TDD with 80% coverage
- Performance targets defined
- No frameworks or game engines

---

## Phase 0: Research & Technical Decisions

**Status**: ✅ COMPLETE (provided by user)

### Research Topics Completed

1. **Canvas Rendering Strategy**
   - Decision: Direct Canvas 2D API with requestAnimationFrame loop
   - Rationale: Best performance for 2D game, no overhead from frameworks
   - Alternatives: DOM rendering (too slow), WebGL (overkill for 2D)

2. **State Management Pattern**
   - Decision: Pure functions + immutable data structures
   - Rationale: Easier debugging, testing, potential replay functionality
   - Alternatives: Mutable state (harder to debug), Redux (unnecessary complexity)

3. **Audio Implementation**
   - Decision: Web Audio API with AudioContext
   - Rationale: Low latency (<100ms), precise timing, volume control
   - Alternatives: HTML5 Audio element (higher latency), no audio (poor UX)

4. **Build Tooling**
   - Decision: Vite
   - Rationale: Fast dev server, zero-config TypeScript, optimized builds
   - Alternatives: Webpack (slower), Parcel (less TypeScript support)

5. **Testing Framework**
   - Decision: Vitest
   - Rationale: Native Vite integration, Jest-compatible API, fast
   - Alternatives: Jest (slower with Vite), Mocha (more setup)

6. **Rotation System**
   - Decision: Simplified SRS (Super Rotation System) with basic wall kicks
   - Rationale: Standard Tetris behavior, manageable complexity
   - Alternatives: No wall kicks (frustrating), full SRS (over-engineered)

7. **Metallic Visual Effect**
   - Decision: Canvas gradients + manual highlights/shadows
   - Rationale: No dependencies, good performance, sufficient quality
   - Alternatives: CSS filters (can't use on Canvas), 3D rendering (overkill)

8. **Audio Asset Sourcing**
   - Decision: Freesound.org (CC0 licensed)
   - Rationale: Free, high quality, legally safe
   - Alternatives: Web Audio synthesis (time-consuming), paid assets (unnecessary cost)

### Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Rendering | HTML5 Canvas 2D | Best performance for 60fps 2D game, no framework overhead |
| State Management | Pure functions + immutable data | Easier debugging, testing, aligns with constitution |
| Audio Format | MP3 primary, WebM fallback | Best browser compatibility, small file sizes |
| Build Tool | Vite | Fast dev server, zero-config TypeScript, optimized production builds |
| Testing | Vitest | Native Vite integration, Jest-compatible, fast execution |
| Code Style | ESLint + Prettier | Automated formatting, consistent style, catches errors |
| Module System | ES Modules | Native browser support, tree-shaking, modern standard |
| Lock Delay | 500ms | Standard Tetris mechanic, improves playability |
| Line Clear Animation | 200-300ms | Balanced feedback without disrupting flow |
| Block Spawn Position | Row 0, columns 3-6 | Standard Tetris position, centered |

---

## Phase 1: Design Artifacts

### Data Model

See [data-model.md](./data-model.md) for complete entity definitions.

**Core Entities**:
- `Piece` (Tetromino): type, rotation, position, shape matrix
- `Grid`: 10×20 cell matrix, locked blocks
- `GameState`: status, score, level, current/next piece
- `PersistentData`: high score, statistics, settings

### Public API Contracts

See [contracts/game-api.md](./contracts/game-api.md) for complete interface documentation.

**GameAPI Interface**:
- `start()`, `pause()`, `resume()`, `reset()`
- `moveLeft()`, `moveRight()`, `moveDown()`, `hardDrop()`, `rotate()`
- `getGameState()`, `getHighScore()`

**GameEvents Interface**:
- `onScoreChange`, `onLevelChange`, `onLinesClear`, `onGameOver`, `onStateChange`

### Development Quickstart

See [quickstart.md](./quickstart.md) for setup instructions.

---

## Phase 2: Implementation Phases

### Phase 2.1: Project Setup (Day 1, ~3 hours)

**Goal**: Runnable TypeScript project with proper tooling

**Tasks**:
1. Initialize Vite + TypeScript project
2. Configure tsconfig.json (strict mode)
3. Setup ESLint + Prettier
4. Create directory structure (src/, assets/, tests/)
5. Create basic HTML with Canvas element
6. Verify `npm run dev` works

**Deliverables**:
- ✅ Project runs with `npm run dev`
- ✅ TypeScript strict mode enabled
- ✅ ESLint passes with zero warnings
- ✅ Directory structure matches plan
- ✅ Empty Canvas renders on page

**Dependencies**: None

---

### Phase 2.2: Core Game Logic (Day 2-3, ~10 hours)

**Goal**: Complete game mechanics without rendering

**Tasks**:
1. Define TypeScript interfaces (Piece, Grid, GameState)
2. Implement 7 Tetromino definitions (shapes, colors)
3. Create 10×20 grid data structure
4. Implement block generation (random, equal probability)
5. Implement movement logic (left, right, down)
6. Implement rotation logic (90° clockwise + simplified SRS wall kicks)
7. Implement collision detection (boundaries + blocks)
8. Implement lock delay (500ms)
9. Implement line clearing logic
10. Implement scoring system (50/300/500/1000 × (level+1))
11. Implement level progression (every 500 points)
12. Implement game over detection

**Deliverables**:
- ✅ All TypeScript types defined
- ✅ 7 block types with correct shapes
- ✅ Movement works without wall/block penetration
- ✅ Rotation with wall kicks functional
- ✅ Line clearing removes rows and shifts blocks down
- ✅ Scoring formula correct
- ✅ Game over triggers when top blocked
- ✅ Unit tests for all logic (80% coverage)

**Dependencies**: Phase 2.1 complete

**Testing Focus**:
- Collision detection accuracy
- Rotation edge cases (wall kicks)
- Line clearing with multiple rows
- Score calculation verification
- Level progression thresholds

---

### Phase 2.3: Rendering System (Day 4, ~8 hours)

**Goal**: Visual game with metallic theme at 60fps

**Tasks**:
1. Initialize Canvas context and sizing
2. Implement game loop with requestAnimationFrame
3. Render 10×20 grid background
4. Render current falling block
5. Render locked blocks in grid
6. Implement metallic visual effects (gradients, highlights, shadows)
7. Render next block preview
8. Render UI (score, level, high score)
9. Render game states (menu, playing, paused, game over)
10. Implement line clear animation (200-300ms)
11. Implement block lock flash effect

**Deliverables**:
- ✅ Game renders at stable 60fps
- ✅ Metallic visual effects on all blocks
- ✅ All 7 block types visually distinct
- ✅ UI displays all required information
- ✅ Animations smooth and satisfying
- ✅ All game states have proper screens

**Dependencies**: Phase 2.2 complete

**Performance Validation**:
- Chrome DevTools Performance tab shows 60fps
- No frame drops during gameplay
- Memory usage <50MB

**Metallic Effect Implementation**:
1. Base gradient (135° angle, 3 color stops)
2. Top-left highlight (semi-transparent white)
3. Bottom-right shadow (semi-transparent black)
4. 2px gray border for definition

---

### Phase 2.4: Input & Audio (Day 5, ~5 hours)

**Goal**: Responsive controls and immersive sound

**Tasks**:
1. Implement keyboard event listeners
2. Map keys to game actions (arrows, space, P, R)
3. Add input debouncing/throttling
4. Source 6 metallic sound effects (Freesound.org CC0)
5. Initialize Web Audio API (AudioContext)
6. Implement sound playback system
7. Add volume control (0-100%)
8. Add mute functionality
9. Verify <50ms input latency
10. Verify <100ms audio latency

**Deliverables**:
- ✅ All keyboard controls responsive
- ✅ Input latency <50ms verified
- ✅ 6 sound effects playing correctly
- ✅ Audio latency <100ms verified
- ✅ Volume control functional
- ✅ Mute works properly

**Dependencies**: Phase 2.3 complete

**Audio Assets**:
- move.mp3 (50ms, <50KB)
- rotate.mp3 (80ms, <50KB)
- drop.mp3 (100ms, <50KB)
- hard_drop.mp3 (150ms, <100KB)
- clear.mp3 (300ms, <100KB)
- game_over.mp3 (500ms, <100KB)

---

### Phase 2.5: Persistence & Optimization (Day 6, ~4 hours)

**Goal**: Data persistence and performance tuning

**Tasks**:
1. Create localStorage wrapper utility
2. Implement high score persistence
3. Implement statistics persistence (games played, lines cleared)
4. Implement settings persistence (volume, grid display)
5. Add localStorage error handling (graceful degradation)
6. Profile and optimize rendering (reduce redraws)
7. Profile and optimize memory usage
8. Optimize production build (code splitting, minification)

**Deliverables**:
- ✅ High score persists across sessions
- ✅ Statistics tracked accurately
- ✅ Settings saved and restored
- ✅ localStorage errors handled gracefully
- ✅ 60fps maintained after optimization
- ✅ Memory usage <50MB verified
- ✅ Production build <500KB

**Dependencies**: Phase 2.4 complete

**Optimization Targets**:
- Minimize Canvas redraws (dirty rectangle technique)
- Reuse objects instead of creating new ones in hot paths
- Lazy load audio files
- Tree-shake unused code in production

---

### Phase 2.6: Testing & Release (Day 7, ~8 hours)

**Goal**: Production-ready game

**Tasks**:
1. Run full functional test suite
2. Test in Chrome, Firefox, Safari, Edge
3. Run performance tests (fps, memory, load time)
4. Fix all P0/P1 bugs
5. Code review (ESLint, manual review)
6. Generate production build
7. Write deployment documentation
8. Create test report

**Deliverables**:
- ✅ All functional tests passing
- ✅ Works in all target browsers
- ✅ Performance targets met
- ✅ Zero P0/P1 bugs
- ✅ ESLint clean
- ✅ Production build ready
- ✅ Deployment docs complete
- ✅ Test report generated

**Dependencies**: Phase 2.5 complete

**Test Coverage**:
- Functional: All game features work
- Visual: Metallic theme consistent
- Audio: All sounds play correctly
- Performance: 60fps, <50ms latency, <50MB memory, <2s load
- Persistence: Data survives browser restart
- Compatibility: Chrome/Firefox/Safari/Edge

---

## Risk Management

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Metallic visual effects don't look good | Medium | Medium | Prepare simplified gradient fallback, iterate on design |
| Can't find suitable CC0 sound effects | Low | Medium | Use Web Audio API to synthesize simple tones as fallback |
| Rotation collision detection too complex | Medium | High | Use simplified SRS with only basic wall kicks, document edge cases |
| Performance doesn't meet 60fps target | Low | High | Profile early (Day 4), optimize rendering, reduce redraws |
| Browser compatibility issues | Medium | Medium | Test early in multiple browsers, use polyfills if needed |
| localStorage quota exceeded | Low | Low | Graceful degradation, warn user, continue without persistence |
| Audio latency too high | Low | Medium | Use Web Audio API (not HTML5 Audio), preload sounds |

---

## Timeline

**Total Duration**: 7 days (5-7 working days)

| Day | Phase | Hours | Status |
|-----|-------|-------|--------|
| 1 | Project Setup | 3h | Pending |
| 2-3 | Core Game Logic | 10h | Pending |
| 4 | Rendering System | 8h | Pending |
| 5 | Input & Audio | 5h | Pending |
| 6 | Persistence & Optimization | 4h | Pending |
| 7 | Testing & Release | 8h | Pending |

**Total Estimated Hours**: 38 hours

---

## Success Criteria

### Functional
- ✅ 7 Tetromino types fully implemented
- ✅ All keyboard controls work correctly
- ✅ Scoring system accurate (50/300/500/1000 × (level+1))
- ✅ Level progression every 500 points
- ✅ Game over detection correct
- ✅ Pause/resume/restart functional
- ✅ High score persistence works

### Visual
- ✅ Metallic theme on all blocks
- ✅ 60fps stable frame rate
- ✅ Line clear animation (200-300ms)
- ✅ Block lock flash effect
- ✅ All UI elements visible and styled
- ✅ All game states have proper screens

### Audio
- ✅ 6 sound effects play correctly
- ✅ Audio latency <100ms
- ✅ Volume control works
- ✅ Mute functionality works

### Performance
- ✅ First screen load <2 seconds
- ✅ Stable 60fps during gameplay
- ✅ Input latency <50ms
- ✅ Memory usage <50MB
- ✅ No memory leaks in 30+ minute sessions

### Quality
- ✅ 80% test coverage (unit + integration)
- ✅ Zero ESLint warnings
- ✅ TypeScript strict mode, no errors
- ✅ Works in Chrome/Firefox/Safari/Edge
- ✅ Production build <500KB

---

## Next Steps

1. **Immediate**: Begin Phase 2.1 (Project Setup)
2. **Parallel**: Start sourcing audio files from Freesound.org
3. **Daily**: Update progress tracking, run tests
4. **Continuous**: Monitor performance metrics, address issues early

**Command to generate tasks**: `/speckit.tasks`
