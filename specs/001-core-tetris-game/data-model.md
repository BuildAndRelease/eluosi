# Data Model: Core Tetris Game

**Feature**: Core Tetris Game
**Created**: 2026-03-12
**Purpose**: Define all game entities, their properties, relationships, and state transitions

---

## Entity Definitions

### 1. Piece (Tetromino)

**Description**: A falling game piece composed of 4 cells in a specific shape

**Properties**:
- `type`: PieceType (I | O | T | S | Z | J | L)
- `rotation`: number (0-3, representing 0°, 90°, 180°, 270°)
- `position`: Position { x: number, y: number } (grid coordinates)
- `shape`: number[][] (4×4 matrix, 1 = filled cell, 0 = empty)
- `color`: string (hex color code for metallic rendering)

**Validation Rules**:
- `type` must be one of 7 valid types
- `rotation` must be 0-3
- `position.x` must be -2 to 11 (allows partial off-grid for rotation)
- `position.y` must be -2 to 21 (allows spawn above visible area)
- `shape` must be 4×4 matrix with exactly 4 filled cells

**State Transitions**:
- **Spawn**: Created at position (3, 0) with rotation 0
- **Move**: Position changes by (±1, 0) or (0, +1)
- **Rotate**: Rotation increments (mod 4), shape matrix rotates 90° clockwise
- **Lock**: Becomes part of Grid when can't move down

**Relationships**:
- One Piece is "current" in GameState
- One Piece is "next" in GameState
- Locked Pieces become cells in Grid

---

### 2. Grid

**Description**: The 10×20 play area containing locked blocks

**Properties**:
- `cells`: (string | null)[][] (20 rows × 10 columns)
  - `null` = empty cell
  - `string` = hex color of locked block
- `width`: number (constant: 10)
- `height`: number (constant: 20)

**Validation Rules**:
- Grid must always be 10 columns × 20 rows
- Each cell must be null or valid hex color string
- No cells can exist outside grid boundaries

**Operations**:
- `isEmpty(x, y)`: Check if cell is empty
- `set(x, y, color)`: Set cell color (lock block)
- `clear(y)`: Clear entire row
- `shift(fromRow, toRow)`: Shift rows down after line clear
- `getCompleteRows()`: Find all rows with no empty cells

**State Transitions**:
- **Initialize**: All cells set to null
- **Lock Block**: Piece cells copied to grid at piece position
- **Clear Lines**: Complete rows removed, rows above shifted down
- **Game Over**: Top row(s) contain locked blocks when new piece spawns

---

### 3. GameState

**Description**: Complete state of the game at any moment

**Properties**:
- `status`: GameStatus (menu | playing | paused | gameover)
- `score`: number (current score, starts at 0)
- `level`: number (current level, starts at 0, max 15)
- `lines`: number (total lines cleared this game)
- `grid`: Grid (the play area)
- `currentPiece`: Piece | null (falling piece)
- `nextPiece`: Piece (preview piece)
- `startTime`: number (timestamp when game started)
- `lockDelayTimer`: number | null (milliseconds remaining before lock)

**Validation Rules**:
- `score` must be ≥ 0
- `level` must be 0-15
- `lines` must be ≥ 0
- `status` must be valid GameStatus
- `currentPiece` null only when status is menu or gameover
- `nextPiece` always present when status is playing or paused
- `lockDelayTimer` only set when piece is touching bottom/blocks

**Derived Values**:
- `fallSpeed`: Calculated from level (1000ms at level 0, 100ms at level 9+)
- `nextLevelScore`: (level + 1) × 500 (score needed for next level)

**State Transitions**:

```
menu → playing (start game)
  - Initialize grid (all null)
  - Set score/level/lines to 0
  - Generate currentPiece and nextPiece
  - Set startTime

playing → paused (press P)
  - Freeze all timers
  - Stop piece falling

paused → playing (press P again)
  - Resume timers
  - Continue piece falling

playing → gameover (top blocked)
  - Stop all timers
  - Save high score if beaten
  - Update statistics

gameover → menu (press R)
  - Reset to initial state
```

**Relationships**:
- Contains one Grid
- Contains zero or one current Piece
- Contains one next Piece
- Persists to PersistentData on game over

---

### 4. PersistentData

**Description**: Data stored in localStorage across sessions

**Properties**:
- `highScore`: number (best score ever achieved)
- `totalGames`: number (count of games played)
- `totalLines`: number (count of lines cleared across all games)
- `lastPlayTime`: number (timestamp of last game)
- `settings`: Settings object

**Settings Sub-object**:
- `volume`: number (0-100, audio volume percentage)
- `showGrid`: boolean (whether to show grid lines)

**Validation Rules**:
- All numeric values must be ≥ 0
- `volume` must be 0-100
- `lastPlayTime` must be valid timestamp
- `showGrid` must be boolean

**Storage Key**: `"eluosi-game-data"`

**Operations**:
- `load()`: Read from localStorage, return default if not found
- `save(data)`: Write to localStorage with error handling
- `updateHighScore(score)`: Update if score > highScore
- `incrementGames()`: Increment totalGames
- `addLines(count)`: Add to totalLines

**Error Handling**:
- If localStorage unavailable: Return defaults, log warning
- If localStorage full: Log error, continue without saving
- If data corrupted: Return defaults, overwrite with valid data

---

### 5. AudioAsset

**Description**: A sound effect file and its playback state

**Properties**:
- `type`: SoundType (move | rotate | drop | hard_drop | clear | game_over)
- `buffer`: AudioBuffer (decoded audio data)
- `duration`: number (milliseconds)
- `format`: string ("mp3" | "webm")

**Validation Rules**:
- `type` must be valid SoundType
- `buffer` must be loaded before playback
- `duration` must match actual audio length
- File size must be <100KB per asset

**Operations**:
- `load(url)`: Fetch and decode audio file
- `play(volume)`: Play sound at specified volume (0-1)
- `stop()`: Stop current playback

**Relationships**:
- Managed by SoundManager
- Triggered by game events (movement, rotation, line clear, etc.)

---

## Entity Relationships Diagram

```
GameState
├── Grid (1:1)
│   └── cells[][] (locked blocks)
├── currentPiece (1:0..1)
│   └── Piece
└── nextPiece (1:1)
    └── Piece

PersistentData (localStorage)
├── highScore (from GameState.score)
├── totalGames (incremented)
├── totalLines (from GameState.lines)
└── settings
    ├── volume (for AudioAsset playback)
    └── showGrid (for Grid rendering)

SoundManager
└── AudioAsset[] (6 sound effects)
    └── Triggered by GameState transitions
```

---

## State Transition Rules

### Piece Lifecycle

1. **Spawn**: New piece created at (3, 0) with rotation 0
2. **Fall**: Piece moves down every `fallSpeed` milliseconds
3. **Move**: Player input moves piece left/right/down
4. **Rotate**: Player input rotates piece 90° clockwise
5. **Touch**: Piece touches bottom or locked blocks → start lock delay (500ms)
6. **Lock**: After lock delay expires → piece cells copied to grid
7. **Clear**: Check for complete rows → remove and shift down
8. **Score**: Award points based on lines cleared
9. **Level**: Check if score threshold reached → increment level
10. **Next**: currentPiece = nextPiece, generate new nextPiece
11. **Game Over**: If new piece can't spawn → end game

### Score Calculation

```typescript
const baseScores = {
  1: 50,   // Single
  2: 300,  // Double
  3: 500,  // Triple
  4: 1000  // Tetris
};

score += baseScores[linesCleared] * (level + 1);
```

### Level Progression

```typescript
level = Math.min(15, Math.floor(score / 500));
```

### Fall Speed Calculation

```typescript
const speeds = [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100];
fallSpeed = level < 9 ? speeds[level] : 100; // ms per cell
```

---

## Data Validation

### Input Validation

All external data (localStorage, user input) must be validated:

```typescript
function validatePersistentData(data: any): PersistentData {
  return {
    highScore: Math.max(0, Number(data?.highScore) || 0),
    totalGames: Math.max(0, Number(data?.totalGames) || 0),
    totalLines: Math.max(0, Number(data?.totalLines) || 0),
    lastPlayTime: Number(data?.lastPlayTime) || Date.now(),
    settings: {
      volume: Math.min(100, Math.max(0, Number(data?.settings?.volume) ?? 50)),
      showGrid: Boolean(data?.settings?.showGrid ?? true)
    }
  };
}
```

### Collision Detection

```typescript
function isValidPosition(piece: Piece, grid: Grid): boolean {
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (piece.shape[y][x]) {
        const gridX = piece.position.x + x;
        const gridY = piece.position.y + y;

        // Check boundaries
        if (gridX < 0 || gridX >= 10 || gridY >= 20) return false;

        // Check locked blocks (ignore if above visible area)
        if (gridY >= 0 && grid.cells[gridY][gridX] !== null) return false;
      }
    }
  }
  return true;
}
```

---

## Immutability Patterns

All state updates must create new objects:

```typescript
// ❌ BAD: Mutation
gameState.score += 100;

// ✅ GOOD: Immutable update
gameState = {
  ...gameState,
  score: gameState.score + 100
};

// ❌ BAD: Grid mutation
grid.cells[y][x] = color;

// ✅ GOOD: Grid immutable update
grid = {
  ...grid,
  cells: grid.cells.map((row, rowIndex) =>
    rowIndex === y
      ? row.map((cell, colIndex) => colIndex === x ? color : cell)
      : row
  )
};
```

---

## Performance Considerations

### Memory Optimization

- Reuse Piece shape matrices (7 types × 4 rotations = 28 matrices total)
- Grid cells array allocated once, updated in place for rendering only
- AudioBuffers loaded once, reused for all playback

### Rendering Optimization

- Only redraw changed cells (dirty rectangle tracking)
- Cache metallic gradient objects
- Use offscreen canvas for complex effects

### State Updates

- Batch state updates to minimize re-renders
- Use requestAnimationFrame for smooth 60fps
- Debounce rapid input events

---

## Type Definitions (TypeScript)

```typescript
type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
type GameStatus = 'menu' | 'playing' | 'paused' | 'gameover';
type SoundType = 'move' | 'rotate' | 'drop' | 'hard_drop' | 'clear' | 'game_over';

interface Position {
  x: number;
  y: number;
}

interface Piece {
  type: PieceType;
  rotation: number;
  position: Position;
  shape: number[][];
  color: string;
}

interface Grid {
  cells: (string | null)[][];
  width: number;
  height: number;
}

interface Settings {
  volume: number;
  showGrid: boolean;
}

interface PersistentData {
  highScore: number;
  totalGames: number;
  totalLines: number;
  lastPlayTime: number;
  settings: Settings;
}

interface GameState {
  status: GameStatus;
  score: number;
  level: number;
  lines: number;
  grid: Grid;
  currentPiece: Piece | null;
  nextPiece: Piece;
  startTime: number;
  lockDelayTimer: number | null;
}

interface AudioAsset {
  type: SoundType;
  buffer: AudioBuffer;
  duration: number;
  format: string;
}
```
