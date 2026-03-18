# Feature Specification: Progressive Speed and Obstacle Difficulty System

**Feature Branch**: `005-speed-obstacle-progression`
**Created**: 2026-03-13
**Status**: Draft
**Input**: User description: "基于现有工程继续迭代: 1到3级升级后的速度改成均匀增加，最高到基础速度的三倍速，3级后续每升一级底部出现一个障碍行。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Smooth Speed Progression Through Early Levels (Priority: P1)

As a player progresses from level 1 to level 3, block fall speed increases evenly and predictably — reaching exactly 3x the base speed at level 3. Players feel a smooth, fair difficulty curve rather than abrupt speed jumps.

**Why this priority**: Speed progression is the core difficulty mechanic. Getting this right is foundational to balanced gameplay. It replaces the existing speed logic and directly affects every player from the very first level-up.

**Independent Test**: Can be fully tested by starting a new game, leveling up to level 3 through scoring, and verifying the block fall speed at each level. Delivers fair, measurable difficulty increase independently.

**Acceptance Scenarios**:

1. **Given** the player is at level 0 (base speed), **When** they level up to level 1, **Then** the block fall speed increases by exactly 0.67x base speed (1.67x total)
2. **Given** the player is at level 1, **When** they level up to level 2, **Then** the block fall speed increases by another 0.67x base speed (2.33x total)
3. **Given** the player is at level 2, **When** they level up to level 3, **Then** the block fall speed reaches exactly 3x the base speed
4. **Given** the player is at any level between 0 and 3, **When** they observe the speed change between consecutive levels, **Then** the speed increment is identical (uniform increase)

---

### User Story 2 - Obstacle Rows Appear for Levels Beyond 3 (Priority: P1)

When a player surpasses level 3, each subsequent level-up causes a new pre-filled obstacle row to appear at the bottom of the play field. This escalates difficulty through spatial pressure rather than just speed. The speed remains capped at 3x base after level 3.

**Why this priority**: This is the primary difficulty escalation mechanism for advanced play. Without it, experienced players can sustain high-level play indefinitely with no increasing spatial challenge.

**Independent Test**: Can be fully tested by reaching level 4 and beyond and verifying a new obstacle row appears at the bottom of the play field on each level-up. Delivers a new challenge dimension independently.

**Acceptance Scenarios**:

1. **Given** the player is at level 3 and levels up to level 4, **When** the level-up occurs, **Then** one new obstacle row is inserted at the very bottom of the play field and all existing blocks shift up by one row
2. **Given** the player reaches level 5, **When** the level-up occurs, **Then** a second obstacle row is inserted at the very bottom, pushing all existing rows (including prior obstacle rows) up by one row
3. **Given** the player is at level 3 or higher, **When** they level up, **Then** the block fall speed does NOT increase further (remains at 3x base)
4. **Given** an obstacle row exists at the bottom, **When** a player clears a line, **Then** obstacle rows shift down with the board as normal (they behave as standard locked rows)
5. **Given** obstacle rows fill the play field to the top, **When** a new piece spawns with no room, **Then** the game ends (standard game-over condition applies)

---

### User Story 3 - Obstacle Row Visual Distinction (Priority: P2)

Obstacle rows introduced by level progression are visually distinct from player-placed blocks, so players can immediately identify the pre-generated hazard rows versus their own gameplay.

**Why this priority**: Visual clarity is essential for fair gameplay. Players need to distinguish obstacle rows at a glance to plan their strategy. Without visual distinction, the mechanic feels confusing rather than challenging.

**Independent Test**: Can be fully tested by reaching level 4, observing the bottom of the board, and confirming obstacle rows have a clearly different appearance from regular blocks. Delivers clarity independently.

**Acceptance Scenarios**:

1. **Given** an obstacle row appears, **When** the player views the board, **Then** the obstacle row cells display a single uniform dark color (distinct from the vibrant palette colors of normal Tetris blocks)
2. **Given** the player clears a row that was an obstacle row, **When** the row is removed, **Then** the board collapses normally (no special treatment needed for cleared obstacle rows)
3. **Given** obstacle rows are present, **When** the player views the level/difficulty information, **Then** the current number of obstacle rows or level is displayed (existing level counter is sufficient)

---

### Edge Cases

- What happens when the obstacle row has a gap that a piece cannot possibly fit through? The obstacle row must always contain at least one gap (minimum one empty cell) to remain clearable.
- What happens if a player levels up while the board is nearly full and pushing blocks up causes a stack to reach the spawn area? The game-over condition triggers immediately — the push occurs, and if any occupied cells overflow into the spawn zone, game over is declared before the next piece spawns.
- What happens to obstacle rows when lines above them are cleared? Obstacle rows shift down exactly like normal rows — standard Tetris gravity applies.
- What is the maximum number of obstacle rows? There is no explicit cap; the game continues adding obstacle rows on each level-up beyond 3 until game over naturally occurs.
- What if the player's speed is already at or above 3x before reaching level 3 (e.g., due to a legacy config)? Speed is clamped to 3x base at level 3 and the uniform increase logic governs levels 1–3.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST increase block fall speed uniformly across level-ups from level 0 to level 3, with the speed at level 3 being exactly 3x the base (level 0) speed
- **FR-002**: System MUST calculate the per-level speed increment as (3x base speed − base speed) ÷ 3 = 0.67x base speed per level, yielding Level 1=1.67x, Level 2=2.33x, Level 3=3.0x
- **FR-003**: System MUST cap block fall speed at 3x the base speed upon reaching level 3; no further speed increase occurs for levels 4 and beyond
- **FR-004**: System MUST add exactly one obstacle row to the very bottom of the play field each time the player levels up beyond level 3 (i.e., at level 4, 5, 6, etc.), pushing all existing blocks upward by one row (garbage-row insertion)
- **FR-005**: Each obstacle row MUST contain between 1 and 3 randomly positioned empty cells (gaps), with the count and positions randomized independently for each row added
- **FR-006**: Obstacle rows MUST be visually distinguishable from normal player-placed blocks by using a single uniform dark color (not a vibrant palette color)
- **FR-007**: Obstacle rows MUST participate in standard line-clear logic — if a player fills all cells in an obstacle row, that row is cleared and the player receives normal scoring
- **FR-008**: Obstacle rows MUST shift down with the board when lines above them are cleared (standard Tetris gravity)
- **FR-009**: System MUST trigger game over under standard conditions even if an obstacle row addition causes the board to overflow to the spawn area

### Key Entities

- **Level**: The player's current level (integer ≥ 0). Determines both speed multiplier and number of obstacle rows added.
- **Base Speed**: The block fall speed at level 0, used as the reference for all speed calculations.
- **Speed Multiplier**: A computed value from 1.0 (level 0) to 3.0 (level 3+), applied to base speed. Increases uniformly by 0.67 per level for levels 1–3 (Level 1=1.67x, Level 2=2.33x, Level 3=3.0x).
- **Obstacle Row**: A pre-filled row added at the bottom of the play field when leveling up beyond level 3. Contains 1–3 randomly positioned empty cells (randomized per row). Visually distinct from player-placed blocks.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At level 1, block fall speed is exactly 1.67x base speed (±1% tolerance); at level 2, exactly 2.33x; at level 3, exactly 3x — verifiable by timing 10 block falls at each level
- **SC-002**: Speed does not increase beyond 3x base for any level above 3 — verifiable by observing fall speed at level 4, 5, and 6
- **SC-003**: Each level-up event beyond level 3 adds exactly one obstacle row at the bottom — verifiable by counting bottom rows after leveling up multiple times
- **SC-004**: 100% of obstacle rows contain between 1 and 3 empty cells — verifiable by inspecting all added rows across 20+ level-up events
- **SC-005**: Players can visually distinguish obstacle rows from normal blocks within 2 seconds of viewing the board — verifiable by user observation test
- **SC-006**: Obstacle rows are cleared by standard line-clear logic and do not cause unexpected behavior — verifiable by clearing obstacle rows and confirming normal board collapse

## Clarifications

### Session 2026-03-13

- Q: When a new obstacle row is added, how does it interact with existing blocks on the board? → A: All existing blocks are pushed up by one row; the obstacle row inserts at the very bottom (garbage-row style).
- Q: What are the exact speed values at each level for the uniform progression? → A: Level 0=1x, Level 1=1.67x, Level 2=2.33x, Level 3=3x (three equal increments of +0.67x base speed).
- Q: How many empty cells (gaps) does each obstacle row contain? → A: Random 1–3 empty cells per row (variable difficulty, gap positions randomized each time).

## Assumptions

- The existing level-up scoring formula (from feature 004: Level × 100 × 2 points per level) remains unchanged.
- "Base speed" refers to the block fall speed at level 0 as it exists in the current codebase.
- The existing feature 004 speed system (up to 4x at max level) is being **replaced** by this new system: levels 1–3 ramp uniformly to 3x, and levels 4+ add obstacle rows instead of increasing speed further.
- The gap count in each obstacle row is randomly 1–3 empty cells, with positions randomized independently per row (confirmed via clarification).
- The down-key soft-drop speed multiplier (4x from feature 004) remains unaffected and continues to work relative to the current level speed.
