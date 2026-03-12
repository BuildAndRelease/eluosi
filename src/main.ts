/**
 * Main Entry Point
 *
 * Initializes the Tetris game, sets up rendering, input handling, audio, and persistence.
 */

import { Game } from './game/Game';
import { Renderer } from './render/Renderer';
import { InputHandler } from './input/InputHandler';
import { SoundManager } from './audio/SoundManager';
import { StorageManager } from './storage/StorageManager';

// Get Canvas element
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null;

if (!canvas) {
  throw new Error('Canvas element #game-canvas not found');
}

// Initialize game components
const game = new Game();
const renderer = new Renderer(canvas, game);
const soundManager = new SoundManager();
const storageManager = new StorageManager();
new InputHandler(game); // Keep reference to prevent garbage collection

// Load persistent data
const persistentData = storageManager.load();
soundManager.setVolume(persistentData.settings.volume);
game.setHighScore(persistentData.highScore);

// Initialize audio on first user interaction
let audioInitialized = false;
const initAudio = async () => {
  if (!audioInitialized) {
    await soundManager.initialize();
    audioInitialized = true;
  }
};

document.addEventListener('keydown', initAudio, { once: true });
document.addEventListener('click', initAudio, { once: true });

// Connect game events to sound effects
game.onLinesClear = (count) => {
  soundManager.play('clear');
  storageManager.addLines(count);
};

game.onGameOver = (finalScore) => {
  soundManager.play('game_over');
  storageManager.updateHighScore(finalScore);
  storageManager.incrementGames();
};

game.onLinesClear = (count) => {
  soundManager.play('clear');
  storageManager.addLines(count);
};

// Game loop
function gameLoop(): void {
  const state = game.getGameState();
  renderer.render(state);
  requestAnimationFrame(gameLoop);
}

// Start rendering loop
gameLoop();

// Auto-start game for development
game.start();

console.log('Eluosi initialized - Game ready');
console.log('Controls: Arrow keys to move, Space to hard drop, P to pause, R to restart');
console.log(`High Score: ${persistentData.highScore}`);

