/**
 * Sound Manager
 *
 * Manages Web Audio API for metallic sound effects.
 * Handles loading, playback, volume control, and mute.
 */

import type { SoundType } from '../game/types';
import { AUDIO_FILE_PATHS, DEFAULT_VOLUME } from '../config/constants';

export class SoundManager {
  private audioContext: AudioContext | null = null;
  private buffers: Map<SoundType, AudioBuffer> = new Map();
  private gainNode: GainNode | null = null;
  private muted: boolean = false;
  private volume: number = DEFAULT_VOLUME;
  private loadingPromise: Promise<void> | null = null;

  /**
   * Initialize AudioContext (must be called after user interaction)
   */
  public async initialize(): Promise<void> {
    if (this.audioContext) {
      return;
    }

    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.gainNode.gain.value = this.volume / 100;

    // Resume if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.loadingPromise = this.loadAllSounds();
    await this.loadingPromise;
  }

  /**
   * Play a sound effect
   *
   * @param type - Sound type to play
   */
  public play(type: SoundType): void {
    if (this.muted || !this.audioContext || !this.gainNode) {
      return;
    }

    const buffer = this.buffers.get(type);
    if (!buffer) {
      // Sound not loaded yet, skip silently
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gainNode);
    source.start(0);
  }

  /**
   * Set volume (0-100)
   */
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume));

    if (this.gainNode) {
      this.gainNode.gain.value = this.muted ? 0 : this.volume / 100;
    }
  }

  /**
   * Get current volume
   */
  public getVolume(): number {
    return this.volume;
  }

  /**
   * Toggle mute
   */
  public mute(): void {
    this.muted = true;
    if (this.gainNode) {
      this.gainNode.gain.value = 0;
    }
  }

  /**
   * Unmute
   */
  public unmute(): void {
    this.muted = false;
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume / 100;
    }
  }

  /**
   * Check if muted
   */
  public isMuted(): boolean {
    return this.muted;
  }

  /**
   * Load all sound files
   */
  private async loadAllSounds(): Promise<void> {
    const loadPromises = Object.entries(AUDIO_FILE_PATHS).map(async ([key, path]) => {
      const soundType = key.toLowerCase() as SoundType;
      try {
        await this.loadSound(soundType, path);
      } catch {
        // Sound file not found, continue without it
        console.warn(`Sound file not found: ${path}`);
      }
    });

    await Promise.allSettled(loadPromises);
  }

  /**
   * Load a single sound file
   */
  private async loadSound(type: SoundType, url: string): Promise<void> {
    if (!this.audioContext) {
      return;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch sound: ${url}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.buffers.set(type, audioBuffer);
  }
}
