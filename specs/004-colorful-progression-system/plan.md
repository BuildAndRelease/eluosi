# Implementation Plan: Colorful Visual Style with Progressive Difficulty System

**Branch**: `004-colorful-progression-system` | **Date**: 2026-03-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-colorful-progression-system/spec.md`

## Summary

This feature transforms the Tetris game from a metallic monochrome aesthetic to a vibrant colorful design with glassmorphism effects, while introducing a progressive difficulty system with enhanced scoring mechanics and obstacle rows at higher levels. The implementation includes:

1. **Visual Overhaul**: Replace black/white/gray blocks with colorful palette, add glassmorphism background (semi-transparent + Gaussian blur over static gradient)
2. **Enhanced Speed Control**: Implement multiplicative 4x speed boost when down key is held (e.g., level 2 = 12x base speed)
3. **Rewarding Scoring**: Non-linear scoring system (1 line: 10pts, 2 lines: 25pts, 3 lines: 40pts, 4 lines: 55pts)
4. **Progressive Difficulty**: Level-based speed increases (1x per level, max 4x), followed by obstacle row generation at higher levels
5. **Session-Only State**: Score and level reset on page refresh (no localStorage persistence for game state)

**Technical Approach**: Modify existing rendering system to support colorful blocks and glassmorphism effects, extend game logic for new scoring/leveling mechanics, add obstacle row generation system. All changes maintain zero-dependency constraint and 60fps performance target.

## Technical Context

**Language/Version**: TypeScript 5.6 (strict mode enabled)
**Primary Dependencies**: ZERO runtime dependencies (Vite 6.0 for build only)
**Storage**: localStorage (settings and high score only - NOT game state)
**Testing**: Vitest with 80% coverage requirement
**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**Project Type**: Browser-based game (single-page application)
**Performance Goals**: 60fps stable, <50ms input latency, <80MB memory
**Constraints**: Zero runtime dependencies, Canvas-based rendering, Web Audio API for sound
**Scale/Scope**: Single-player local game, ~20 source files, 4 new/modified modules

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check (Phase 0)

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Code Quality** | ✅ PASS | Plan follows immutability, file organization (<800 lines), detailed comments |
| **II. Testing (80% coverage)** | ✅ PASS | TDD approach planned for scoring, leveling, obstacle row logic |
| **III. UX Consistency** | ✅ PASS | Maintains <50ms input latency, 60fps target, keyboard controls unchanged |
| **IV. Performance** | ⚠️ REVIEW | Glassmorphism (backdrop-filter) may impact performance - needs profiling |
| **V. Zero Dependencies** | ✅ PASS | No new runtime dependencies, only CSS and TypeScript changes |
| **VI. Technical Constraints** | ✅ PASS | Canvas rendering, Web Audio API, localStorage, Vite build tool |
| **VII. Design Principles** | ⚠️ DEVIATION | **CRITICAL**: Spec requires colorful style, conflicts with metallic aesthetic in constitution |

### Constitution Deviation Analysis

**Deviation**: Feature spec explicitly requires "禁用黑白灰风格，改成更多视觉色彩的风格" (disable black/white/gray, use more colorful visual style), which directly conflicts with Constitution VII "Metallic Visual Style" (steel gray, chrome silver, brushed aluminum, copper accents).

**Justification**: This is an intentional design evolution requested by the user. The colorful style represents a new visual direction for the game while maintaining technical quality standards.

**Impact**:
- Constitution VII (Design Principles) will need amendment to support multiple visual themes
- Metallic aesthetic becomes "Theme 1", colorful aesthetic becomes "Theme 2"
- Future work: Theme system to allow users to switch between visual styles

**Approval**: User explicitly requested this change in feature spec. Proceeding with colorful implementation as specified.

### Performance Risk Mitigation

**Risk**: CSS `backdrop-filter: blur()` for glassmorphism may cause frame drops on lower-end devices.

**Mitigation Strategy**:
1. Profile glassmorphism rendering during Phase 1 implementation
2. Measure frame rate with blur effect enabled vs disabled
3. If <60fps detected: Implement fallback to simple semi-transparent background without blur
4. Add performance setting to toggle glassmorphism effect

## Project Structure

### Documentation (this feature)

```text
specs/004-colorful-progression-system/
├── plan.md              # This file
├── research.md          # Phase 0: CSS glassmorphism best practices, color palette design
├── data-model.md        # Phase 1: Extended GameState with level/scoring fields
├── quickstart.md        # Phase 1: Developer guide for colorful theme system
├── contracts/           # Phase 1: (N/A - no external interfaces)
└── tasks.md             # Phase 2: (created by /speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── game/
│   ├── Game.ts                    # [MODIFY] Add level progression, new scoring logic
│   ├── types.ts                   # [MODIFY] Extend GameState with level field
│   ├── grid.ts                    # [MODIFY] Add obstacle row generation
│   ├── scoring.ts                 # [NEW] Scoring calculation logic
│   └── leveling.ts                # [NEW] Level progression and speed calculation
├── render/
│   ├── Renderer.ts                # [MODIFY] Switch to colorful block rendering
│   ├── glass-colors.ts            # [MODIFY] Update color palette to vibrant colors
│   ├── GlassRenderer.ts           # [MODIFY] Add glassmorphism background rendering
│   └── styles.ts                  # [MODIFY] Update CSS for glassmorphism effects
├── input/
│   ├── InputHandler.ts            # [MODIFY] Update down key to 4x multiplier
├── config/
│   ├── constants.ts               # [MODIFY] Add scoring constants, level thresholds
│   └── colors.ts                  # [NEW] Colorful palette definitions
└── main.ts                        # [MODIFY] Wire up new scoring/leveling callbacks

tests/
├── unit/
│   ├── scoring.test.ts            # [NEW] Test scoring formulas
│   ├── leveling.test.ts           # [NEW] Test level progression logic
│   └── obstacle-rows.test.ts      # [NEW] Test obstacle row generation
└── integration/
    └── game-progression.test.ts   # [NEW] Test full game progression flow
```

**Structure Decision**: Existing single-project structure is maintained. New modules (`scoring.ts`, `leveling.ts`, `colors.ts`) added to appropriate directories. Modifications to existing files follow established patterns (immutability, pure functions, clear separation of concerns).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Constitution VII (Metallic Style) | User explicitly requested colorful visual style as core feature requirement | Keeping metallic style would fail to deliver user's primary requirement (FR-002: colorful blocks) |
| Memory Budget (80MB vs 50MB) | Glassmorphism backdrop-filter increases memory usage | Removing glassmorphism would fail FR-001 (semi-transparent + Gaussian blur background) |

**Note**: Both violations are justified by explicit feature requirements. Constitution will be updated post-implementation to support multiple visual themes.

---

## Phase 0: Research & Technical Decisions

**Status**: ⏳ In Progress

### Research Tasks

1. **CSS Glassmorphism Performance**
   - Research: Best practices for `backdrop-filter: blur()` performance
   - Investigate: Browser compatibility and fallback strategies
   - Benchmark: Memory and frame rate impact of blur effects
   - Output: Performance guidelines and fallback implementation strategy

2. **Colorful Palette Design**
   - Research: Accessible color combinations for 7 Tetris blocks
   - Ensure: High contrast ratios (WCAG AA compliance)
   - Define: Vibrant colors excluding black/white/gray
   - Output: Color palette with hex codes and accessibility notes

3. **Multiplicative Speed Mechanics**
   - Research: Game feel implications of 12x speed at level 2
   - Analyze: Player control at extreme speeds (up to 48x at level 3)
   - Consider: Input buffering or speed capping strategies
   - Output: Speed calculation formula and UX recommendations

4. **Obstacle Row Generation**
   - Research: Random gap positioning algorithms
   - Ensure: Fair distribution (no repeated gap positions)
   - Define: Block color selection for obstacle rows
   - Output: Obstacle row generation algorithm

### Research Output

See [research.md](./research.md) for detailed findings.

---

## Phase 1: Design & Contracts

**Status**: ⏳ Pending (blocked by Phase 0)

### Data Model

See [data-model.md](./data-model.md) for complete entity definitions.

**Key Changes**:
- `GameState`: level field already exists (verified in types.ts)
- `GameState`: Scoring logic moves to separate module (pure functions)
- `Grid`: Add `addObstacleRow()` method for bottom-up row insertion
- `Constants`: Add `SCORING_TABLE`, `LEVEL_THRESHOLDS`, `SPEED_MULTIPLIERS`

### Interface Contracts

**N/A**: This is a single-player browser game with no external interfaces. All changes are internal to the application.

### Quickstart Guide

See [quickstart.md](./quickstart.md) for developer onboarding.

**Topics Covered**:
- Colorful theme architecture
- Scoring and leveling system overview
- Glassmorphism rendering pipeline
- Testing strategy for game progression

---

## Phase 2: Implementation Tasks

**Status**: ⏳ Pending (use `/speckit.tasks` command)

Tasks will be generated in [tasks.md](./tasks.md) with dependency ordering and acceptance criteria.

**Expected Task Categories**:
1. Visual System (glassmorphism, colorful blocks)
2. Scoring System (new formulas, level progression)
3. Speed Control (multiplicative down key, level-based speed)
4. Obstacle Rows (generation, collision, game over)
5. Testing (unit tests, integration tests, performance validation)
6. Documentation (code comments, quickstart updates)

---

## Post-Design Constitution Re-Check

**Status**: ⏳ Pending (after Phase 1 completion)

Will re-evaluate:
- Performance impact of glassmorphism (actual measurements)
- Memory usage with colorful rendering
- Frame rate stability at high speeds (12x-48x)
- Test coverage achievement (80% target)

---

## Notes

- **Breaking Change**: Visual style completely changes from metallic to colorful. Users will notice immediately.
- **No Migration**: Session-only state means no data migration needed (score/level reset on refresh).
- **Performance Critical**: Glassmorphism and high-speed gameplay require careful optimization.
- **Constitution Update**: Post-implementation, update Constitution VII to support theme system.
