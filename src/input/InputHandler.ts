/**
 * Input Handler
 *
 * Manages keyboard input and maps keys to game actions.
 * - Down arrow: 4x speed acceleration (hold for controlled descent)
 * - Spacebar: Instant hard drop to bottom
 */

import type { GameAPI } from '../game/types';
import { DOWN_KEY_MULTIPLIER } from '../config/constants';

export class InputHandler {
  private game: GameAPI;
  private keydownHandler: (e: KeyboardEvent) => void;
  private keyupHandler: (e: KeyboardEvent) => void;
  private speedMultiplier: number = 1.0;

  constructor(game: GameAPI) {
    this.game = game;

    this.keydownHandler = (e: KeyboardEvent) => {
      this.handleKeydown(e);
    };

    this.keyupHandler = (e: KeyboardEvent) => {
      this.handleKeyup(e);
    };

    document.addEventListener('keydown', this.keydownHandler);
    document.addEventListener('keyup', this.keyupHandler);
  }

  /**
   * Remove event listeners (cleanup)
   */
  public destroy(): void {
    document.removeEventListener('keydown', this.keydownHandler);
    document.removeEventListener('keyup', this.keyupHandler);
  }

  private handleKeydown(e: KeyboardEvent): void {
    const state = this.game.getGameState();

    // Ignore input if not playing (except P and R)
    if (state.status !== 'playing' && e.key !== 'p' && e.key !== 'P' && e.key !== 'r' && e.key !== 'R') {
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.game.moveLeft();
        break;

      case 'ArrowRight':
        e.preventDefault();
        this.game.moveRight();
        break;

      case 'ArrowDown':
        e.preventDefault();
        // Activate 4x speed multiplier when down arrow is held
        this.speedMultiplier = DOWN_KEY_MULTIPLIER;
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.game.rotate();
        break;

      case ' ':
        e.preventDefault();
        // Instant hard drop to bottom (takes priority over down arrow)
        this.game.hardDrop();
        break;

      case 'p':
      case 'P':
        e.preventDefault();
        if (state.status === 'playing') {
          this.game.pause();
        } else if (state.status === 'paused') {
          this.game.resume();
        }
        break;

      case 'r':
      case 'R':
        e.preventDefault();
        if (state.status === 'gameover') {
          this.game.reset();
          this.game.start();
        }
        break;
    }
  }

  private handleKeyup(e: KeyboardEvent): void {
    const state = this.game.getGameState();

    // Ignore input if not playing
    if (state.status !== 'playing') {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        // Deactivate 4x speed multiplier when down arrow is released
        this.speedMultiplier = 1.0;
        break;
    }
  }

  /**
   * Get current speed multiplier from down key state
   * @returns Speed multiplier (1.0 or DOWN_KEY_MULTIPLIER)
   */
  public getSpeedMultiplier(): number {
    return this.speedMultiplier;
  }
}
