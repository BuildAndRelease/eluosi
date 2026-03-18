# Quickstart: Progressive Speed and Obstacle Difficulty System

**Feature**: 005-speed-obstacle-progression
**Branch**: `005-speed-obstacle-progression`

## Development Commands

```bash
# Run all tests (TDD: run before writing code to see RED)
npm test

# Run only affected unit tests
npx vitest run tests/unit/leveling.test.ts tests/unit/obstacle-rows.test.ts tests/unit/speed-control.test.ts

# Run all tests with coverage
npm run test:coverage

# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

## TDD Workflow for This Feature

```bash
# Step 1: Update tests first (RED phase)
# Edit tests/unit/leveling.test.ts — update speed multiplier assertions
# Edit tests/unit/obstacle-rows.test.ts — update gap count assertions
npm test  # Should FAIL (tests expect new values, code has old values)

# Step 2: Implement changes (GREEN phase)
# Edit src/config/constants.ts — update SPEED_MULTIPLIERS, add gap constants
# Edit src/game/leveling.ts — update getSpeedMultiplier() and LEVEL_CONFIG
# Edit src/game/obstacle-rows.ts — update generateObstacleRow() and validateObstacleRow()
npm test  # Should PASS

# Step 3: Lint and type-check
npm run lint
npm run type-check

# Step 4: Build verification
npm run build
```

## Key Files

| File | Purpose |
|------|---------|
| `src/config/constants.ts` | Speed multiplier values and gap range constants |
| `src/game/leveling.ts` | `getSpeedMultiplier()` function and `LEVEL_CONFIG` |
| `src/game/obstacle-rows.ts` | `generateObstacleRow()` and `validateObstacleRow()` |
| `tests/unit/leveling.test.ts` | Speed multiplier unit tests |
| `tests/unit/obstacle-rows.test.ts` | Gap count unit tests |
