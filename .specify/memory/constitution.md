<!--
Sync Impact Report:
- Version: 2.0.0 → 2.1.0 (MINOR: Updated visual design principles to support colorful theme)
- Modified principles:
  * VII. Design Principles → Updated from metallic-only to multi-theme system with colorful as current theme
  * Project Context → Updated vision to reflect colorful aesthetic
- Added sections:
  * Visual Theme System (NEW) - Support for multiple visual themes
- Removed sections: N/A
- Templates requiring updates:
  ✅ plan-template.md (Constitution Check updated for colorful theme)
  ✅ tasks-template.md (Tasks align with colorful visual style)
- Follow-up TODOs: None
-->

# Eluosi Constitution

## Project Context

**Project Name**: Eluosi (俄罗斯方块 - Tetris)
**Vision**: Create a classic Tetris game with vibrant colorful aesthetics and glassmorphism effects, delivering smooth and immersive gameplay experience in the browser while maintaining code maintainability and extensibility.

**Architecture**: Pure frontend, zero backend, local-first data storage, progressive enhancement for modern browsers.

## Core Principles

### I. Code Quality Standards

Code MUST be simple, maintainable, readable, and follow established patterns:

- **Code Simplicity**: Write the MINIMAL code needed to solve the problem. Avoid over-engineering, premature abstractions, and unnecessary complexity. Simple solutions are easier to understand, test, and maintain.
- **Detailed Comments**: ALL non-trivial code MUST have clear, explanatory comments. Document WHY decisions were made, not just WHAT the code does. Include:
  - Function/method purpose and parameters
  - Complex logic explanations
  - Edge cases and assumptions
  - TODOs for future improvements
- **Immutability**: ALWAYS create new objects, NEVER mutate existing ones. Use pure functions with immutable data structures for game state management. This enables easier debugging, testing, and potential replay functionality.
- **File Organization**: Many small files (200-400 lines typical, 800 max) over few large files. High cohesion, low coupling. Organize by feature/domain (e.g., `rendering/`, `game-logic/`, `audio/`, `input/`), not by type.
- **Error Handling**: Handle errors explicitly at every level. Provide user-friendly messages in UI, detailed context in logs. Never silently swallow errors.
- **Input Validation**: Validate all user input at system boundaries. Use schema-based validation. Fail fast with clear messages. Never trust external data (including localStorage).
- **Code Readability**: Functions <50 lines, no deep nesting (>4 levels), no hardcoded values (use constants/config), well-named variables and functions.
- **Modular Design**: Single responsibility principle. Clear separation between game logic, rendering, audio, and input handling.

**Rationale**: Simple, well-documented code reduces technical debt, accelerates feature development, minimizes bugs, and enables new team members to onboard quickly. Quality standards prevent common pitfalls and ensure consistency across the codebase.

### II. Testing Standards (NON-NEGOTIABLE)

Test-Driven Development (TDD) is MANDATORY for core game logic. Minimum 80% code coverage required:

- **TDD Workflow**: Write tests FIRST → Tests FAIL (RED) → Implement minimal code → Tests PASS (GREEN) → Refactor (IMPROVE) → Verify coverage (80%+)
- **Test Types Required**:
  - Unit tests (game logic: collision detection, rotation, line clearing, scoring)
  - Integration tests (game state transitions, input handling, localStorage persistence)
  - Visual regression tests (rendering output validation - optional but recommended)
- **Test Isolation**: Each test must be independent, no shared state between tests, proper mocks for external dependencies (localStorage, Web Audio API, Canvas)
- **Coverage Verification**: Run coverage reports after implementation, address gaps before marking work complete
- **Performance Testing**: Verify 60fps rendering under typical game conditions

**Rationale**: TDD ensures game logic correctness from the start, prevents regressions, and serves as living documentation. 80% coverage provides confidence without diminishing returns of 100% coverage. Game logic bugs directly impact user experience.

### III. User Experience Consistency

User-facing features MUST provide consistent, intuitive, and responsive experiences:

- **Instant Response**: User input to screen feedback latency MUST be <50ms. Keyboard input handling must be immediate and predictable.
- **Visual Consistency**: 60fps stable frame rate, no stuttering or frame drops. Use requestAnimationFrame for smooth animations.
- **Intuitive Controls**: Keyboard controls MUST follow player conventions:
  - Arrow keys: Move left/right, soft drop, rotate
  - Space: Hard drop
  - P: Pause
  - R: Restart
  - No learning curve required
- **Clear Feedback**: Every operation MUST have visual/audio feedback:
  - Block movement: Visual update + subtle sound
  - Line clear: Animation + satisfying sound effect
  - Game over: Clear visual indication + sound
  - Level up: Visual celebration + sound
- **Loading States**: First screen load <2 seconds. Show loading indicator if assets loading.
- **Accessibility**: Keyboard-only navigation, clear visual indicators, option to disable sound effects.

**Rationale**: Responsive UX is critical for game feel. 50ms latency threshold ensures players feel in control. 60fps provides smooth visual experience. Consistent feedback creates satisfying gameplay loop.

### IV. Performance Requirements

Performance is a feature. Game MUST meet defined performance targets:

- **Frame Rate**: Stable 60fps during gameplay. No frame drops during block movement, rotation, or line clearing.
- **Input Latency**: Keyboard input to visual feedback <50ms (p95). Use event-driven input handling, not polling.
- **Load Time**: First screen render <2 seconds. Total asset loading <3 seconds.
- **Memory Usage**: <80MB total memory footprint. No memory leaks during extended gameplay sessions. (Updated from 50MB to accommodate CSS glassmorphism effects with backdrop-filter)
- **Resource Efficiency**: CPU usage <30% on modern hardware during active gameplay. Efficient Canvas rendering with minimal redraws.
- **Optimization**: Profile before optimizing. Use Chrome DevTools Performance tab. Document performance-critical sections. Avoid premature optimization.
- **Monitoring**: Track frame rate, input latency, memory usage during development. Set up performance budgets.

**Rationale**: Performance directly impacts game feel and player satisfaction. 60fps is the minimum for smooth gameplay. <50ms input latency ensures responsive controls. Defined targets prevent performance regressions.

### V. TypeScript & Dependency Management

TypeScript is the PRIMARY language. Dependencies MUST be ZERO (except dev dependencies):

- **TypeScript First**: ALL code MUST be written in TypeScript with strict mode enabled. Leverage TypeScript's type system for compile-time safety and better IDE support.
- **Strict Type Checking**: Enable strict mode in tsconfig.json. No `any` types except when interfacing with browser APIs (document these exceptions).
- **Zero Runtime Dependencies**: NO external runtime libraries. NO frameworks (React/Vue/Angular). NO game engines. Implement all game logic from scratch using vanilla TypeScript + browser APIs.
- **Dev Dependencies Only**: Only build tools and testing frameworks allowed as devDependencies:
  - Vite (build tool, dev server, TypeScript support)
  - Vitest or Jest (testing framework)
  - ESLint + TypeScript ESLint (linting)
  - Prettier (formatting)
- **Dependency Justification**: Any new dev dependency MUST be justified in plan.md. Prefer zero-config tools.
- **Type Definitions**: Use built-in TypeScript DOM types for browser APIs (Canvas, Web Audio API, localStorage).

**Rationale**: Zero runtime dependencies keep bundle size minimal, eliminate security vulnerabilities from third-party code, reduce maintenance burden, and ensure fast load times. TypeScript provides type safety without runtime overhead. Vanilla implementation provides full control and learning opportunity.

### VI. Technical Constraints

**MUST Use** (Required Technologies):
- **TypeScript**: Strict mode enabled, all code typed
- **HTML5 Canvas**: For game rendering (chosen for performance and animation suitability)
- **Web Audio API**: For sound effects and music (theme-appropriate sound design)
- **localStorage**: For game state persistence (high scores, settings)
- **Vite**: Build tool and dev server (fast, zero-config TypeScript support)

**MUST NOT Use** (Forbidden):
- Backend services or APIs
- External databases or cloud storage
- Heavy frameworks (React, Vue, Angular, Svelte)
- Game engines (Phaser, PixiJS, Three.js)
- Network-dependent resources (CDN libraries, external assets)
- jQuery or other DOM manipulation libraries

**Browser Compatibility**:
- Chrome 90+ (primary target)
- Firefox 88+
- Safari 14+
- Edge 90+
- No IE11 support required

**Rationale**: Canvas provides best performance for 2D game rendering. Web Audio API enables rich sound design. localStorage sufficient for local-first architecture. Vite provides excellent DX with minimal configuration. Constraints ensure lightweight, fast-loading game.

### VII. Design Principles

Visual and audio design MUST create immersive and engaging aesthetic. The game supports multiple visual themes with colorful style as the current active theme:

#### Current Theme: Colorful with Glassmorphism

- **Colorful Visual Style**:
  - Blocks MUST use vibrant colors with high saturation (80-90%)
  - Color palette: Cyan (#00D9FF), Yellow (#FFD700), Purple (#B24BF3), Green (#00FF7F), Red (#FF4757), Blue (#3742FA), Orange (#FF6348)
  - All colors MUST meet WCAG AA contrast requirements (4.5:1 minimum)
  - NO black, white, or gray tones for blocks
  - Distinct hues for easy differentiation between block types

- **Glassmorphism Background**:
  - Game area MUST have semi-transparent background with Gaussian blur effect
  - CSS backdrop-filter: blur(10px) for glassmorphism effect
  - Static gradient background (light purple to light blue, low saturation)
  - Fallback to simple transparency if backdrop-filter unsupported
  - Performance monitoring required (disable blur if <60fps)

- **Audio Immersion**:
  - Sound effects appropriate to visual theme
  - Audio format: MP3 or WebM for browser compatibility
  - Volume controls and mute option required
  - Sound effects MUST be short (<500ms) to avoid latency

- **Minimalist Interface**:
  - Clean layout with clear information hierarchy
  - Display: Current score, level, next block preview, high score
  - No unnecessary decorations or distractions
  - Focus on gameplay area

- **Visual Feedback**:
  - Line clear animation with colorful effects
  - Block lock-in animation (subtle flash)
  - Level up visual celebration (optional)
  - Game over screen with score summary

#### Legacy Theme: Metallic (Deprecated)

The original metallic theme (steel gray, chrome silver, brushed aluminum) has been replaced by the colorful theme. Metallic assets may be retained for potential future theme system.

#### Theme System Guidelines

- Visual themes MUST maintain performance targets (60fps, <80MB memory)
- All themes MUST meet accessibility standards (WCAG AA)
- Theme switching system is a potential future extension
- Current implementation focuses on colorful theme only

**Rationale**: Colorful theme with glassmorphism creates modern, vibrant visual identity and immersive experience. High-contrast colors improve accessibility and block differentiation. Audio feedback enhances satisfaction and game feel. Minimalist interface keeps focus on gameplay. Visual feedback makes game state changes clear and satisfying.

## Decision Records

Key technical decisions with rationale:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Rendering** | HTML5 Canvas | Better performance for game animations, easier pixel-perfect control, suitable for 60fps target |
| **State Management** | Pure functions + immutable data | Easier debugging, testing, and potential replay functionality. Aligns with functional programming principles |
| **Audio Format** | MP3/WebM | Best browser compatibility, small file sizes, adequate quality for game sound effects |
| **Build Tool** | Vite | Fast dev server, zero-config TypeScript support, excellent DX, optimized production builds |
| **Testing Framework** | Vitest (recommended) | Native Vite integration, fast, Jest-compatible API, TypeScript support out of the box |
| **Code Style** | ESLint + Prettier | Automated formatting and linting, consistent code style, catches common errors |
| **Module System** | ES Modules | Native browser support, tree-shaking, better for code splitting |
| **Visual Theme** | Colorful + Glassmorphism | Modern aesthetic, high accessibility (WCAG AA), vibrant user experience, replaces metallic theme |

## Project Boundaries

### Out of Scope (Will NOT Implement)

- Multiplayer/online functionality
- User account system
- Cloud save/sync
- Gamepad/controller support
- Mobile touch controls (Phase 1)
- Social features (sharing, leaderboards with friends)
- Monetization features
- Backend infrastructure

### Future Extensions (Potential Phase 2+)

- Skin/theme system (alternative visual styles)
- Multiple game modes (Marathon, Sprint, Ultra)
- Local leaderboard (top 10 scores)
- Replay functionality (record and playback games)
- Mobile touch controls
- Customizable key bindings
- Statistics tracking (total lines cleared, games played)

**Rationale**: Clear boundaries prevent scope creep and maintain focus on core gameplay experience. Local-first architecture enables offline play and simplicity. Future extensions provide growth path without compromising initial release quality.

## Quality Gates

All code changes MUST pass these gates before merge:

1. **Code Review**: At least one approval from team member. Address all CRITICAL and HIGH issues. Document MEDIUM issue deferrals.
2. **Test Coverage**: 80% minimum coverage for game logic. All tests passing.
3. **TypeScript Compliance**: All code in TypeScript with strict mode enabled. No `any` types without documented justification.
4. **Zero Dependencies**: No new runtime dependencies added. Dev dependencies justified in plan.md.
5. **Code Comments**: All non-trivial functions and complex logic have clear explanatory comments.
6. **Performance Validation**: 60fps stable frame rate verified. Input latency <50ms verified. No memory leaks detected.
7. **Linting/Formatting**: Zero ESLint errors. Code formatted with Prettier.
8. **Browser Compatibility**: Tested in Chrome, Firefox, Safari, Edge (latest versions).
9. **Audio/Visual Quality**: Visual theme aesthetic maintained. Sound effects appropriate and non-jarring.
10. **localStorage Handling**: Data persistence working correctly. Graceful handling of quota exceeded errors.

## Review Process

### Code Review Requirements

- **Scope**: Review for correctness, maintainability, security, performance, adherence to constitution principles, and game feel
- **Timing**: Reviews completed within 24 hours of submission
- **Feedback**: Constructive, specific, actionable. Distinguish between blocking issues and suggestions.
- **Resolution**: Author addresses feedback, reviewer re-reviews, approval granted when satisfied
- **Game Feel**: Reviewers MUST test gameplay changes to verify responsiveness and satisfaction

### Performance Review

- **Trigger**: Changes to rendering loop, game logic, input handling, or audio playback
- **Scope**: Frame rate profiling, input latency measurement, memory usage tracking
- **Tools**: Chrome DevTools Performance tab, Memory profiler
- **Baseline**: Compare against 60fps target and <50ms input latency requirement

### Visual/Audio Review

- **Trigger**: Changes to rendering, animations, sound effects, or UI
- **Scope**: Verify visual theme aesthetic maintained, animations smooth, sounds appropriate
- **Tools**: Manual testing in target browsers, visual inspection, audio playback testing

## Governance

This constitution supersedes all other practices and conventions. All team members MUST adhere to these principles.

### Amendment Process

1. **Proposal**: Document proposed change with rationale and impact analysis
2. **Review**: Team reviews proposal, provides feedback, discusses trade-offs
3. **Approval**: Requires consensus or majority vote (define threshold based on team size)
4. **Migration**: Create migration plan for existing code if needed
5. **Documentation**: Update constitution, increment version, communicate changes

### Versioning Policy

- **MAJOR**: Backward incompatible governance/principle removals or redefinitions, project scope changes
- **MINOR**: New principle/section added or materially expanded guidance
- **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements

### Compliance Review

- All PRs/reviews MUST verify compliance with constitution principles
- Violations MUST be justified in "Complexity Tracking" section of plan.md
- Unjustified violations block merge
- Quarterly audits to identify systemic compliance issues
- Performance benchmarks run weekly to catch regressions early

**Version**: 2.1.0 | **Ratified**: 2026-03-10 | **Last Amended**: 2026-03-13
