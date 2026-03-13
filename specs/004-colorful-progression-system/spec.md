# Feature Specification: Colorful Visual Style with Progressive Difficulty System

**Feature Branch**: `004-colorful-progression-system`
**Created**: 2026-03-13
**Status**: Draft
**Input**: User description: "基于当前版本迭代第四版：1、游戏区域背景改成半透明 + 高斯模糊效果。2、游戏区域的整体风格需要修改，禁用黑白灰风格，改成更多视觉色彩的风格。3、按下键下落速度加快至4倍速。4、消除一行得10分，同时消除两行得25分，同时消除3行的40分，同时消除4行得55分。5、默认等级0级，升一级需要的分数为 目标  Level * 100 * 2。6、每升一级，下落速度增加1倍速，最高为初始下落速度的4倍速，达到最快下落速度时后续每升一级，从底部随机升起一行带有缺口的方块。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enhanced Visual Experience (Priority: P1)

Players experience a modern, colorful game interface with glassmorphism effects that makes the game visually appealing and easier to distinguish game elements.

**Why this priority**: Visual improvements directly impact first impressions and player engagement. A modern, colorful interface attracts and retains players better than monochrome designs.

**Independent Test**: Can be fully tested by launching the game and observing the game area background (semi-transparent with blur effect) and colorful block styles. Delivers immediate visual value without requiring gameplay.

**Acceptance Scenarios**:

1. **Given** the game is launched, **When** the player views the game area, **Then** the background displays a semi-transparent effect with Gaussian blur
2. **Given** blocks are falling or placed, **When** the player observes the blocks, **Then** blocks display vibrant colors instead of black/white/gray tones
3. **Given** the game is in progress, **When** the player views the entire interface, **Then** all UI elements follow the colorful visual theme

---

### User Story 2 - Responsive Speed Control (Priority: P2)

Players can accelerate block descent by holding the down key, allowing skilled players to speed up gameplay and complete rows faster.

**Why this priority**: Speed control is a core Tetris mechanic that affects gameplay feel. It's essential for player control but secondary to visual appeal for initial engagement.

**Independent Test**: Can be fully tested by starting a game, pressing and holding the down key, and verifying blocks fall 4x faster. Delivers immediate gameplay value.

**Acceptance Scenarios**:

1. **Given** a block is falling at normal speed, **When** the player presses and holds the down key, **Then** the block falls at 4x the current speed
2. **Given** the down key is held, **When** the player releases the key, **Then** the block returns to normal falling speed
3. **Given** the block is accelerated, **When** it reaches the bottom or lands on another block, **Then** it locks in place immediately

---

### User Story 3 - Rewarding Scoring System (Priority: P2)

Players receive progressively higher scores for clearing multiple lines simultaneously, encouraging strategic play and combo moves.

**Why this priority**: Scoring system affects player motivation and strategy. It's important for engagement but doesn't block basic gameplay.

**Independent Test**: Can be fully tested by clearing 1, 2, 3, and 4 lines and verifying score increases match the formula. Delivers strategic depth independently.

**Acceptance Scenarios**:

1. **Given** the player clears exactly 1 line, **When** the line is cleared, **Then** the score increases by 10 points
2. **Given** the player clears exactly 2 lines simultaneously, **When** the lines are cleared, **Then** the score increases by 25 points
3. **Given** the player clears exactly 3 lines simultaneously, **When** the lines are cleared, **Then** the score increases by 40 points
4. **Given** the player clears exactly 4 lines simultaneously, **When** the lines are cleared, **Then** the score increases by 55 points

---

### User Story 4 - Progressive Difficulty Levels (Priority: P3)

Players advance through levels as they accumulate points, with each level increasing the challenge through faster falling speeds and eventually adding obstacle rows.

**Why this priority**: Level progression provides long-term engagement and replayability. It's valuable but depends on the scoring system being in place first.

**Independent Test**: Can be fully tested by accumulating points and verifying level-up thresholds, speed increases, and obstacle row generation. Delivers progression system independently.

**Acceptance Scenarios**:

1. **Given** the game starts, **When** the player begins playing, **Then** the level is 0 and the falling speed is at base rate
2. **Given** the player is at level N, **When** the score reaches (N+1) * 100 * 2 points, **Then** the level increases to N+1
3. **Given** the player levels up from 0 to 1, **When** the level increases, **Then** the falling speed increases by 1x (becomes 2x base speed)
4. **Given** the player levels up from 1 to 2, **When** the level increases, **Then** the falling speed increases by 1x (becomes 3x base speed)
5. **Given** the player levels up from 2 to 3, **When** the level increases, **Then** the falling speed increases by 1x (becomes 4x base speed, maximum)
6. **Given** the player is at level 3 or higher (max speed reached), **When** the player levels up, **Then** a random row with one gap appears from the bottom of the game area
7. **Given** an obstacle row is added, **When** the row appears, **Then** it contains exactly one empty cell in a random position

---

### Edge Cases

- What happens when the player levels up while a block is falling? (Speed should update immediately for the current block)
- What happens when an obstacle row is added while blocks are already placed near the bottom? (Existing blocks shift up, game over if they exceed the top boundary)
- What happens when the player clears multiple lines that include an obstacle row? (Obstacle row is cleared like normal rows, scoring applies normally)
- What happens if the down key is held when the block is already at maximum speed (4x)? (Speed remains at 4x, no further acceleration)
- What happens when the game area is nearly full and an obstacle row is added? (If adding the row causes blocks to exceed the top boundary, game over is triggered)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Game area background MUST display a semi-transparent effect with Gaussian blur over a static gradient or pattern background
- **FR-002**: All game blocks MUST use colorful visual styles, excluding black, white, and gray tones
- **FR-003**: System MUST accelerate block falling speed to 4x the current level-based speed when the down key is pressed and held (multiplicative calculation: at level 2 with 3x base speed, holding down results in 3x × 4 = 12x base speed)
- **FR-004**: System MUST return block falling speed to normal when the down key is released
- **FR-005**: System MUST award 10 points when exactly 1 line is cleared
- **FR-006**: System MUST award 25 points when exactly 2 lines are cleared simultaneously
- **FR-007**: System MUST award 40 points when exactly 3 lines are cleared simultaneously
- **FR-008**: System MUST award 55 points when exactly 4 lines are cleared simultaneously
- **FR-009**: Game MUST start at level 0 with base falling speed
- **FR-010**: System MUST calculate level-up threshold as: (target_level) * 100 * 2 points
- **FR-011**: System MUST increase falling speed by 1x (additive) each time the player levels up, up to a maximum of 4x base speed
- **FR-012**: System MUST generate a random row with exactly one gap from the bottom when the player levels up after reaching maximum speed (4x)
- **FR-013**: Obstacle rows MUST have the gap positioned randomly in any of the available columns, with blocks using random colors from the standard 7-block palette (I, O, T, S, Z, J, L)
- **FR-014**: System MUST shift existing blocks upward when an obstacle row is added from the bottom
- **FR-015**: System MUST trigger game over if adding an obstacle row causes blocks to exceed the top boundary

### Key Entities

- **Level**: Represents the player's current difficulty tier, starting at 0 and increasing based on accumulated score
- **Score**: Cumulative points earned by clearing lines, determines level progression (session-only, resets on page refresh)
- **Falling Speed**: Current rate at which blocks descend, ranges from 1x (base) to 4x (maximum)
- **Obstacle Row**: A partially filled row added from the bottom at higher levels, contains blocks with one random gap

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can immediately distinguish between different block types through vibrant color differentiation
- **SC-002**: Players can accelerate block descent to 4x speed by holding the down key, reducing placement time by 75%
- **SC-003**: Players receive immediate visual feedback when clearing multiple lines, with score increases matching the defined formula (1 line: 10pts, 2 lines: 25pts, 3 lines: 40pts, 4 lines: 55pts)
- **SC-004**: Players experience progressive difficulty with falling speed increasing by 1x per level, reaching maximum 4x speed by level 3
- **SC-005**: Players encounter obstacle rows starting from level 4 onwards, with each row containing exactly one random gap
- **SC-006**: Game maintains smooth visual performance with glassmorphism effects and colorful blocks at all speed levels
- **SC-007**: Players can clearly see the semi-transparent blurred background throughout gameplay without visual obstruction

## Clarifications

### Session 2026-03-13

- Q: How does down key acceleration interact with level-based speed? → A: Multiplicative - Down key accelerates to 4x the current level speed (e.g., at level 2 with 3x base speed, holding down results in 12x base speed)
- Q: Should obstacle row blocks use specific colors or random colors? → A: Random colors from the standard 7-block palette (I, O, T, S, Z, J, L colors)
- Q: Should there be visual or audio feedback when player levels up? → A: No explicit feedback - player infers from speed change and level display update
- Q: Should score and level persist between sessions? → A: Reset on page refresh (session-only, no persistence)
- Q: What should be visible behind the glassmorphism game area? → A: Static gradient or pattern background

## Assumptions

- Base falling speed is defined in the existing codebase and will be used as the 1x reference
- The game area dimensions (rows and columns) remain unchanged from the current version
- Colorful block styles will use distinct, high-contrast colors for accessibility
- Gaussian blur radius and transparency level will be tuned for optimal visual appeal without compromising gameplay visibility (research.md recommends 8-12px blur, light purple to light blue gradient)
- Level progression is cumulative (score never decreases, levels never decrease)
- Game over conditions from previous versions remain unchanged except for the new obstacle row boundary check
- Implementation files (e.g., glass-colors.ts) will be created as needed during development to support colorful rendering
