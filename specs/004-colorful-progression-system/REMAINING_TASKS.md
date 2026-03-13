# Implementation Guide: Remaining Tasks (37/60)

**Feature**: 004-colorful-progression-system
**Status**: 38% Complete (23/60 tasks)
**Last Updated**: 2026-03-13 09:50

## ✅ Completed Phases (23 tasks)

- **Phase 1**: Setup (3/3) ✅
- **Phase 2**: Foundational (4/4) ✅
- **Phase 3**: User Story 1 - Visual (9/9) ✅
- **Phase 4**: User Story 2 - Speed (7/7) ✅

## 🔄 Remaining Work (37 tasks)

### Phase 5: User Story 3 - Scoring (4/6 remaining)

**T026**: Update Game.ts to use calculateScore() from scoring.ts
```typescript
// In lockCurrentPiece() method, replace old scoring logic:
import { calculateScore } from './scoring';

// When lines are cleared:
const linesCleared = completeRows.length;
const points = calculateScore(linesCleared);
this.state = { ...this.state, score: this.state.score + points };
```

**T027**: Remove old SCORE_VALUES from constants.ts
```typescript
// Delete old scoring constants (already done - verify)
// SCORE_VALUES, POINTS_PER_LEVEL no longer needed
```

**T028**: Update onScoreChange callback to use new scoring
```typescript
// In Game.ts, ensure onScoreChange is called with new score:
this.onScoreChange?.(this.state.score);
```

**T029**: Test scoring integration manually
```bash
npm run dev
# Play game, clear 1/2/3/4 lines, verify scores: 10/25/40/55
```

---

### Phase 6: User Story 4 - Progressive Difficulty (19 tasks)

#### Leveling Tests (T030-T031)
**T030**: Create tests/unit/leveling.test.ts
```typescript
import { getLevelThreshold, getSpeedMultiplier, shouldAddObstacleRow } from '../../src/game/leveling';

describe('Leveling System', () => {
  it('should calculate level thresholds correctly', () => {
    expect(getLevelThreshold(1)).toBe(200);
    expect(getLevelThreshold(2)).toBe(400);
    expect(getLevelThreshold(3)).toBe(600);
  });

  it('should cap speed at 4x', () => {
    expect(getSpeedMultiplier(3)).toBe(4);
    expect(getSpeedMultiplier(10)).toBe(4);
  });

  it('should add obstacle rows at level 4+', () => {
    expect(shouldAddObstacleRow(3)).toBe(false);
    expect(shouldAddObstacleRow(4)).toBe(true);
  });
});
```

**T031**: Create tests/integration/leveling.test.ts
```typescript
// Test level progression, speed increases, obstacle row triggers
```

#### Leveling Implementation (T032-T037)
**T032**: Update Game.ts to check level-up conditions
```typescript
import { getLevelThreshold, shouldAddObstacleRow } from './leveling';

// After scoring:
const newScore = this.state.score + points;
const currentLevel = this.state.level;
const nextLevelThreshold = getLevelThreshold(currentLevel + 1);

if (newScore >= nextLevelThreshold) {
  const newLevel = currentLevel + 1;
  this.state = { ...this.state, level: newLevel, score: newScore };
  this.onLevelChange?.(newLevel);

  // Check if obstacle row should be added
  if (shouldAddObstacleRow(newLevel)) {
    this.addObstacleRow();
  }
} else {
  this.state = { ...this.state, score: newScore };
}
```

**T033**: Implement addObstacleRow() method in Game.ts
```typescript
import { generateObstacleRow, insertObstacleRow } from './obstacle-rows';
import { GRID_WIDTH } from '../config/constants';

private addObstacleRow(): void {
  try {
    const obstacleRow = generateObstacleRow(GRID_WIDTH);
    const newGrid = insertObstacleRow(this.state.grid.cells, obstacleRow);
    this.state = {
      ...this.state,
      grid: { ...this.state.grid, cells: newGrid }
    };
  } catch (error) {
    // Game over if obstacle row can't be inserted
    this.state = { ...this.state, status: 'gameover' };
    this.onGameOver?.(this.state.score);
  }
}
```

**T034**: Update level display in Renderer.ts
```typescript
// In renderSidebar(), ensure level is displayed correctly
ctx.fillText(`Level: ${state.level}`, x, y);
```

**T035**: Test level progression (manual)
**T036**: Test speed increases per level (manual)
**T037**: Test obstacle row generation at level 4+ (manual)

#### Obstacle Row Tests (T038-T039)
**T038**: Create tests/unit/obstacle-rows.test.ts
```typescript
import { generateObstacleRow, insertObstacleRow, validateObstacleRow } from '../../src/game/obstacle-rows';

describe('Obstacle Rows', () => {
  it('should generate row with exactly one gap', () => {
    const row = generateObstacleRow(10);
    expect(validateObstacleRow(row)).toBe(true);
  });

  it('should insert row at bottom', () => {
    const grid = Array(20).fill(null).map(() => Array(10).fill(null));
    const obstacleRow = generateObstacleRow(10);
    const newGrid = insertObstacleRow(grid, obstacleRow);

    expect(newGrid[19]).toEqual(obstacleRow);
  });

  it('should throw error if top row has blocks', () => {
    const grid = Array(20).fill(null).map(() => Array(10).fill(null));
    grid[0]![0] = '#FF0000'; // Block in top row

    const obstacleRow = generateObstacleRow(10);
    expect(() => insertObstacleRow(grid, obstacleRow)).toThrow();
  });
});
```

**T039**: Create tests/integration/obstacle-rows.test.ts

#### Obstacle Row Implementation (T040-T048)
**T040-T048**: Already implemented in Phase 2 (obstacle-rows.ts exists)
- Verify integration with Game.ts
- Test game over condition when obstacle row can't be inserted
- Test obstacle row clearing (should work like normal rows)

---

### Phase 7: Polish & Cross-Cutting Concerns (12 tasks)

#### Performance Monitoring (T049-T050)
**T049**: Add performance monitoring to Game.ts
```typescript
import { TARGET_FPS, MAX_INPUT_LATENCY_MS } from '../config/constants';

private lastFrameTime = 0;
private frameCount = 0;
private fps = 60;

private gameLoop = (): void => {
  const now = performance.now();
  const delta = now - this.lastFrameTime;

  // Calculate FPS
  this.frameCount++;
  if (this.frameCount % 60 === 0) {
    this.fps = 1000 / delta;
    if (this.fps < TARGET_FPS * 0.9) {
      console.warn(`Low FPS: ${this.fps.toFixed(1)}`);
    }
  }

  this.lastFrameTime = now;
  // ... rest of game loop
};
```

**T050**: Add input latency monitoring

#### Documentation (T051-T054)
**T051**: Update README.md with new features
**T052**: Add code comments to new modules
**T053**: Update CLAUDE.md with new tech stack
**T054**: Create CHANGELOG.md entry

#### Final Testing (T055-T060)
**T055**: Run full test suite
```bash
npm test
npm run test:coverage
```

**T056**: Manual gameplay testing
- Test all 4 user stories
- Verify visual appearance
- Check performance (60fps, <50ms latency)

**T057**: Browser compatibility testing
- Chrome, Firefox, Safari
- Verify backdrop-filter support

**T058**: Accessibility testing
- Color contrast (WCAG AA)
- Keyboard controls

**T059**: Performance profiling
```bash
npm run dev
# Open DevTools > Performance
# Record gameplay session
# Verify 60fps maintained
```

**T060**: Final code review
- Constitution compliance check
- Code quality review
- Test coverage verification (80% target)

---

## 🚀 Quick Implementation Commands

```bash
# Run tests
npm test

# Run specific test file
npm test -- tests/unit/leveling.test.ts

# Run with coverage
npm run test:coverage

# Start dev server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

---

## 📋 Implementation Checklist

### Phase 5: Scoring (4 tasks)
- [ ] T026: Update Game.ts scoring logic
- [ ] T027: Remove old constants
- [ ] T028: Update callbacks
- [ ] T029: Manual testing

### Phase 6: Leveling (19 tasks)
- [ ] T030-T031: Leveling tests
- [ ] T032-T037: Level progression
- [ ] T038-T039: Obstacle row tests
- [ ] T040-T048: Obstacle row integration

### Phase 7: Polish (12 tasks)
- [ ] T049-T050: Performance monitoring
- [ ] T051-T054: Documentation
- [ ] T055-T060: Final testing

---

## 🎯 Success Criteria

All 15 functional requirements must be met:
- ✅ FR-001: Glassmorphism background
- ✅ FR-002: Colorful blocks (7 colors)
- ✅ FR-003: 4x down key speed
- ⏳ FR-004-FR-015: Scoring, leveling, obstacle rows

All 7 success criteria must pass:
- ✅ SC-001: Colorful blocks visible
- ✅ SC-002: Glassmorphism applied
- ✅ SC-003: Down key 4x speed
- ⏳ SC-004-SC-007: Scoring, leveling, performance

---

**Estimated Time**: 2-3 hours for remaining 37 tasks
**Priority**: Complete Phase 5-6 first (core gameplay), then Phase 7 (polish)
