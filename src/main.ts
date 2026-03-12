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
import { AnimationManager } from './utils/AnimationManager';

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
const animationManager = new AnimationManager();
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
game.onLinesClear = (count, rows, gridColors) => {
  soundManager.play('clear');
  storageManager.addLines(count);
  // Trigger particle explosions
  renderer.triggerLineClearAnimation(rows, gridColors);
};

game.onGameOver = (finalScore) => {
  soundManager.play('game_over');
  storageManager.updateHighScore(finalScore);
  storageManager.incrementGames();
};

game.onLinesClear = (count, rows, gridColors) => {
  soundManager.play('clear');
  storageManager.addLines(count);
  // Trigger particle explosions
  renderer.triggerLineClearAnimation(rows, gridColors);
};

// Performance monitoring
let frameCount = 0;
let lastFpsUpdate = performance.now();
let currentFps = 60;

// Game loop
function gameLoop(): void {
  const currentTime = performance.now();

  // Update FPS counter every second
  frameCount++;
  if (currentTime - lastFpsUpdate >= 1000) {
    currentFps = frameCount;
    frameCount = 0;
    lastFpsUpdate = currentTime;
  }

  // Update animations
  animationManager.update(currentTime);

  // Render game state
  const state = game.getGameState();
  renderer.render(state);

  requestAnimationFrame(gameLoop);
}

// Expose performance metrics for debugging
(window as any).getPerformanceMetrics = () => ({
  fps: currentFps,
  activeAnimations: animationManager.getActiveCount(),
});

// Start rendering loop
gameLoop();

// Auto-start game for development
game.start();

console.log('Eluosi initialized - Game ready');
console.log('Controls: Arrow keys to move, Space to hard drop, P to pause, R to restart');
console.log(`High Score: ${persistentData.highScore}`);

