# Research: Core Tetris Game

**Feature**: Core Tetris Game
**Created**: 2026-03-12
**Purpose**: Document technical research and decisions made during planning

---

## Research Summary

All technical decisions for this project were provided upfront based on the project constitution and detailed user requirements. No additional research was needed as the technology stack, architecture, and implementation approach were clearly defined.

---

## Key Technical Decisions

### 1. Rendering Technology

**Decision**: HTML5 Canvas 2D API

**Rationale**:
- Best performance for 60fps 2D game rendering
- Direct pixel control for metallic effects
- No framework overhead
- Native browser support (no dependencies)

**Alternatives Considered**:
- DOM rendering: Too slow for 60fps, layout thrashing issues
- WebGL: Overkill for 2D game, unnecessary complexity
- SVG: Poor performance for frequent updates

**References**:
- Constitution VI: Technical Constraints (Canvas required)
- Performance target: 60fps stable

---

### 2. State Management

**Decision**: Pure functions with immutable data structures

**Rationale**:
- Easier debugging (no hidden mutations)
- Simpler testing (predictable state transitions)
- Enables potential replay functionality
- Aligns with constitution principle I (Immutability)

**Alternatives Considered**:
- Mutable state: Harder to debug, prone to bugs
- Redux/MobX: Unnecessary complexity for single-player game
- Event sourcing: Over-engineered for this scope

**References**:
- Constitution I: Code Quality Standards (Immutability)
- Data model: All state updates create new objects

---

### 3. Audio Implementation

**Decision**: Web Audio API

**Rationale**:
- Low latency (<100ms requirement)
- Precise timing control
- Volume control built-in
- Native browser support

**Alternatives Considered**:
- HTML5 `<audio>` element: Higher latency (200-300ms)
- No audio: Poor user experience
- Third-party library: Violates zero-dependency constraint

**References**:
- Constitution VI: Technical Constraints (Web Audio API required)
- FR-051: Audio latency <100ms

---

### 4. Build Tooling

**Decision**: Vite

**Rationale**:
- Fast dev server with HMR
- Zero-config TypeScript support
- Optimized production builds
- Small, focused tool (aligns with simplicity principle)

**Alternatives Considered**:
- Webpack: Slower dev server, more configuration
- Parcel: Less mature TypeScript support
- Rollup: More manual setup required
- esbuild: Less ecosystem support

**References**:
- Constitution VI: Technical Constraints (Vite required)
- Decision Records: Build tool choice

---

### 5. Testing Framework

**Decision**: Vitest

**Rationale**:
- Native Vite integration (same config)
- Jest-compatible API (familiar)
- Fast execution (ESM native)
- Built-in coverage reporting

**Alternatives Considered**:
- Jest: Slower with Vite, requires transform
- Mocha + Chai: More setup, less integrated
- Jasmine: Older, less TypeScript support

**References**:
- Constitution II: Testing Standards (80% coverage)
- Technical Context: Vitest chosen

---

### 6. Rotation System

**Decision**: Simplified SRS (Super Rotation System)

**Rationale**:
- Standard Tetris behavior (player expectations)
- Manageable complexity (4 wall kick offsets)
- Good balance between playability and implementation effort

**Alternatives Considered**:
- No wall kicks: Frustrating for players
- Full SRS: Over-engineered (5 offsets per rotation state)
- Classic rotation: Outdated, poor UX

**Implementation**:
```typescript
// Wall kick offsets (simplified SRS)
const wallKicks = [
  { x: 0, y: 0 },   // No offset
  { x: -1, y: 0 },  // One left
  { x: 1, y: 0 },   // One right
  { x: 0, y: -1 }   // One up
];
```

**References**:
- FR-004: Simplified SRS wall kick rules
- Risk Management: Rotation complexity mitigation

---

### 7. Metallic Visual Effects

**Decision**: Canvas gradients + manual highlights/shadows

**Rationale**:
- No dependencies required
- Good performance (cached gradients)
- Sufficient visual quality
- Full control over appearance

**Alternatives Considered**:
- CSS filters: Can't apply to Canvas content
- 3D rendering (Three.js): Overkill, violates zero-dependency
- Pre-rendered sprites: Less flexible, larger assets

**Implementation Approach**:
1. Create linear gradient (135° angle, 3 color stops)
2. Draw base block with gradient fill
3. Add semi-transparent white highlight (top-left)
4. Add semi-transparent black shadow (bottom-right)
5. Draw 2px gray border

**References**:
- Constitution VII: Design Principles (Metallic style)
- FR-036: Metallic appearance requirement
- Phase 2.3: Rendering system tasks

---

### 8. Audio Asset Sourcing

**Decision**: Freesound.org (CC0 licensed)

**Rationale**:
- Free and legally safe (CC0 = public domain)
- High quality metallic sound effects available
- Large library to choose from
- No attribution required

**Alternatives Considered**:
- Web Audio synthesis: Time-consuming, may not sound metallic
- Paid assets (AudioJungle): Unnecessary cost
- Kenney.nl: Good but limited metallic sounds

**Asset Requirements**:
- Format: MP3 primary, WebM fallback
- Duration: 50-500ms per sound
- File size: <100KB per asset
- Quality: 44.1kHz, 16-bit

**References**:
- Constitution assumptions: CC0 audio sources
- Phase 2.4: Audio asset collection task

---

### 9. Lock Delay Mechanism

**Decision**: 500ms lock delay

**Rationale**:
- Standard Tetris mechanic (player expectations)
- Improves playability (allows last-second adjustments)
- Balances challenge and forgiveness

**Alternatives Considered**:
- No lock delay: Too harsh, frustrating
- 1000ms delay: Too forgiving, reduces challenge
- Infinite lock delay: Exploitable, breaks game balance

**Implementation**:
- Start timer when piece touches bottom/blocks
- Reset timer on successful move/rotate
- Lock piece when timer expires
- Cancel timer if piece moves away from bottom

**References**:
- Clarification Q5: 500ms lock delay chosen
- FR-011a: Lock delay requirement

---

### 10. Line Clear Animation

**Decision**: 200-300ms duration

**Rationale**:
- Balanced feedback (visible but not disruptive)
- Maintains game flow
- Satisfying visual reward

**Alternatives Considered**:
- 100-150ms: Too fast, players miss it
- 400-500ms: Too slow, disrupts rhythm
- No animation: Poor feedback, unsatisfying

**Implementation**:
- Fade out cleared rows over 250ms
- Use easing function (ease-out)
- Play "clear" sound effect simultaneously
- Block new piece spawn until animation complete

**References**:
- Clarification Q4: 200-300ms chosen
- FR-039: Line clear animation requirement

---

## Technology Stack Summary

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| Language | TypeScript | 5.x | Type safety, constitution requirement |
| Build Tool | Vite | 5.x | Fast dev server, zero-config TS |
| Testing | Vitest | 1.x | Vite integration, Jest-compatible |
| Linting | ESLint | 8.x | Code quality, catch errors |
| Formatting | Prettier | 3.x | Consistent style |
| Rendering | Canvas 2D | Native | Performance, no dependencies |
| Audio | Web Audio API | Native | Low latency, volume control |
| Storage | localStorage | Native | Persistence, no backend |
| Runtime Deps | NONE | - | Constitution requirement |

---

## Architecture Decisions

### Pure Frontend Architecture

**Decision**: No backend, all logic in browser

**Rationale**:
- Constitution requirement (pure frontend)
- Simpler deployment (static hosting)
- Offline-capable
- No server costs

**Implications**:
- High scores stored locally only
- No multiplayer functionality
- No cloud sync
- No server-side validation

---

### Feature-Based File Organization

**Decision**: Organize by feature (game/, render/, audio/, input/)

**Rationale**:
- Constitution I: File Organization (by feature, not type)
- High cohesion, low coupling
- Easier to navigate
- Clear module boundaries

**Structure**:
```
src/
├── game/       # Core game logic
├── render/     # Canvas rendering
├── audio/      # Sound effects
├── input/      # Keyboard handling
├── storage/    # localStorage wrapper
└── config/     # Constants
```

---

### Immutable State Management

**Decision**: All state updates create new objects

**Rationale**:
- Constitution I: Immutability principle
- Easier debugging (no hidden mutations)
- Simpler testing (pure functions)
- Enables time-travel debugging

**Pattern**:
```typescript
// ❌ Mutation
gameState.score += 100;

// ✅ Immutable update
gameState = {
  ...gameState,
  score: gameState.score + 100
};
```

---

## Performance Considerations

### Rendering Optimization

**Strategy**: Minimize Canvas redraws

**Techniques**:
- Dirty rectangle tracking (only redraw changed areas)
- Cache gradient objects (create once, reuse)
- Use offscreen canvas for complex effects
- Batch draw calls

**Target**: 60fps stable (16.67ms per frame)

---

### Memory Management

**Strategy**: Reuse objects, avoid allocations in hot paths

**Techniques**:
- Pre-allocate Piece shape matrices (28 total: 7 types × 4 rotations)
- Reuse AudioBuffer objects
- Clear references to prevent leaks
- Profile with Chrome DevTools Memory tab

**Target**: <50MB total memory

---

### Input Latency

**Strategy**: Event-driven input handling

**Techniques**:
- Use `keydown` events (not polling)
- Process input immediately (no queuing)
- Update state synchronously
- Render on next frame (requestAnimationFrame)

**Target**: <50ms input to visual feedback

---

## Risk Mitigation

### Metallic Effects Quality

**Risk**: Visual effects may not look good enough

**Mitigation**:
- Iterate on gradient design early (Day 4)
- Prepare simplified fallback (solid colors + border)
- Test on multiple displays
- Get user feedback

---

### Audio Asset Availability

**Risk**: Can't find suitable CC0 metallic sounds

**Mitigation**:
- Search Freesound.org early (Day 1-2)
- Fallback: Use Web Audio API to synthesize tones
- Alternative sources: OpenGameArt.org, Kenney.nl

---

### Performance Target

**Risk**: Can't achieve 60fps stable

**Mitigation**:
- Profile early (Day 4)
- Optimize rendering (dirty rectangles)
- Reduce redraws (cache gradients)
- Test on lower-end hardware

---

## Open Questions

**None** - All technical decisions finalized during planning phase.

---

## References

- [Constitution](.specify/memory/constitution.md)
- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Data Model](./data-model.md)
- [Game API Contract](./contracts/game-api.md)

---

## Conclusion

All technical research complete. Technology stack chosen based on:
1. Constitution requirements (zero dependencies, TypeScript, Canvas, Web Audio)
2. Performance targets (60fps, <50ms latency, <50MB memory)
3. Simplicity principle (minimal, no over-engineering)
4. Best practices (TDD, immutability, feature-based organization)

Ready to proceed with Phase 2 implementation.
