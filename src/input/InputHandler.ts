/**
 * Input Handler
 *
 * Manages keyboard input and maps keys to game actions.
 */

import type { GameAPI } from '../game/types';

export class InputHandler {
  private game: GameAPI;
  private keydownHandler: (e: KeyboardEvent) => void;

  constructor(game: GameAPI) {
    this.game = game;

    this.keydownHandler = (e: KeyboardEvent) => {
      this.handleKeydown(e);
    };

    document.addEventListener('keydown', this.keydownHandler);
  }

  /**
   * Remove event listeners (cleanup)
   */
  public destroy(): void {
    document.removeEventListener('keydown', this.keydownHandler);
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
        this.game.moveDown();
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.game.rotate();
        break;

      case ' ':
        e.preventDefault();
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
}
