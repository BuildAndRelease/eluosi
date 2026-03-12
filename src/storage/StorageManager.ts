/**
 * Storage Manager
 *
 * Manages localStorage persistence for high scores, settings, and statistics.
 * Handles errors gracefully - game continues without persistence if storage fails.
 */

import type { PersistentData, Settings } from '../game/types';
import { STORAGE_KEYS, DEFAULT_VOLUME } from '../config/constants';

const DEFAULT_DATA: PersistentData = {
  highScore: 0,
  totalGames: 0,
  totalLines: 0,
  lastPlayTime: 0,
  settings: {
    volume: DEFAULT_VOLUME,
    showGrid: true,
  },
};

export class StorageManager {
  /**
   * Load persistent data from localStorage
   *
   * @returns Validated persistent data, or defaults if not found/corrupted
   */
  public load(): PersistentData {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GAME_DATA);
      if (!raw) {
        return { ...DEFAULT_DATA };
      }

      const parsed: unknown = JSON.parse(raw);
      return this.validateData(parsed);
    } catch {
      console.warn('Failed to load game data from localStorage');
      return { ...DEFAULT_DATA };
    }
  }

  /**
   * Save persistent data to localStorage
   *
   * @param data - Data to save
   */
  public save(data: PersistentData): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_DATA, JSON.stringify(data));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.warn('localStorage full, continuing without persistence');
      } else {
        console.warn('Failed to save game data to localStorage');
      }
    }
  }

  /**
   * Update high score if new score is higher
   *
   * @param score - New score to compare
   * @returns Updated data
   */
  public updateHighScore(score: number): PersistentData {
    const data = this.load();
    if (score > data.highScore) {
      const updated = { ...data, highScore: score };
      this.save(updated);
      return updated;
    }
    return data;
  }

  /**
   * Increment total games count
   */
  public incrementGames(): void {
    const data = this.load();
    this.save({ ...data, totalGames: data.totalGames + 1, lastPlayTime: Date.now() });
  }

  /**
   * Add to total lines cleared
   */
  public addLines(count: number): void {
    const data = this.load();
    this.save({ ...data, totalLines: data.totalLines + count });
  }

  /**
   * Save settings
   */
  public saveSettings(settings: Settings): void {
    const data = this.load();
    this.save({ ...data, settings });
  }

  /**
   * Validate and sanitize data from localStorage
   */
  public validateData(data: unknown): PersistentData {
    const raw = data as Record<string, unknown>;

    return {
      highScore: Math.max(0, Number(raw?.['highScore']) || 0),
      totalGames: Math.max(0, Number(raw?.['totalGames']) || 0),
      totalLines: Math.max(0, Number(raw?.['totalLines']) || 0),
      lastPlayTime: Number(raw?.['lastPlayTime']) || Date.now(),
      settings: this.validateSettings(raw?.['settings']),
    };
  }

  private validateSettings(settings: unknown): Settings {
    const raw = settings as Record<string, unknown>;

    return {
      volume: Math.min(100, Math.max(0, Number(raw?.['volume']) ?? DEFAULT_VOLUME)),
      showGrid: Boolean(raw?.['showGrid'] ?? true),
    };
  }
}
