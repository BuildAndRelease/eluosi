/**
 * Input Handler
 *
 * Manages keyboard input and maps keys to game actions.
 * Handles fast drop acceleration with spacebar press/release.
 */

import type { GameAPI } from '../game/types';
import { FastDropManager } from '../utils/FastDropManager';

export class InputHandler {
  private game: GameAPI;
  private keydownHandler: (e: KeyboardEvent) => void;
  private keyupHandler: (e: KeyboardEvent) => void;
  private fastDropManager: FastDropManager;

  constructor(game: GameAPI) {
    this.game = game;
    this.fastDropManager = new FastDropManager();

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

  /**
   * Get fast drop manager instance for game loop integration
   */
  public getFastDropManager(): FastDropManager {
    return this.fastDropManager;
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
        // Activate fast drop on spacebar press
        this.fastDropManager.activate();
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
      case ' ':
        e.preventDefault();
        // Deactivate fast drop on spacebar release
        this.fastDropManager.deactivate();
        break;
    }
  }
}
