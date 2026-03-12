# Feature Specification: Core Tetris Game

**Feature Branch**: `001-core-tetris-game`
**Created**: 2026-03-12
**Status**: Draft
**Input**: User description: "Complete Tetris game with metallic theme, block mechanics, scoring, and audio"

## Clarifications

### Session 2026-03-12

- Q: Should the game include a ghost piece preview feature (semi-transparent preview showing where current block will land)? → A: No, keep it minimal (only next block preview)
- Q: Should the game include hold piece functionality (press H to swap current/held block)? → A: No, classic gameplay only (no hold feature)
- Q: 新方块应该在网格的哪个具体位置生成？ → A: 顶部中央（第0行，第3-6列，标准位置）
- Q: 消行动画应该持续多长时间？ → A: 200-300毫秒（平衡，推荐）
- Q: 方块接触底部后是否应该有锁定延迟？ → A: 500毫秒锁定延迟（标准，推荐）

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Gameplay (Priority: P1)

A player opens the game, starts playing, controls falling blocks with keyboard, clears lines, and sees their score increase until game over.

**Why this priority**: This is the core gameplay loop - without this, there is no game. All other features depend on this foundation.

**Independent Test**: Can be fully tested by starting a game, moving/rotating blocks, clearing at least one line, and reaching game over. Delivers a complete playable Tetris experience.

**Acceptance Scenarios**:

1. **Given** the game is on the main menu, **When** player presses start, **Then** a new game begins with an empty 10×20 grid and the first block appears at the top
2. **Given** a block is falling, **When** player presses left/right arrow keys, **Then** the block moves horizontally one cell in that direction (if space is available)
3. **Given** a block is falling, **When** player presses up arrow or rotation key, **Then** the block rotates 90 degrees clockwise (if space allows)
4. **Given** a block is falling, **When** player presses down arrow, **Then** the block falls faster (10x normal speed)
5. **Given** a block is falling, **When** player presses spacebar, **Then** the block instantly drops to the lowest possible position and locks immediately
6. **Given** a block reaches the bottom or lands on another block, **When** it locks in place, **Then** a new block appears at the top
7. **Given** one or more rows are completely filled, **When** a block locks, **Then** those rows disappear, blocks above fall down, and score increases
8. **Given** a new block appears, **When** there is no space for it at the top, **Then** the game ends and displays final score

---

### User Story 2 - Scoring and Progression (Priority: P2)

A player sees their score increase based on lines cleared, watches the level increase as they score points, and experiences faster block falling speed as difficulty increases.

**Why this priority**: Scoring and progression provide motivation and challenge. Without this, the game lacks depth and replay value.

**Independent Test**: Can be tested by playing until clearing multiple lines, verifying score calculations match the formula (base score × (level + 1)), and confirming level increases every 500 points with corresponding speed changes.

**Acceptance Scenarios**:

1. **Given** player clears 1 line, **When** the line disappears, **Then** score increases by 50 × (current level + 1)
2. **Given** player clears 2 lines simultaneously, **When** the lines disappear, **Then** score increases by 300 × (current level + 1)
3. **Given** player clears 3 lines simultaneously, **When** the lines disappear, **Then** score increases by 500 × (current level + 1)
4. **Given** player clears 4 lines simultaneously (Tetris), **When** the lines disappear, **Then** score increases by 1000 × (current level + 1)
5. **Given** player's score reaches a multiple of 500, **When** score updates, **Then** level increases by 1 (up to maximum level 15)
6. **Given** level increases, **When** next block starts falling, **Then** falling speed increases according to level-speed mapping (1000ms at level 0, decreasing to 100ms at level 9+)
7. **Given** game is in progress, **When** player views the screen, **Then** current score, level, and lines cleared are clearly displayed

---

### User Story 3 - Visual Feedback and Metallic Theme (Priority: P3)

A player experiences a visually appealing game with metallic-themed blocks, smooth animations, clear visual feedback for all actions, and a polished interface.

**Why this priority**: Visual polish and theme create the unique identity and immersive experience. The game is functional without this, but this makes it memorable and satisfying.

**Independent Test**: Can be tested by visual inspection of block appearance (metallic gradients, highlights), observing animations during line clears and block placement, and verifying the metallic UI theme is consistent throughout.

**Acceptance Scenarios**:

1. **Given** blocks are displayed on screen, **When** player views them, **Then** each block type shows distinct metallic colors with gradient effects and highlights (I=silver, O=gold, T=purple, S=green, Z=red, J=blue, L=orange)
2. **Given** a block moves or rotates, **When** the action occurs, **Then** the visual update appears within 50ms with smooth rendering
3. **Given** one or more lines are cleared, **When** the clear occurs, **Then** a satisfying animation plays showing the metallic blocks breaking/disappearing
4. **Given** a block locks into place, **When** it stops moving, **Then** a subtle metallic flash or impact effect appears
5. **Given** player levels up, **When** level increases, **Then** a visual celebration effect appears briefly
6. **Given** game is running, **When** player views the interface, **Then** all UI elements (borders, backgrounds, text) display consistent metallic styling with brushed metal textures
7. **Given** game is running at any time, **When** monitoring frame rate, **Then** the game maintains stable 60fps without stuttering

---

### User Story 4 - Audio Feedback (Priority: P4)

A player hears metallic sound effects for all game actions (movement, rotation, dropping, line clearing, game over), can adjust volume, and can mute sounds.

**Why this priority**: Audio enhances immersion and provides satisfying feedback, but the game is fully playable without it. This is a polish feature.

**Independent Test**: Can be tested by performing each game action and verifying the corresponding metallic sound plays within 100ms, adjusting volume to confirm it works, and muting to confirm silence.

**Acceptance Scenarios**:

1. **Given** player moves block left or right, **When** movement occurs, **Then** a light metallic collision sound plays (50ms duration)
2. **Given** player rotates a block, **When** rotation occurs, **Then** a metallic rotation sound plays (80ms duration)
3. **Given** player holds down arrow for soft drop, **When** block falls faster, **Then** a metallic sliding sound plays (100ms duration)
4. **Given** player presses spacebar for hard drop, **When** block instantly drops, **Then** a heavy metallic impact sound plays (150ms duration)
5. **Given** one or more lines are cleared, **When** clear animation plays, **Then** a metallic breaking/chime sound plays (300ms duration)
6. **Given** game ends, **When** game over screen appears, **Then** a low metallic tone plays (500ms duration)
7. **Given** player adjusts volume setting, **When** volume changes, **Then** all subsequent sounds play at the new volume level (0-100%)
8. **Given** player mutes audio, **When** mute is enabled, **Then** no sounds play for any actions

---

### User Story 5 - Game State Management (Priority: P5)

A player can pause and resume the game, restart after game over, view their high score, and have their high score persist across sessions.

**Why this priority**: Quality-of-life features that improve usability. The core game works without these, but they're expected in a polished game.

**Independent Test**: Can be tested by pausing mid-game (game freezes), resuming (game continues), restarting after game over (new game starts), and verifying high score persists after closing and reopening the browser.

**Acceptance Scenarios**:

1. **Given** game is in progress, **When** player presses P key, **Then** game pauses (blocks stop moving, timer stops, "PAUSED" message displays)
2. **Given** game is paused, **When** player presses P key again, **Then** game resumes from exact same state
3. **Given** game is over, **When** player presses R key, **Then** a new game starts with score/level reset to 0
4. **Given** game ends with a score higher than previous high score, **When** game over screen appears, **Then** high score updates and displays the new record
5. **Given** player has played before, **When** player opens the game, **Then** their previous high score is displayed on the main menu
6. **Given** player closes browser and reopens, **When** game loads, **Then** high score persists from previous session (stored in localStorage)
7. **Given** game is in any state, **When** player views the screen, **Then** next block preview is visible showing the upcoming block

---

### Edge Cases

- What happens when player rapidly presses rotation key near a wall? System should attempt rotation with wall kick rules (simplified SRS), and if no valid position exists, rotation is ignored without error.
- What happens when player tries to move block outside grid boundaries? Movement is blocked, block stays in current position, no error occurs.
- What happens when localStorage is full or disabled? Game continues to work normally, but high score and settings are not persisted (graceful degradation).
- What happens when player presses multiple keys simultaneously? Each key press is handled independently in the order received, with collision detection applied for each action.
- What happens when game is paused and player presses movement keys? All game input is ignored except P (resume) and R (restart).
- What happens when player reaches maximum level (15)? Level stays at 15, speed remains at 100ms/cell, score continues to increase normally.
- What happens when score exceeds JavaScript's safe integer limit? Unlikely in normal gameplay (would require ~9 quadrillion points), but if reached, score display may show scientific notation or wrap.

## Requirements *(mandatory)*

### Functional Requirements

**Block System**:
- **FR-001**: System MUST support 7 standard Tetris block types (I, O, T, S, Z, J, L), each composed of 4 cells
- **FR-002**: System MUST generate blocks with equal random probability for each type
- **FR-003**: System MUST support 90-degree clockwise rotation for all blocks
- **FR-004**: System MUST implement simplified SRS (Super Rotation System) wall kick rules for rotation collision handling
- **FR-005**: System MUST display next block preview showing the upcoming block
- **FR-005a**: System MUST NOT include ghost piece preview (semi-transparent drop position indicator) to maintain minimal design
- **FR-005b**: System MUST NOT include hold piece functionality (ability to swap/store current block) to maintain classic gameplay simplicity

**Game Grid**:
- **FR-006**: System MUST provide a 10-column by 20-row game grid
- **FR-007**: System MUST detect collisions between falling blocks and grid boundaries (left, right, bottom)
- **FR-008**: System MUST detect collisions between falling blocks and locked blocks
- **FR-009**: System MUST prevent blocks from moving through walls or other blocks

**Game Flow**:
- **FR-010**: System MUST automatically move blocks downward at speed determined by current level
- **FR-011**: System MUST lock blocks in place when they can no longer move down
- **FR-011a**: System MUST provide 500ms lock delay when block touches bottom or another block, allowing final adjustments (movement/rotation) before locking
- **FR-012**: System MUST detect complete horizontal rows after each block locks
- **FR-013**: System MUST remove complete rows, shift blocks above downward, and award points
- **FR-014**: System MUST end game when a new block cannot be placed at the top of the grid
- **FR-015**: System MUST generate a new block immediately after the previous block locks (unless game over)
- **FR-015a**: System MUST spawn new blocks at the top center of the grid (row 0, columns 3-6 for standard 4-cell blocks)

**Player Controls**:
- **FR-016**: System MUST move block left when left arrow key is pressed (if space available)
- **FR-017**: System MUST move block right when right arrow key is pressed (if space available)
- **FR-018**: System MUST increase falling speed by 10x when down arrow key is held
- **FR-019**: System MUST instantly drop block to lowest position and lock when spacebar is pressed
- **FR-020**: System MUST rotate block 90 degrees clockwise when up arrow or designated rotation key is pressed
- **FR-021**: System MUST respond to player input within 50ms (input latency requirement)

**Scoring System**:
- **FR-022**: System MUST award 50 × (level + 1) points for clearing 1 line
- **FR-023**: System MUST award 300 × (level + 1) points for clearing 2 lines simultaneously
- **FR-024**: System MUST award 500 × (level + 1) points for clearing 3 lines simultaneously
- **FR-025**: System MUST award 1000 × (level + 1) points for clearing 4 lines simultaneously (Tetris)
- **FR-026**: System MUST increase level by 1 for every 500 points earned (up to maximum level 15)
- **FR-027**: System MUST display current score, level, and lines cleared during gameplay

**Difficulty Progression**:
- **FR-028**: System MUST adjust block falling speed based on current level according to specified mapping (1000ms at level 0, decreasing to 100ms at level 9+)
- **FR-029**: System MUST start new games at level 0 with 1000ms falling speed

**Game State Management**:
- **FR-030**: System MUST support pause functionality (P key) that freezes all game activity
- **FR-031**: System MUST support resume functionality (P key when paused) that continues from paused state
- **FR-032**: System MUST support restart functionality (R key) that starts a new game
- **FR-033**: System MUST track and display high score across all game sessions
- **FR-034**: System MUST persist high score in localStorage for retrieval in future sessions
- **FR-035**: System MUST display game states: main menu, playing, paused, game over

**Visual Requirements**:
- **FR-036**: System MUST render blocks with metallic appearance using gradients and highlights
- **FR-037**: System MUST use distinct metallic colors for each block type (I=silver, O=gold, T=purple, S=green, Z=red, J=blue, L=orange)
- **FR-038**: System MUST display metallic-themed UI with brushed metal textures and effects
- **FR-039**: System MUST show line clear animation when rows are removed (duration: 200-300ms)
- **FR-040**: System MUST show visual feedback for block locking (subtle flash/impact effect)
- **FR-041**: System MUST maintain 60fps frame rate during gameplay
- **FR-042**: System MUST render visual updates within 50ms of player input

**Audio Requirements**:
- **FR-043**: System MUST play metallic sound effect for block movement (50ms duration)
- **FR-044**: System MUST play metallic sound effect for block rotation (80ms duration)
- **FR-045**: System MUST play metallic sound effect for soft drop (100ms duration)
- **FR-046**: System MUST play metallic sound effect for hard drop (150ms duration)
- **FR-047**: System MUST play metallic sound effect for line clear (300ms duration)
- **FR-048**: System MUST play metallic sound effect for game over (500ms duration)
- **FR-049**: System MUST support volume control (0-100%)
- **FR-050**: System MUST support mute functionality
- **FR-051**: System MUST play audio within 100ms of triggering event

**Data Persistence**:
- **FR-052**: System MUST store high score in localStorage
- **FR-053**: System MUST store game settings (volume, grid display preference) in localStorage
- **FR-054**: System MUST store gameplay statistics (total games, total lines cleared, last play time) in localStorage
- **FR-055**: System MUST handle localStorage errors gracefully (continue playing without persistence)

**Performance Requirements**:
- **FR-056**: System MUST load and be playable within 2 seconds of page load
- **FR-057**: System MUST maintain memory usage below 50MB during extended gameplay
- **FR-058**: System MUST maintain stable 60fps frame rate without drops
- **FR-059**: System MUST respond to input within 50ms (p95 latency)

### Key Entities

- **Block (Tetromino)**: A game piece composed of 4 cells in a specific shape (I, O, T, S, Z, J, L). Has properties: type, color, rotation state, position (x, y coordinates), shape matrix (4×4 grid defining occupied cells).

- **Game Grid**: A 10×20 matrix representing the play area. Each cell can be empty or occupied by a locked block. Tracks which cells contain blocks and their colors.

- **Game State**: The current state of the game. Includes: status (menu/playing/paused/gameover), current score, current level, lines cleared, current falling block, next block, grid state, start time.

- **Persistent Data**: Data stored across sessions. Includes: high score, total games played, total lines cleared, last play time, user settings (volume, grid display).

- **Audio Asset**: A sound effect file. Has properties: type (move/rotate/drop/hard_drop/clear/game_over), duration, file format (MP3/WebM).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can start a new game and begin playing within 2 seconds of opening the application
- **SC-002**: Players experience smooth gameplay with stable 60fps frame rate throughout entire game session
- **SC-003**: Player input (keyboard) results in visible block movement within 50 milliseconds
- **SC-004**: Players can successfully complete a full game cycle (start, play, clear lines, reach game over) without errors or crashes
- **SC-005**: Players can clear 4 lines simultaneously and receive correct score (1000 × (level + 1) points)
- **SC-006**: Players experience increasing difficulty as level increases, with block falling speed decreasing from 1000ms to 100ms
- **SC-007**: Players' high scores persist across browser sessions (close and reopen browser, high score remains)
- **SC-008**: Players hear appropriate metallic sound effects for all game actions with less than 100ms audio latency
- **SC-009**: Players can play for extended sessions (30+ minutes) without memory leaks or performance degradation
- **SC-010**: Application memory usage remains below 50MB during typical gameplay
- **SC-011**: Players can pause and resume gameplay without losing game state or experiencing glitches
- **SC-012**: Players can distinguish all 7 block types by their distinct metallic colors and shapes at a glance
- **SC-013**: 95% of player inputs result in expected block behavior (movement, rotation, drop) without collision errors
- **SC-014**: Application loads all assets and becomes interactive in under 2 seconds on modern browsers
- **SC-015**: Players can complete 10 consecutive games without encountering any bugs or unexpected behavior

### Assumptions

- Players have a modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Players have a physical keyboard for input (keyboard-only controls)
- Players have working audio output (speakers/headphones) for sound effects
- Players' browsers have localStorage enabled and available
- Players have stable browser environment (no extensions interfering with Canvas or Web Audio API)
- Standard Tetris rules and mechanics are familiar to target audience (no tutorial needed for basic gameplay)
- Metallic theme is achieved through visual styling only (no 3D rendering or complex shaders)
- Audio files are sourced from copyright-free resources (Freesound.org, OpenGameArt.org, Kenney.nl)
- Game is single-player only (no multiplayer or online features)
- Game runs entirely in browser (no backend server required)
- Performance targets are based on modern hardware (2020+ computers/laptops)
