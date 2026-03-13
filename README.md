# Eluosi (俄罗斯方块) - Colorful Tetris

A modern, colorful Tetris game with glassmorphism effects and progressive difficulty system.

## Features

🎨 **Colorful Visual Style**
- 7 vibrant WCAG AA compliant colors
- Glassmorphism background with gradient (light purple → light blue)
- Semi-transparent blocks with glass effects

⚡ **Responsive Speed Control**
- Hold down arrow for 4x speed boost
- Multiplicative with level speed (up to 16x total)
- Smooth, responsive controls (<50ms latency)

📊 **Rewarding Scoring System**
- Non-linear scoring: 1 line = 10pts, 2 = 25pts, 3 = 40pts, 4 = 55pts
- Encourages strategic multi-line clears

📈 **Progressive Difficulty**
- Level progression: 200, 400, 600, 800... points
- Speed multipliers: 1x → 2x → 3x → 4x (capped)
- Obstacle rows at level 4+ with random gaps

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Controls

- **Arrow Keys**: Move left/right/down
- **Up Arrow**: Rotate piece
- **Down Arrow**: 4x speed (hold)
- **Space**: Instant drop
- **P**: Pause/Resume
- **R**: Restart (when game over)

## Game Mechanics

### Scoring
| Lines Cleared | Points |
|---------------|--------|
| 1 line        | 10     |
| 2 lines       | 25     |
| 3 lines       | 40     |
| 4 lines       | 55     |

### Level Progression
- **Level 0**: 1x speed (0-199 points)
- **Level 1**: 2x speed (200-399 points)
- **Level 2**: 3x speed (400-599 points)
- **Level 3+**: 4x speed (600+ points)
- **Level 4+**: Obstacle rows added each level

### Speed System
- **Base Speed**: Determined by level (1x-4x)
- **Down Key**: 4x multiplier (multiplicative)
- **Maximum Speed**: 16x (Level 3+ with down key held)

## Technical Stack

- **TypeScript 5.6**: Strict mode, type-safe
- **Vite 6.0**: Fast dev server, optimized builds
- **Vitest**: 80%+ test coverage
- **HTML5 Canvas**: 60fps rendering
- **Zero Dependencies**: Pure TypeScript implementation

## Project Structure

```
src/
├── config/          # Configuration (colors, constants)
├── game/            # Game logic (scoring, leveling, obstacles)
├── render/          # Rendering (glassmorphism, colorful blocks)
├── input/           # Input handling (4x speed control)
├── audio/           # Sound effects
├── storage/         # localStorage persistence
└── utils/           # Performance monitoring, animations

tests/
├── unit/            # Unit tests (39 tests)
└── integration/     # Integration tests

specs/
└── 004-colorful-progression-system/  # Complete feature documentation
```

## Performance

- **Target FPS**: 60fps
- **Input Latency**: <50ms
- **Memory**: <80MB
- **Browser Support**: Chrome 76+, Firefox 103+, Safari 9+

## Development

### Running Tests
```bash
# All tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Code Quality
```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npm run type-check
```

## Features by Version

### Version 1.0.0 (Current)
- ✅ Colorful visual style with glassmorphism
- ✅ Progressive difficulty system
- ✅ Enhanced scoring mechanics
- ✅ 4x speed control
- ✅ Obstacle rows at high levels

### Previous Versions
- **v0.3.0**: Glassmorphism foundation
- **v0.2.0**: Metallic visual style
- **v0.1.0**: Basic Tetris gameplay

## Constitution Compliance

This project follows strict development principles:
- ✅ TypeScript strict mode
- ✅ 80% test coverage
- ✅ Immutable data structures
- ✅ Pure functions
- ✅ Code comments
- ✅ Performance targets
- ✅ Zero runtime dependencies

See [Constitution](/.specify/memory/constitution.md) for details.

## Documentation

- **Feature Spec**: [specs/004-colorful-progression-system/spec.md](specs/004-colorful-progression-system/spec.md)
- **Implementation Plan**: [specs/004-colorful-progression-system/plan.md](specs/004-colorful-progression-system/plan.md)
- **Quickstart Guide**: [specs/004-colorful-progression-system/quickstart.md](specs/004-colorful-progression-system/quickstart.md)
- **Data Model**: [specs/004-colorful-progression-system/data-model.md](specs/004-colorful-progression-system/data-model.md)

## License

Private project - All rights reserved

## Credits

**Project**: Eluosi (俄罗斯方块)
**Feature**: Colorful Visual Style with Progressive Difficulty
**Implementation**: 2026-03-13
**Constitution**: v2.1.0

---

**Enjoy the colorful Tetris experience!** 🎨🎮
