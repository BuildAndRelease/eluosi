# Game API Contract

**Feature**: Core Tetris Game
**Created**: 2026-03-12
**Purpose**: Define the public API interface for game control and state access

---

## Overview

The Game API provides programmatic control over the Tetris game. This is the public interface that external code (UI, tests, extensions) uses to interact with the game engine.

**Design Principle**: Minimal, intention-revealing interface. All methods are synchronous except event callbacks.

---

## GameAPI Interface

### Control Methods

#### `start(): void`

**Purpose**: Start a new game

**Preconditions**:
- Game status must be `menu` or `gameover`

**Postconditions**:
- Game status becomes `playing`
- Grid initialized (all cells null)
- Score, level, lines reset to 0
- Current and next pieces generated
- Game loop starts

**Side Effects**:
- Triggers `onStateChange` event
- Starts automatic piece falling

**Example**:
```typescript
game.start();
// Game begins, first piece appears at top
```

---

#### `pause(): void`

**Purpose**: Pause the game

**Preconditions**:
- Game status must be `playing`

**Postconditions**:
- Game status becomes `paused`
- All timers frozen
- Piece stops falling

**Side Effects**:
- Triggers `onStateChange` event
- Stops game loop

**Example**:
```typescript
game.pause();
// Game freezes, "PAUSED" message displays
```

---

#### `resume(): void`

**Purpose**: Resume paused game

**Preconditions**:
- Game status must be `paused`

**Postconditions**:
- Game status becomes `playing`
- Timers resume from paused state
- Piece continues falling

**Side Effects**:
- Triggers `onStateChange` event
- Restarts game loop

**Example**:
```typescript
game.resume();
// Game continues from exact paused state
```

---

#### `reset(): void`

**Purpose**: Reset game to initial state

**Preconditions**: None

**Postconditions**:
- Game status becomes `menu`
- All game state cleared
- High score preserved (if applicable)

**Side Effects**:
- Triggers `onStateChange` event
- Stops game loop
- Saves statistics to localStorage

**Example**:
```typescript
game.reset();
// Returns to main menu
```

---

### Movement Methods

#### `moveLeft(): void`

**Purpose**: Move current piece one cell left

**Preconditions**:
- Game status must be `playing`
- Current piece must exist

**Postconditions**:
- If valid: Piece position.x decreases by 1
- If invalid (collision): No change

**Side Effects**:
- Triggers `onScoreChange` event (no score change, but UI may update)
- Plays "move" sound effect
- Resets lock delay timer if piece was touching bottom

**Collision Check**:
- Left boundary (x >= 0)
- Locked blocks in grid

**Example**:
```typescript
game.moveLeft();
// Piece shifts left if space available
```

---

#### `moveRight(): void`

**Purpose**: Move current piece one cell right

**Preconditions**:
- Game status must be `playing`
- Current piece must exist

**Postconditions**:
- If valid: Piece position.x increases by 1
- If invalid (collision): No change

**Side Effects**:
- Triggers `onScoreChange` event
- Plays "move" sound effect
- Resets lock delay timer if piece was touching bottom

**Collision Check**:
- Right boundary (x < 10)
- Locked blocks in grid

**Example**:
```typescript
game.moveRight();
// Piece shifts right if space available
```

---

#### `moveDown(): void`

**Purpose**: Move current piece one cell down (soft drop)

**Preconditions**:
- Game status must be `playing`
- Current piece must exist

**Postconditions**:
- If valid: Piece position.y increases by 1
- If invalid (bottom reached): Start lock delay (500ms)

**Side Effects**:
- Plays "drop" sound effect
- If piece locks: Triggers line clear check, score update, next piece spawn

**Collision Check**:
- Bottom boundary (y < 20)
- Locked blocks in grid

**Example**:
```typescript
game.moveDown();
// Piece falls one cell faster
```

---

#### `hardDrop(): void`

**Purpose**: Instantly drop piece to lowest valid position and lock immediately

**Preconditions**:
- Game status must be `playing`
- Current piece must exist

**Postconditions**:
- Piece moves to lowest valid y position
- Piece locks immediately (no lock delay)
- Line clear check performed
- Next piece spawns

**Side Effects**:
- Plays "hard_drop" sound effect
- Triggers `onScoreChange` if lines cleared
- Triggers `onLinesClear` if lines cleared
- Triggers `onLevelChange` if level increased
- May trigger `onGameOver` if top blocked

**Example**:
```typescript
game.hardDrop();
// Piece instantly drops and locks
```

---

#### `rotate(): void`

**Purpose**: Rotate current piece 90° clockwise

**Preconditions**:
- Game status must be `playing`
- Current piece must exist

**Postconditions**:
- If valid: Piece rotation increments (mod 4), shape matrix rotates
- If invalid without wall kick: No change
- If valid with wall kick: Piece rotates and position adjusted

**Side Effects**:
- Plays "rotate" sound effect
- Resets lock delay timer if piece was touching bottom

**Collision Check**:
- Try rotation at current position
- If collision: Try simplified SRS wall kicks (up to 4 offsets)
- If all fail: Ignore rotation

**Wall Kick Offsets** (simplified SRS):
1. (0, 0) - No offset
2. (-1, 0) - One left
3. (+1, 0) - One right
4. (0, -1) - One up

**Example**:
```typescript
game.rotate();
// Piece rotates clockwise if space allows
```

---

### Query Methods

#### `getGameState(): Readonly<GameState>`

**Purpose**: Get current complete game state

**Preconditions**: None

**Postconditions**: None (read-only)

**Returns**: Immutable snapshot of current GameState

**Example**:
```typescript
const state = game.getGameState();
console.log(`Score: ${state.score}, Level: ${state.level}`);
```

---

#### `getHighScore(): number`

**Purpose**: Get the all-time high score

**Preconditions**: None

**Postconditions**: None (read-only)

**Returns**: High score from localStorage, or 0 if none

**Example**:
```typescript
const highScore = game.getHighScore();
console.log(`High Score: ${highScore}`);
```

---

## GameEvents Interface

### Event Callbacks

All events are optional. Register callbacks to receive notifications of game state changes.

#### `onScoreChange(score: number): void`

**Trigger**: Score changes (line clear)

**Parameters**:
- `score`: New total score

**Example**:
```typescript
game.onScoreChange = (score) => {
  document.getElementById('score').textContent = score.toString();
};
```

---

#### `onLevelChange(level: number): void`

**Trigger**: Level increases (every 500 points)

**Parameters**:
- `level`: New level (0-15)

**Side Effects**:
- Fall speed automatically adjusts

**Example**:
```typescript
game.onLevelChange = (level) => {
  console.log(`Level up! Now at level ${level}`);
};
```

---

#### `onLinesClear(count: number): void`

**Trigger**: One or more lines cleared

**Parameters**:
- `count`: Number of lines cleared (1-4)

**Example**:
```typescript
game.onLinesClear = (count) => {
  if (count === 4) {
    console.log('TETRIS!');
  }
};
```

---

#### `onGameOver(finalScore: number): void`

**Trigger**: Game ends (top blocked)

**Parameters**:
- `finalScore`: Final score achieved

**Side Effects**:
- High score updated if beaten
- Statistics saved to localStorage

**Example**:
```typescript
game.onGameOver = (finalScore) => {
  alert(`Game Over! Final Score: ${finalScore}`);
};
```

---

#### `onStateChange(newState: GameStatus): void`

**Trigger**: Game status changes (menu/playing/paused/gameover)

**Parameters**:
- `newState`: New game status

**Example**:
```typescript
game.onStateChange = (newState) => {
  document.body.className = `state-${newState}`;
};
```

---

## Usage Examples

### Basic Game Loop

```typescript
import { Game } from './game/Game';

const game = new Game();

// Setup event handlers
game.onScoreChange = (score) => updateScoreDisplay(score);
game.onLevelChange = (level) => updateLevelDisplay(level);
game.onGameOver = (score) => showGameOverScreen(score);

// Start game
game.start();

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (game.getGameState().status !== 'playing') return;

  switch (e.key) {
    case 'ArrowLeft': game.moveLeft(); break;
    case 'ArrowRight': game.moveRight(); break;
    case 'ArrowDown': game.moveDown(); break;
    case 'ArrowUp': game.rotate(); break;
    case ' ': game.hardDrop(); break;
    case 'p': game.pause(); break;
  }
});
```

### Testing Example

```typescript
import { describe, it, expect } from 'vitest';
import { Game } from './game/Game';

describe('Game API', () => {
  it('should start game and initialize state', () => {
    const game = new Game();
    game.start();

    const state = game.getGameState();
    expect(state.status).toBe('playing');
    expect(state.score).toBe(0);
    expect(state.level).toBe(0);
    expect(state.currentPiece).not.toBeNull();
  });

  it('should move piece left when valid', () => {
    const game = new Game();
    game.start();

    const initialX = game.getGameState().currentPiece!.position.x;
    game.moveLeft();
    const newX = game.getGameState().currentPiece!.position.x;

    expect(newX).toBe(initialX - 1);
  });

  it('should clear lines and update score', () => {
    const game = new Game();
    game.start();

    // Setup: Fill bottom row except one cell
    // ... (test setup code)

    // Drop piece to complete line
    game.hardDrop();

    const state = game.getGameState();
    expect(state.lines).toBe(1);
    expect(state.score).toBe(50); // 50 × (0 + 1)
  });
});
```

---

## Error Handling

### Invalid State Transitions

Methods that require specific game states will silently ignore calls when preconditions not met:

```typescript
game.start();  // OK: status = playing
game.start();  // Ignored: already playing
game.resume(); // Ignored: not paused
```

### Collision Detection

Movement/rotation methods perform collision detection and silently ignore invalid moves:

```typescript
// Piece at left edge
game.moveLeft(); // Ignored: would go out of bounds

// Piece at bottom
game.moveDown(); // Starts lock delay instead of moving
```

### localStorage Errors

If localStorage is unavailable or full, game continues without persistence:

```typescript
// localStorage disabled
game.start();
// Game works normally, but high score won't persist
```

---

## Performance Guarantees

- All methods execute in <1ms (synchronous)
- Input latency <50ms (from keypress to visual update)
- Event callbacks invoked synchronously (no async delays)
- State queries return immediately (no I/O)

---

## Thread Safety

**Not thread-safe**: All methods must be called from the main thread. Game uses requestAnimationFrame for rendering, which runs on main thread.

---

## Versioning

**Current Version**: 1.0.0

**Compatibility**: This API is stable for v1.x releases. Breaking changes will increment major version.

**Deprecation Policy**: Deprecated methods will be marked and supported for one major version before removal.
