# Feature Specification: UI Controls and Visual Redesign

**Feature Branch**: `003-ui-controls-redesign`
**Created**: 2026-03-12
**Status**: Draft
**Input**: User description: "基于现有的框架：
1、修改操控按钮，按键盘下键2倍速加速下落，按空格键直接落下。
2、整体背景色修改左上角淡蓝，到右下角深紫。
3、游戏区域边框修改，改成半透明高斯模糊带有立体阴影的效果。
4、游戏区域积木的效果，以及下一个积木的展示效果修改，改成半透明玻璃质感效果
5、整体游戏区域的界面设计需要具有科技感。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Improved Drop Controls (Priority: P1)

Players can use keyboard controls for precise block placement with two distinct drop speeds: down arrow for 2x speed controlled descent, and spacebar for instant drop to bottom.

**Why this priority**: Core gameplay control directly impacts player experience and game feel. This is the most frequently used interaction and must work perfectly for the game to be playable.

**Independent Test**: Can be fully tested by pressing down arrow during block fall (observes 2x speed) and pressing spacebar (observes instant drop), delivers immediate gameplay improvement.

**Acceptance Scenarios**:

1. **Given** a block is falling at normal speed, **When** player presses down arrow key, **Then** block falls at 2x normal speed while key is held
2. **Given** a block is falling, **When** player presses spacebar, **Then** block instantly drops to the lowest valid position and locks
3. **Given** player is holding down arrow, **When** player releases the key, **Then** block returns to normal falling speed
4. **Given** player presses spacebar during down arrow acceleration, **When** spacebar is pressed, **Then** block immediately hard drops (spacebar takes priority)

---

### User Story 2 - Modern Glassmorphism Visual Style (Priority: P2)

Players experience a modern, tech-inspired visual design with semi-transparent glass-effect blocks, gradient background, and frosted-glass game board border with depth shadows.

**Why this priority**: Visual appeal significantly enhances user engagement and perceived quality, but doesn't impact core gameplay mechanics. Can be implemented independently of control changes.

**Independent Test**: Can be tested by observing the game interface and verifying gradient background, frosted border effects, and glass-textured blocks are visible.

**Acceptance Scenarios**:

1. **Given** game is running, **When** player views the interface, **Then** background displays gradient from light blue (top-left) to deep purple (bottom-right)
2. **Given** game board is visible, **When** player observes the border, **Then** border shows semi-transparent frosted glass effect with gaussian blur and 3D shadow depth
3. **Given** blocks are on the game board, **When** player views blocks, **Then** blocks display semi-transparent glass texture with light refraction effects
4. **Given** next piece preview is visible, **When** player views preview area, **Then** preview blocks also display glass texture matching game board blocks

---

### User Story 3 - Tech-Inspired UI Design (Priority: P3)

Players interact with a cohesive futuristic interface design that creates an immersive tech-aesthetic experience through consistent visual language across all UI elements.

**Why this priority**: Enhances overall aesthetic cohesion and brand identity, but is less critical than functional controls and primary visual effects.

**Independent Test**: Can be tested by reviewing all UI elements (score display, level indicator, controls hint) for consistent tech-inspired styling.

**Acceptance Scenarios**:

1. **Given** game interface is displayed, **When** player views all UI elements, **Then** all text, borders, and indicators follow consistent tech-inspired design language
2. **Given** game is running, **When** player observes UI animations, **Then** transitions and effects maintain futuristic aesthetic
3. **Given** player views the complete interface, **When** assessing visual coherence, **Then** all elements (background, board, blocks, UI) form unified tech-aesthetic experience

---

### Edge Cases

- Down arrow held during block lock: If down arrow is held when block locks, next block should start at normal speed (not 2x)
- Spacebar pressed when block already at bottom: Should lock immediately without error
- Rapid key switching (down arrow to spacebar): Spacebar should take immediate priority and trigger hard drop
- Glass effect on overlapping blocks: Semi-transparent blocks stacked should show depth through transparency
- Gradient background on different screen sizes: Gradient should scale proportionally maintaining visual balance
- Frosted border on low-end devices: Should degrade gracefully if gaussian blur is too performance-intensive

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST change down arrow key behavior from previous fast drop to 2x speed acceleration (not instant drop)
- **FR-002**: System MUST implement spacebar as instant hard drop that places block at lowest valid position immediately
- **FR-003**: System MUST apply gradient background from light blue (#87CEEB or similar) at top-left to deep purple (#4B0082 or similar) at bottom-right
- **FR-004**: System MUST render game board border with semi-transparent frosted glass effect using gaussian blur
- **FR-005**: System MUST add 3D shadow depth effect to game board border
- **FR-006**: System MUST render all game blocks with semi-transparent glass texture effect
- **FR-007**: System MUST apply same glass texture to next piece preview blocks
- **FR-008**: System MUST maintain consistent tech-inspired visual design across all UI elements (score, level, controls)
- **FR-009**: Down arrow key MUST return block to normal speed when released
- **FR-010**: Spacebar MUST take priority over down arrow if both controls are active

### Key Entities

- **Block**: Game piece with semi-transparent glass texture, light refraction properties, and tech-aesthetic styling
- **Game Board**: Playing field with frosted glass border, gaussian blur effect, and 3D shadow depth
- **Background**: Full-screen gradient canvas transitioning from light blue (top-left) to deep purple (bottom-right)
- **UI Elements**: Score display, level indicator, next piece preview, all styled with consistent tech-inspired design language

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can distinguish between 2x speed (down arrow) and instant drop (spacebar) within 3 seconds of first use
- **SC-002**: Glass texture effects are visible and recognizable on all blocks within 1 second of viewing game board
- **SC-003**: Gradient background transitions smoothly across entire viewport without banding or color breaks
- **SC-004**: Frosted glass border effect is clearly visible with depth perception from 3D shadows
- **SC-005**: 90% of players report improved visual appeal compared to previous version in user testing
- **SC-006**: Game maintains 60 FPS minimum with all new visual effects active
- **SC-007**: Control response time remains under 50ms for both down arrow and spacebar inputs

## Assumptions

- Glass texture effects refer to semi-transparent appearance with light refraction, not actual 3D glass modeling
- Gaussian blur for frosted effect can be achieved with CSS backdrop-filter or Canvas blur operations
- Light blue to deep purple gradient represents "tech-inspired" aesthetic (cyberpunk/futuristic style)
- 2x speed for down arrow is fast enough for skilled play but slow enough to maintain control
- Instant drop (spacebar) means immediate placement at lowest valid position, not animated fast fall
- Tech-inspired design includes elements like: clean lines, subtle glows, modern typography, minimal ornamentation
- Target devices can handle additional rendering for glass effects and blur without performance degradation
- Existing 3D block rendering from V2 will be replaced/modified with new glass texture style

## Dependencies

- Existing Tetris game implementation (001-core-tetris-game, 002-3d-visual-enhancements)
- Current input handling system for keyboard controls
- Existing rendering pipeline for blocks and game board
- Canvas 2D API or CSS capabilities for blur and transparency effects

## Out of Scope

- Mobile touch controls (feature is keyboard-specific)
- Customizable color themes or gradient options
- Animated transitions for gradient background
- Particle effects for hard drop (spacebar)
- Sound effects for new controls
- Accessibility options for reduced transparency/blur
- Performance optimization for devices that cannot handle blur effects
- Alternative control schemes (mouse, gamepad)
