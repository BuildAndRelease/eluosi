# Renderer3D API Contract

**Feature**: 002-3d-visual-enhancements
**Module**: `src/render/Renderer3D.ts`
**Purpose**: Isometric 3D block rendering using Canvas 2D API

---

## Public API

### Class: `Renderer3D`

Handles isometric 3D rendering of Tetris blocks with three visible faces (top, left, right).

#### Constructor

```typescript
constructor(ctx: CanvasRenderingContext2D, cellSize: number)
```

**Parameters**:
- `ctx`: Canvas 2D rendering context
- `cellSize`: Size of each grid cell in pixels (e.g., 30)

**Throws**:
- `Error` if `ctx` is null or `cellSize` <= 0

**Example**:
```typescript
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const renderer3D = new Renderer3D(ctx, 30);
```

---

#### Method: `renderBlock`

Renders a single 3D block at the specified grid position.

```typescript
renderBlock(
  gridX: number,
  gridY: number,
  color: string,
  options?: RenderBlockOptions
): void
```

**Parameters**:
- `gridX`: Grid X coordinate (0-based)
- `gridY`: Grid Y coordinate (0-based)
- `color`: Base color (hex string, e.g., "#ff0000")
- `options`: Optional rendering options

**Options**:
```typescript
interface RenderBlockOptions {
  highlighted?: boolean;      // Highlight for row clear (default: false)
  flashIntensity?: number;    // Flash intensity 0-1 (default: 0)
  alpha?: number;             // Overall opacity 0-1 (default: 1)
  depth?: number;             // Custom depth override (default: gridX + gridY)
}
```

**Behavior**:
1. Transforms grid coordinates to isometric screen coordinates
2. Calculates face colors (top: 100%, left: 70%, right: 50% brightness)
3. Renders three faces in order: right → left → top (painter's algorithm)
4. Applies highlights, shadows, and optional effects

**Throws**:
- `Error` if `color` is not a valid hex color
- `Error` if `gridX` or `gridY` is negative

**Example**:
```typescript
// Render normal block
renderer3D.renderBlock(5, 10, '#00f0f0');

// Render highlighted block with flash
renderer3D.renderBlock(5, 10, '#00f0f0', {
  highlighted: true,
  flashIntensity: 0.8
});
```

---

#### Method: `renderGrid`

Renders all blocks in a grid with proper depth sorting.

```typescript
renderGrid(grid: Grid): void
```

**Parameters**:
- `grid`: Game grid containing block colors (from `GameState`)

**Grid Interface** (from V1):
```typescript
interface Grid {
  cells: (string | null)[][];  // null = empty, string = color
  width: number;
  height: number;
}
```

**Behavior**:
1. Collects all non-empty cells
2. Sorts by depth (gridX + gridY) for correct rendering order
3. Renders each block using `renderBlock()`

**Performance**:
- O(n log n) where n = number of filled cells (max 200)
- Target: <3ms for full grid

**Example**:
```typescript
const gameState = game.getGameState();
renderer3D.renderGrid(gameState.grid);
```

---

#### Method: `renderPiece`

Renders a falling piece with 3D effect.

```typescript
renderPiece(piece: Piece, options?: RenderBlockOptions): void
```

**Parameters**:
- `piece`: Tetromino piece (from `GameState`)
- `options`: Optional rendering options (applied to all blocks in piece)

**Piece Interface** (from V1):
```typescript
interface Piece {
  type: PieceType;
  rotation: number;
  position: Position;
  shape: number[][];  // 4×4 matrix
  color: string;
}
```

**Behavior**:
1. Iterates through piece shape matrix
2. For each filled cell (value = 1), renders block at piece.position + cell offset
3. Applies same 3D effect as grid blocks

**Example**:
```typescript
const gameState = game.getGameState();
if (gameState.currentPiece) {
  renderer3D.renderPiece(gameState.currentPiece);
}
```

---

#### Method: `toIsometric`

Transforms grid coordinates to isometric screen coordinates.

```typescript
toIsometric(gridX: number, gridY: number): { isoX: number; isoY: number }
```

**Parameters**:
- `gridX`: Grid X coordinate
- `gridY`: Grid Y coordinate

**Returns**:
- Object with `isoX` and `isoY` screen coordinates

**Formula**:
```typescript
isoX = (gridX - gridY) * (cellSize / 2)
isoY = (gridX + gridY) * (cellSize / 4)
```

**Example**:
```typescript
const { isoX, isoY } = renderer3D.toIsometric(5, 10);
console.log(`Screen position: (${isoX}, ${isoY})`);
```

---

#### Method: `calculateFaceColors`

Calculates the three face colors for a given base color.

```typescript
calculateFaceColors(baseColor: string): {
  top: string;
  left: string;
  right: string;
}
```

**Parameters**:
- `baseColor`: Base color (hex string)

**Returns**:
- Object with `top`, `left`, `right` face colors

**Brightness Levels**:
- Top: 100% (lightest)
- Left: 70% (medium)
- Right: 50% (darkest)

**Example**:
```typescript
const colors = renderer3D.calculateFaceColors('#ff0000');
// colors.top = '#ff0000'
// colors.left = '#b30000'
// colors.right = '#800000'
```

---

## Internal Methods (Not Public API)

### `drawTopFace(isoX, isoY, color, options)`
Draws the top face of a block (diamond shape).

### `drawLeftFace(isoX, isoY, color, options)`
Draws the left face of a block (parallelogram).

### `drawRightFace(isoX, isoY, color, options)`
Draws the right face of a block (parallelogram).

### `applyHighlight(isoX, isoY, intensity)`
Adds highlight effect for metallic appearance.

### `applyShadow(isoX, isoY, depth)`
Adds shadow effect for depth perception.

---

## Constants

```typescript
// Face brightness multipliers
const FACE_BRIGHTNESS = {
  TOP: 1.0,    // 100%
  LEFT: 0.7,   // 70%
  RIGHT: 0.5   // 50%
};

// Highlight settings
const HIGHLIGHT_OFFSET = 4;  // pixels from top-left
const HIGHLIGHT_SIZE = 8;    // pixels diameter
const HIGHLIGHT_OPACITY = 0.6;

// Shadow settings
const SHADOW_OFFSET_X = 2;
const SHADOW_OFFSET_Y = 2;
const SHADOW_BLUR = 4;
const SHADOW_OPACITY = 0.3;
```

---

## Usage Example

```typescript
import { Renderer3D } from './render/Renderer3D';
import type { GameState } from './game/types';

// Initialize
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const renderer3D = new Renderer3D(ctx, 30);

// Render game state
function render(gameState: GameState): void {
  // Clear canvas
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render grid with 3D blocks
  renderer3D.renderGrid(gameState.grid);

  // Render current piece
  if (gameState.currentPiece) {
    renderer3D.renderPiece(gameState.currentPiece);
  }
}

// Animation loop
function gameLoop(): void {
  const gameState = game.getGameState();
  render(gameState);
  requestAnimationFrame(gameLoop);
}

gameLoop();
```

---

## Performance Guarantees

- **renderBlock**: <0.03ms per block
- **renderGrid**: <3ms for full 200-block grid
- **renderPiece**: <0.15ms for 4-block piece
- **toIsometric**: <0.001ms (pure math)
- **calculateFaceColors**: <0.01ms (cached after first call)

**Total Frame Budget**: ~3.5ms for typical game state (180 grid blocks + 1 piece)

---

## Error Handling

### Invalid Input
```typescript
// Throws Error
renderer3D.renderBlock(-1, 5, '#ff0000');  // Negative coordinates
renderer3D.renderBlock(5, 10, 'red');      // Invalid color format
```

### Graceful Degradation
```typescript
// Falls back to 2D rendering if 3D fails
try {
  renderer3D.renderBlock(x, y, color);
} catch (error) {
  console.error('3D rendering failed, falling back to 2D', error);
  renderer2D.renderBlock(x, y, color);
}
```

---

## Testing Contract

### Unit Tests Required

1. **Coordinate Transformation**
   - `toIsometric(0, 0)` returns `{ isoX: 0, isoY: 0 }`
   - `toIsometric(10, 0)` returns correct isometric coordinates
   - `toIsometric(0, 10)` returns correct isometric coordinates

2. **Color Calculation**
   - `calculateFaceColors('#ff0000')` returns correct brightness levels
   - `calculateFaceColors('#00ff00')` maintains color hue
   - Invalid color throws error

3. **Rendering**
   - `renderBlock` draws three faces
   - `renderGrid` sorts blocks by depth
   - `renderPiece` handles 4×4 shape matrix correctly

### Integration Tests Required

1. Full grid rendering completes within 3ms
2. 3D blocks visually distinct from 2D blocks
3. Depth sorting prevents visual artifacts

### Visual Regression Tests (Optional)

1. Screenshot comparison for 3D block appearance
2. Verify face colors match design specifications

---

**Contract Version**: 1.0.0
**Last Updated**: 2026-03-12
**Status**: ✅ Finalized
